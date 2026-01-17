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
print(data)