# AI Text Humanizer with LoRA Fine-tuning

Transform formal, robotic AI-generated text into natural, human-like content using a fine-tuned DialoGPT model.

## 🎯 Features

- **Custom Fine-tuned Model**: DialoGPT-medium with LoRA adapters
- **Efficient Training**: Parameter-efficient fine-tuning (LoRA)
- **REST API**: FastAPI backend for easy integration
- **Modern Frontend**: React + TypeScript UI
- **Docker Ready**: Containerized deployment

## 🏗️ Architecture

```
Frontend (React + TypeScript)
    ↓
Backend API (FastAPI)
    ↓
DialoGPT-medium + LoRA Adapters
```

## 📁 Project Structure

```
fine-tune/
├── humanizer_finetuning.ipynb    # Training notebook
├── adapter_config.json            # LoRA configuration
├── backend/                       # FastAPI server
│   ├── main.py                   # API endpoints
│   ├── requirements.txt          # Python dependencies
│   └── Dockerfile                # Container config
├── frontend/                      # React application
│   ├── src/                      # Source code
│   └── package.json              # Node dependencies
└── instruction_lora_humanizer_adapter/  # Trained model weights
```

## 🚀 Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

Server runs on `http://localhost:4100`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

UI runs on `http://localhost:5173`

## 📊 Model Details

- **Base Model**: microsoft/DialoGPT-medium (355M parameters)
- **Fine-tuning Method**: LoRA (Low-Rank Adaptation)
- **Trainable Parameters**: ~2M (0.56% of total)
- **Training Data**: 8,000 formal→natural text pairs
- **Training Time**: ~30-60 minutes on GPU

## 🔧 Configuration

### LoRA Settings
- Rank (r): 8
- Alpha: 16
- Target Modules: c_attn, c_proj
- Dropout: 0.05

### API Authentication
- Authorization Code: `8472951630584729`

## 📝 API Usage

```bash
curl -X POST http://localhost:4100/humanize \
  -H "Content-Type: application/json" \
  -H "Authorization: 8472951630584729" \
  -d '{
    "text": "The utilization of advanced computational methodologies...",
    "temperature": 0.7
  }'
```

## 🧠 Training

See `humanizer_finetuning.ipynb` for the complete training pipeline:

1. Dataset preparation
2. Model loading
3. LoRA configuration
4. Training
5. Evaluation
6. Inference testing

## 📚 Documentation

- **PROJECT_OVERVIEW.md**: Comprehensive technical documentation
- **backend/README.md**: Backend API details
- **frontend/README.md**: Frontend setup guide

## 🛠️ Tech Stack

**ML/AI:**
- PyTorch
- Transformers (Hugging Face)
- PEFT (LoRA)

**Backend:**
- FastAPI
- Uvicorn

**Frontend:**
- React
- TypeScript
- Vite
- Tailwind CSS

## 📦 Model Files

**Note**: Model weight files (`*.safetensors`, `*.bin`) are excluded from git due to size.

To use the trained model:
1. Train using `humanizer_finetuning.ipynb`
2. Or download pre-trained weights from releases

## 🎓 Learning Resources

This project demonstrates:
- Transfer learning
- Parameter-efficient fine-tuning (LoRA)
- REST API development
- Full-stack ML applications
- Docker containerization

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Larger training dataset
- Multiple style options
- Streaming responses
- Model quantization

## 📄 License

MIT License

## 🙏 Acknowledgments

- Hugging Face for transformers library
- Microsoft for DialoGPT
- LoRA paper authors

---

**Built with ❤️ using PyTorch, FastAPI, and React**
