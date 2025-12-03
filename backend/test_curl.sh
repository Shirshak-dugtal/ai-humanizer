#!/bin/bash

# Manual cURL test for AI Text Humanizer API
# Run this after starting the API service

API_URL="http://localhost:4100"
AUTH_CODE="8472951630584729"

echo "🧪 Testing AI Text Humanizer API with cURL"
echo "================================================"

# Test 1: Health Check
echo "Test 1: Health Check"
echo "Command: curl -X GET $API_URL/health"
curl -X GET "$API_URL/health"
echo -e "\n"

# Test 2: Humanize Text
echo "Test 2: Humanize AI Text"
echo "Command: curl -X POST $API_URL/humanize -H \"Authorization: $AUTH_CODE\" -d '{...}'"
curl -X POST "$API_URL/humanize" \
  -H "Content-Type: application/json" \
  -H "Authorization: $AUTH_CODE" \
  -d '{
    "text": "The implementation of artificial intelligence algorithms necessitates comprehensive computational optimization and systematic performance enhancement methodologies to achieve optimal operational efficiency.",
    "temperature": 0.7,
    "max_new_tokens": 200
  }'
echo -e "\n"

# Test 3: Conservative Humanization
echo "Test 3: Conservative Humanization (temperature=0.3)"
curl -X POST "$API_URL/humanize" \
  -H "Content-Type: application/json" \
  -H "Authorization: $AUTH_CODE" \
  -d '{
    "text": "The utilization of machine learning paradigms facilitates enhanced predictive capabilities in data analysis applications.",
    "temperature": 0.3
  }'
echo -e "\n"

# Test 4: Creative Humanization
echo "Test 4: Creative Humanization (temperature=1.0)"
curl -X POST "$API_URL/humanize" \
  -H "Content-Type: application/json" \
  -H "Authorization: $AUTH_CODE" \
  -d '{
    "text": "The optimization of computational resources requires systematic evaluation of algorithmic efficiency metrics.",
    "temperature": 1.0
  }'
echo -e "\n"

# Test 5: Error Test (no auth)
echo "Test 5: Error Test (no authorization - should fail)"
curl -X POST "$API_URL/humanize" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Test text"
  }'
echo -e "\n"

echo "================================================"
echo "✅ All cURL tests completed!"