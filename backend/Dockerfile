FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better Docker layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY main.py .

# Create directory for model files
RUN mkdir -p instruction_lora_humanizer_adapter

# Copy model files if they exist (they should be in parent directory)
COPY ../instruction_lora_humanizer_adapter/* ./instruction_lora_humanizer_adapter/ 2>/dev/null || echo "Model files not found - will look in parent directory"

# Expose port
EXPOSE 4100

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:4100/health || exit 1

# Run the application
CMD ["python", "main.py"]