#!/bin/bash

# Test script for AI Text Humanizer API
# Authorization code: 8472951630584729

API_URL="http://localhost:4100"
AUTH_CODE="8472951630584729"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🧪 Testing AI Text Humanizer API${NC}"
echo "================================================"

# Test 1: Health check
echo -e "\n${YELLOW}Test 1: Health Check${NC}"
curl -s -X GET "$API_URL/health" | jq '.'

# Test 2: Info endpoint (with auth)
echo -e "\n${YELLOW}Test 2: API Info (with auth)${NC}"
curl -s -X GET "$API_URL/info" \
  -H "Authorization: $AUTH_CODE" | jq '.'

# Test 3: Info endpoint (without auth - should fail)
echo -e "\n${YELLOW}Test 3: API Info (without auth - should fail)${NC}"
curl -s -X GET "$API_URL/info" || echo -e "${RED}Expected: Auth required${NC}"

# Test 4: Humanize text (with auth)
echo -e "\n${YELLOW}Test 4: Humanize Text (with auth)${NC}"
curl -s -X POST "$API_URL/humanize" \
  -H "Content-Type: application/json" \
  -H "Authorization: $AUTH_CODE" \
  -d '{
    "text": "The implementation of artificial intelligence algorithms necessitates comprehensive computational optimization and systematic performance enhancement methodologies.",
    "temperature": 0.7,
    "max_new_tokens": 200
  }' | jq '.'

# Test 5: Humanize text (without auth - should fail)
echo -e "\n${YELLOW}Test 5: Humanize Text (without auth - should fail)${NC}"
curl -s -X POST "$API_URL/humanize" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Test text for humanization",
    "temperature": 0.7
  }' || echo -e "${RED}Expected: Auth required${NC}"

# Test 6: Invalid request (empty text)
echo -e "\n${YELLOW}Test 6: Invalid Request (empty text)${NC}"
curl -s -X POST "$API_URL/humanize" \
  -H "Content-Type: application/json" \
  -H "Authorization: $AUTH_CODE" \
  -d '{
    "text": "",
    "temperature": 0.7
  }' | jq '.'

# Test 7: Different temperature settings
echo -e "\n${YELLOW}Test 7: Conservative Humanization (temperature=0.3)${NC}"
curl -s -X POST "$API_URL/humanize" \
  -H "Content-Type: application/json" \
  -H "Authorization: $AUTH_CODE" \
  -d '{
    "text": "The utilization of machine learning paradigms facilitates enhanced predictive capabilities in data analysis applications.",
    "temperature": 0.3,
    "max_new_tokens": 150
  }' | jq '.humanized_text'

# Test 8: Creative humanization
echo -e "\n${YELLOW}Test 8: Creative Humanization (temperature=1.0)${NC}"
curl -s -X POST "$API_URL/humanize" \
  -H "Content-Type: application/json" \
  -H "Authorization: $AUTH_CODE" \
  -d '{
    "text": "The optimization of computational resources requires systematic evaluation of algorithmic efficiency metrics.",
    "temperature": 1.0,
    "max_new_tokens": 200
  }' | jq '.humanized_text'

echo -e "\n${GREEN}✅ All tests completed!${NC}"
echo "================================================"