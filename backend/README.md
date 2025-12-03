# AI Text Humanizer API

A FastAPI-based service for humanizing AI-generated text using a fine-tuned language model.

## Features

- 🤖 **Fine-tuned Model**: Uses your trained LoRA adapter for text humanization
- 🔐 **Secure Access**: 16-digit authorization code required
- 🚀 **High Performance**: Optimized for fast inference
- 🐳 **Dockerized**: Easy deployment with Docker
- 📊 **Health Monitoring**: Built-in health checks and monitoring

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Completed model training (LoRA adapter saved)

### 1. Start the Service
```bash
cd backend
chmod +x start.sh
./start.sh
```

### 2. Test the API
```bash
chmod +x test_api.sh
./test_api.sh
```

## API Documentation

### Authorization
All protected endpoints require the authorization header:
```
Authorization: 8472951630584729
```

### Endpoints

#### `GET /health`
Health check endpoint (no auth required)

#### `GET /info`
API information (requires auth)

#### `POST /humanize`
Humanize AI-generated text (requires auth)

**Request Body:**
```json
{
  "text": "Your AI-generated text here",
  "temperature": 0.7,
  "max_new_tokens": 300,
  "top_p": 0.9
}
```

**Response:**
```json
{
  "original_text": "...",
  "humanized_text": "...",
  "success": true,
  "message": "Text humanized successfully"
}
```

## Manual Testing with cURL

### Basic Test
```bash
curl -X POST "http://localhost:4100/humanize" \
  -H "Content-Type: application/json" \
  -H "Authorization: 8472951630584729" \
  -d '{
    "text": "The implementation of artificial intelligence necessitates comprehensive computational optimization.",
    "temperature": 0.7
  }'
```

### Health Check
```bash
curl http://localhost:4100/health
```

## Configuration

- **Port**: 4100
- **Authorization Code**: `8472951630584729`
- **Model Path**: `../instruction_lora_humanizer_adapter`
- **Max Text Length**: 5000 characters

## Development

### Local Development
```bash
pip install -r requirements.txt
python main.py
```

### Docker Development
```bash
docker-compose up --build
```

## Monitoring

The service includes:
- Health check endpoint at `/health`
- Docker health checks
- Comprehensive logging
- Error handling and validation

## Production Notes

- Adjust memory limits in `docker-compose.yml` based on your model size
- Monitor GPU/CPU usage for optimal performance
- Consider rate limiting for production deployments
- Update authorization code for production use