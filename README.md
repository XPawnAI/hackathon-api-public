# Hackathon Gemini API Proxy

A proxy service for the Google Gemini API with user management and quota control. Use your provided API key to access Gemini models.

## API Endpoint

**Generate Content** - `POST /api/generate`

Headers:

```
X-API-Key: <your-api-key>
Content-Type: application/json
```

Request Body:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `contents` | string | Yes | Your prompt |
| `model` | string | No | Model to use (default: `gemini-3-flash-preview`) |
| `response_schema` | object | No | JSON schema for structured output |

Response:

```json
{
  "text": "Generated response...",
  "requests_remaining": 99
}
```

## Examples

### 1. Basic Request (Default Model)

**curl:**

```bash
curl -X POST https://hackathon-api-39535212257.northamerica-northeast2.run.app/api/generate \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"contents": "What is the capital of France?"}'
```

**Python:**

```python
import requests

response = requests.post(
    "https://hackathon-api-39535212257.northamerica-northeast2.run.app/api/generate",
    headers={"X-API-Key": "your-api-key"},
    json={"contents": "What is the capital of France?"}
)
print(response.json())
```

**TypeScript:**

```typescript
const response = await fetch(
  "https://hackathon-api-39535212257.northamerica-northeast2.run.app/api/generate",
  {
    method: "POST",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ contents: "What is the capital of France?" }),
  }
);
const data = await response.json();
console.log(data);
```

### 2. Using a Different Model

Available models: `gemini-3-flash-preview` (default), `gemini-3-pro-preview`, `gemini-2.5-flash`, `gemini-2.5-pro`

**curl:**

```bash
curl -X POST https://hackathon-api-39535212257.northamerica-northeast2.run.app/api/generate \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"contents": "Explain quantum computing", "model": "gemini-2.5-flash"}'
```

**Python:**

```python
import requests

response = requests.post(
    "https://hackathon-api-39535212257.northamerica-northeast2.run.app/api/generate",
    headers={"X-API-Key": "your-api-key"},
    json={
        "contents": "Explain quantum computing",
        "model": "gemini-2.5-flash"
    }
)
print(response.json())
```

**TypeScript:**

```typescript
const response = await fetch(
  "https://hackathon-api-39535212257.northamerica-northeast2.run.app/api/generate",
  {
    method: "POST",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: "Explain quantum computing",
      model: "gemini-2.5-flash",
    }),
  }
);
const data = await response.json();
console.log(data);
```

### 3. Structured Output (JSON Schema)

Get responses in a specific JSON format by providing a `response_schema`.

**curl:**

```bash
curl -X POST https://hackathon-api-39535212257.northamerica-northeast2.run.app/api/generate \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": "What is the capital of Japan?",
    "response_schema": {
      "type": "object",
      "properties": {
        "capital": {"type": "string"},
        "country": {"type": "string"},
        "population": {"type": "string"}
      },
      "required": ["capital", "country"]
    }
  }'
```

**Python:**

```python
import requests
from pydantic import BaseModel

class CapitalInfo(BaseModel):
    capital: str
    country: str
    population: str | None = None

response = requests.post(
    "https://hackathon-api-39535212257.northamerica-northeast2.run.app/api/generate",
    headers={"X-API-Key": "your-api-key"},
    json={
        "contents": "What is the capital of Japan?",
        "response_schema": CapitalInfo.model_json_schema()
    }
)
data = response.json()
print(data["text"])  # Returns JSON string matching your schema
```

**TypeScript:**

```typescript
const schema = {
  type: "object",
  properties: {
    capital: { type: "string" },
    country: { type: "string" },
    population: { type: "string" },
  },
  required: ["capital", "country"],
};

const response = await fetch(
  "https://hackathon-api-39535212257.northamerica-northeast2.run.app/api/generate",
  {
    method: "POST",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: "What is the capital of Japan?",
      response_schema: schema,
    }),
  }
);
const data = await response.json();
const parsed = JSON.parse(data.text); // { capital: "Tokyo", country: "Japan", ... }
```

## Error Responses

| Status | Description                |
| ------ | -------------------------- |
| 401    | Missing or invalid API key |
| 403    | Account is deactivated     |
| 429    | Quota exceeded             |
| 500    | Gemini API error           |
