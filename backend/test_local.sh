#!/bin/bash

# Local test runner (without Docker)

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🧪 Local Test for AI Text Humanizer API${NC}"
echo "================================================"

# Check if model exists
if [ ! -d "../instruction_lora_humanizer_adapter" ]; then
    echo -e "${RED}❌ Model not found at '../instruction_lora_humanizer_adapter'${NC}"
    echo "This is expected if training hasn't completed yet."
else
    echo -e "${GREEN}✅ Model directory found${NC}"
    
    # Check for safetensors file
    if [ -f "../instruction_lora_humanizer_adapter/adapter_model.safetensors" ]; then
        echo -e "${GREEN}✅ Found adapter_model.safetensors${NC}"
        ls -la "../instruction_lora_humanizer_adapter/adapter_model.safetensors"
    else
        echo -e "${YELLOW}⚠️  adapter_model.safetensors not found${NC}"
        echo "Available files in adapter directory:"
        ls -la "../instruction_lora_humanizer_adapter/" 2>/dev/null || echo "Directory not accessible"
    fi
fi
echo ""

# Test Python dependencies
echo -e "${YELLOW}📦 Checking Python dependencies...${NC}"
python -c "
try:
    import fastapi, uvicorn, torch, transformers, peft
    print('✅ All required packages available')
except ImportError as e:
    print(f'❌ Missing package: {e}')
    print('Run: pip install -r requirements.txt')
"

# Test the API structure
echo -e "\n${YELLOW}🔍 API Structure Validation${NC}"
python -c "
import sys
sys.path.append('.')
try:
    from main import app
    print('✅ FastAPI app loads successfully')
    
    # Check endpoints
    routes = [route.path for route in app.routes if hasattr(route, 'path')]
    print(f'Available routes: {routes}')
except Exception as e:
    print(f'❌ Error loading API: {e}')
"

echo -e "\n${GREEN}✅ Local validation complete!${NC}"
echo ""
echo "To start the service locally:"
echo "  python main.py"
echo ""
echo "To test with Docker:"
echo "  docker-compose up --build"
echo ""
echo "Authorization code: 8472951630584729"