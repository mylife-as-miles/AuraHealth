# Dr7.ai Medical API: Integration Guide

This document outlines how to integrate and use the Dr7.ai Medical API, specifically focusing on accessing Google DeepMind's MedGemma models and other specialized medical AI tools within the AuraHealth application.

## 1. Getting Started

Follow these three steps to gain access to the Dr7.ai API:

1. **Create an Account**: Sign up for free at [Dr7.ai](https://dr7.ai/auth/signin). No credit card is required for the free tier.
2. **Choose a Plan**: 
   - **Free ($0/mo)**: Ideal for testing and development.
   - **Pro ($49.99/mo)**: Designed for developers building applications, includes all MedGemma models and $25 in API credits.
   - **Clinical+ ($199.99/mo)**: For healthcare teams, includes all models (plus MedSigLIP) and $100 in API credits.
3. **Get API Key**: Generate your unique API key instantly from the developer dashboard.

## 2. Authentication

All requests to the Dr7.ai API require authentication via a Bearer token. 

Include your API key in the `Authorization` header of your HTTP requests:
```http
Authorization: Bearer sk-dr7-your-api-key
```
> **Security Warning**: Keep your API key secure. Never expose it in client-side code (e.g., raw React components). Always securely inject it via environment variables or a backend proxy.

## 3. Core Endpoint: Medical Chat Completions

The primary endpoint used by AuraHealth to interact with models like MedGemma is the Chat Completions API.

**Endpoint**: `POST https://api.dr7.ai/v1/medical/chat/completions` (or standard `v1/chat/completions`)

### 3.1 Example Request (cURL)

```bash
curl -X POST https://api.dr7.ai/v1/medical/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "medgemma-27b-it",
    "messages": [
      {
        "role": "user",
        "content": "Patient reports headache for 3 days with fever of 38.5°C"
      }
    ],
    "max_tokens": 1000,
    "temperature": 0.2
  }'
```

### 3.2 Example Response

```json
{
  "id": "med-1234567890",
  "object": "medical.chat.completion",
  "created": 1677652288,
  "model": "medgemma-4b-it",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Based on the symptoms you described, the patient presents with headache accompanied by fever. The following diagnoses should be considered..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 150,
    "total_tokens": 175
  }
}
```

## 4. Available Medical Models & Pricing

Dr7.ai uses a token-based pay-as-you-go pricing model. Key models for the AuraHealth architecture include:

| Model ID | Specialization | Input Cost (/1K tokens) | Output Cost (/1K tokens) |
| :--- | :--- | :--- | :--- |
| `medgemma-4b-it` | Lightweight clinical reasoning, general consultations | $0.001 | $0.002 |
| `medgemma-27b-it` | Advanced medical AI with enhanced reasoning | $0.003 | $0.006 |
| `chexagent` | Specialized X-Ray analysis and interpretation | $0.002 | $0.004 |
| `medsiglip-v1` | Medical image-text zero-shot classification | $0.005 | $0.002 |
| `llava-med` | Multimodal medical image and text analysis | $0.002 | $0.004 |
| `alphagenome` | DeepMind DNA sequence analysis | $0.002 | $0.004 |

## 5. Error Handling

The API returns standard HTTP status codes along with a JSON error body:

```json
{
  "error": {
    "message": "Invalid API key provided",
    "type": "authentication_error",
    "code": "invalid_api_key"
  }
}
```

**Common Status Codes:**
- `401`: Invalid or missing API key
- `402`: Insufficient account balance
- `429`: Rate limit exceeded
- `500`: Internal server error

## 6. Regulatory & Medical Disclaimer

Dr7.ai and the hosted models (including MedGemma) are strictly for **educational and research purposes only**. They are not clinical-grade predictive devices and must not be used for actual patient care without comprehensive validation, regulatory compliance (e.g., FDA approval in the US), and direct expert medical oversight. User assumes all liability.
