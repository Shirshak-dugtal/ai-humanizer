#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting AI Text Humanizer API...${NC}"

# Check if model exists
if [ ! -d "../instruction_lora_humanizer_adapter" ]; then
    echo -e "${RED}❌ Error: Model not found!${NC}"
    echo "Please ensure you have completed training and the model is saved in '../instruction_lora_humanizer_adapter'"
    exit 1
fi

echo -e "${GREEN}✅ Model directory found${NC}"

# Build and run with Docker Compose
echo -e "${YELLOW}🔨 Building Docker image...${NC}"
docker-compose up --build -d

# Wait for service to be healthy
echo -e "${YELLOW}⏳ Waiting for service to start...${NC}"
sleep 10

# Check health
echo -e "${YELLOW}🔍 Checking service health...${NC}"
curl -s http://localhost:4100/health | jq '.' || echo -e "${RED}Service not responding${NC}"

echo -e "${GREEN}✅ Service started successfully!${NC}"
echo -e "${YELLOW}📡 API running on: http://localhost:4100${NC}"
echo -e "${YELLOW}🔑 Authorization code: 8472951630584729${NC}"
echo ""
echo "Available endpoints:"
echo "  GET  /health  - Health check"
echo "  GET  /info    - API info (requires auth)"
echo "  POST /humanize - Humanize text (requires auth)"