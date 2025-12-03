from fastapi import FastAPI, HTTPException, Depends, Header
from pydantic import BaseModel
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
import os
import logging
from typing import Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Static 16-digit authorization code
AUTHORIZATION_CODE = "8472951630584729"

# Global variables for model
model = None
tokenizer = None
device = None

app = FastAPI(
    title="AI Text Humanizer API",
    description="Transform AI-generated text into natural, human-like content",
    version="1.0.0"
)

class TextRequest(BaseModel):
    text: str
    temperature: Optional[float] = 0.7
    max_new_tokens: Optional[int] = 300
    top_p: Optional[float] = 0.9

class TextResponse(BaseModel):
    original_text: str
    humanized_text: str
    success: bool
    message: str

def verify_authorization(authorization: str = Header(...)):
    """Verify the authorization code"""
    if authorization != AUTHORIZATION_CODE:
        raise HTTPException(
            status_code=401, 
            detail="Invalid authorization code"
        )
    return authorization

def load_model():
    """Load the fine-tuned model and tokenizer"""
    global model, tokenizer, device
    
    try:
        # Determine device
        device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Using device: {device}")
        
        # Check for adapter files
        adapter_path = "../instruction_lora_humanizer_adapter"
        if not os.path.exists(adapter_path):
            adapter_path = "./instruction_lora_humanizer_adapter"
        
        if not os.path.exists(adapter_path):
            raise FileNotFoundError("Model adapter not found! Please ensure training is completed.")
        
        # Check for safetensors file
        safetensors_file = os.path.join(adapter_path, "adapter_model.safetensors")
        if os.path.exists(safetensors_file):
            logger.info(f"Found safetensors adapter: {safetensors_file}")
        else:
            logger.warning("adapter_model.safetensors not found, will try other formats")
        
        # Model configuration - use DialoGPT-medium (the actual model from training)
        MODEL_CANDIDATES = [
            "microsoft/DialoGPT-medium",  # The actual model used in training
            "microsoft/DialoGPT-large",
            "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
        ]
        
        # Try loading with the most likely model first
        base_model_name = None
        for model_name in MODEL_CANDIDATES:
            try:
                logger.info(f"Attempting to load base model: {model_name}")
                tokenizer = AutoTokenizer.from_pretrained(model_name)
                
                # Set pad token if not exists
                if tokenizer.pad_token is None:
                    tokenizer.pad_token = tokenizer.eos_token
                
                base_model = AutoModelForCausalLM.from_pretrained(
                    model_name,
                    torch_dtype=torch.float16 if device == "cuda" else torch.float32,
                    device_map="auto" if device == "cuda" else None,
                    load_in_8bit=device == "cuda"  # Use quantization on GPU
                )
                
                if device == "cpu":
                    base_model = base_model.to(device)
                
                # Load LoRA adapter
                model = PeftModel.from_pretrained(base_model, adapter_path)
                model.eval()
                
                base_model_name = model_name
                logger.info(f"Successfully loaded model: {model_name}")
                break
                
            except Exception as e:
                logger.warning(f"Failed to load {model_name}: {e}")
                continue
        
        if model is None:
            raise Exception("Failed to load any compatible model")
        
        logger.info(f"Model loaded successfully: {base_model_name}")
        logger.info(f"Model device: {next(model.parameters()).device}")
        
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        raise

def humanize_text(
    text: str,
    temperature: float = 0.7,
    max_new_tokens: int = 300,
    top_p: float = 0.9
) -> str:
    """Humanize AI-generated text using DialoGPT fine-tuned model"""
    try:
        # Simple conversational prompt for DialoGPT (no special tokens needed)
        # DialoGPT expects simple text-to-text format
        prompt = f"Rewrite this to sound natural and human: {text}\nHumanized:"
        
        # Tokenize input
        inputs = tokenizer(
            prompt,
            return_tensors="pt",
            truncation=True,
            max_length=400  # Leave room for response
        ).to(model.device)
        
        # Generate response
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=max_new_tokens,
                temperature=temperature,
                top_p=top_p,
                do_sample=True,
                repetition_penalty=1.2,
                pad_token_id=tokenizer.eos_token_id,
                eos_token_id=tokenizer.eos_token_id,
                early_stopping=True,
                no_repeat_ngram_size=3
            )
        
        # Decode the full output
        full_response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # Extract only the generated part (after the prompt)
        response = full_response[len(tokenizer.decode(inputs['input_ids'][0], skip_special_tokens=True)):].strip()
        
        # Clean up common issues
        if not response:
            # Fallback: take everything after "Humanized:"
            if "Humanized:" in full_response:
                response = full_response.split("Humanized:")[-1].strip()
            else:
                response = full_response[len(prompt):].strip()
        
        # Remove repetitive patterns
        response = response.strip()
        
        # Take only first coherent output (before repetition starts)
        sentences = response.split('.')
        if len(sentences) > 1:
            # Check for repetition
            unique_sentences = []
            seen = set()
            for sent in sentences:
                sent_clean = sent.strip().lower()
                if sent_clean and sent_clean not in seen:
                    unique_sentences.append(sent.strip())
                    seen.add(sent_clean)
                else:
                    break  # Stop at first repetition
            response = '. '.join(unique_sentences)
            if response and not response.endswith('.'):
                response += '.'
        
        # Final cleanup
        response = response.strip()
        
        # Return humanized text or original if generation failed
        return response if response and len(response) > 10 else text
        
    except Exception as e:
        logger.error(f"Error during text humanization: {e}")
        raise

@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    logger.info("Loading AI Humanizer model...")
    load_model()
    logger.info("Model loaded successfully! API ready.")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "AI Text Humanizer API",
        "status": "healthy",
        "device": str(device),
        "model_loaded": model is not None
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "device": str(device),
        "torch_version": torch.__version__,
        "cuda_available": torch.cuda.is_available()
    }

@app.post("/humanize", response_model=TextResponse)
async def humanize_text_endpoint(
    request: TextRequest,
    auth: str = Depends(verify_authorization)
):
    """
    Humanize AI-generated text
    
    Requires authorization header with 16-digit code: 8472951630584729
    """
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        if len(request.text) > 5000:
            raise HTTPException(status_code=400, detail="Text too long (max 5000 characters)")
        
        logger.info(f"Processing text humanization request: {len(request.text)} characters")
        
        # Humanize the text
        humanized = humanize_text(
            request.text,
            temperature=request.temperature,
            max_new_tokens=request.max_new_tokens,
            top_p=request.top_p
        )
        
        logger.info("Text humanization completed successfully")
        
        return TextResponse(
            original_text=request.text,
            humanized_text=humanized,
            success=True,
            message="Text humanized successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in humanize endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/info")
async def get_info(auth: str = Depends(verify_authorization)):
    """Get API information (requires auth)"""
    return {
        "api_name": "AI Text Humanizer",
        "version": "1.0.0",
        "model_info": {
            "device": str(device),
            "model_loaded": model is not None,
            "torch_version": torch.__version__,
        },
        "endpoints": {
            "POST /humanize": "Humanize AI text (requires auth)",
            "GET /health": "Health check",
            "GET /info": "API information (requires auth)"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=4100)