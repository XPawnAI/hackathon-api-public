import requests
import json
from typing import Optional
from pydantic import BaseModel, Field


# Configuration
BASE_URL = "https://hackathon-api-39535212257.northamerica-northeast2.run.app"
API_KEY = "your-api-key"  # Replace with your actual API key
HEADERS = {
    "X-API-Key": API_KEY,
    "Content-Type": "application/json"
}


def make_request(payload: dict) -> dict | None:
    """Make a request to the generate endpoint."""
    url = f"{BASE_URL}/api/generate"
    try:
        response = requests.post(url, headers=HEADERS, json=payload)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.status_code} - {response.text}")
            return None
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the server.")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None


# =============================================================================
# TEST: Unstructured output with default model
# =============================================================================

def test_unstructured_default_model():
    """Test unstructured output with default model (gemini-3-flash-preview)."""
    print("\n" + "=" * 60)
    print("TEST: Unstructured output with default model")
    print("=" * 60)
    
    payload = {
        "contents": "What is the capital of France? Answer in one sentence."
    }
    
    result = make_request(payload)
    if result:
        print("SUCCESS!")
        print(f"Model: default (gemini-3-flash-preview)")
        print(f"Response: {result['text'][:200]}...")
        print(f"Requests Remaining: {result['requests_remaining']}")


# =============================================================================
# TEST: Unstructured output with gemini-3-pro-preview
# =============================================================================

def test_unstructured_gemini3_pro():
    """Test unstructured output with gemini-3-pro-preview."""
    print("\n" + "=" * 60)
    print("TEST: Unstructured output with gemini-3-pro-preview")
    print("=" * 60)
    
    payload = {
        "contents": "What is the capital of Germany? Answer in one sentence.",
        "model": "gemini-3-pro-preview"
    }
    
    result = make_request(payload)
    if result:
        print("SUCCESS!")
        print(f"Model: gemini-3-pro-preview")
        print(f"Response: {result['text'][:200]}...")
        print(f"Requests Remaining: {result['requests_remaining']}")


# =============================================================================
# TEST: Unstructured output with gemini-2.0-flash
# =============================================================================

def test_unstructured_gemini2_flash():
    """Test unstructured output with gemini-2.0-flash."""
    print("\n" + "=" * 60)
    print("TEST: Unstructured output with gemini-2.0-flash")
    print("=" * 60)
    
    payload = {
        "contents": "What is the capital of Italy? Answer in one sentence.",
        "model": "gemini-2.0-flash"
    }
    
    result = make_request(payload)
    if result:
        print("SUCCESS!")
        print(f"Model: gemini-2.0-flash")
        print(f"Response: {result['text'][:200]}...")
        print(f"Requests Remaining: {result['requests_remaining']}")


# =============================================================================
# TEST: Unstructured output with gemini-2.0-pro-exp-02-05
# =============================================================================

def test_unstructured_gemini2_pro():
    """Test unstructured output with gemini-2.0-pro-exp-02-05."""
    print("\n" + "=" * 60)
    print("TEST: Unstructured output with gemini-2.0-pro-exp-02-05")
    print("=" * 60)
    
    payload = {
        "contents": "What is the capital of Spain? Answer in one sentence.",
        "model": "gemini-2.0-pro-exp-02-05"
    }
    
    result = make_request(payload)
    if result:
        print("SUCCESS!")
        print(f"Model: gemini-2.0-pro-exp-02-05")
        print(f"Response: {result['text'][:200]}...")
        print(f"Requests Remaining: {result['requests_remaining']}")


# =============================================================================
# TEST: Structured output with simple schema (CapitalInfo)
# =============================================================================

class CapitalInfo(BaseModel):
    """Schema for capital city information."""
    capital: str = Field(description="The capital city")
    country: str = Field(description="The country name")
    population: Optional[str] = Field(default=None, description="Approximate population of the capital")


def test_structured_output_simple():
    """Test structured output with a simple JSON schema."""
    print("\n" + "=" * 60)
    print("TEST: Structured output with simple schema")
    print("=" * 60)
    
    payload = {
        "contents": "What is the capital of Japan? Provide the capital, country name, and approximate population.",
        "model": "gemini-3-flash-preview",
        "response_schema": CapitalInfo.model_json_schema()
    }
    
    result = make_request(payload)
    print(result)
    if result:
        print("SUCCESS!")
        print(f"Model: gemini-3-flash-preview")
        print(f"Raw Response: {result['text']}")
        try:
            parsed = json.loads(result['text'])
            print(f"Parsed JSON: {json.dumps(parsed, indent=2)}")
        except json.JSONDecodeError:
            print("Warning: Response was not valid JSON")
        print(f"Requests Remaining: {result['requests_remaining']}")


# =============================================================================
# TEST: Structured output with recipe schema
# =============================================================================

class Ingredient(BaseModel):
    """Schema for a recipe ingredient."""
    name: str = Field(description="Name of the ingredient")
    quantity: str = Field(description="Quantity with units")


class Recipe(BaseModel):
    """Schema for a recipe."""
    recipe_name: str = Field(description="The name of the recipe")
    prep_time_minutes: Optional[int] = Field(default=None, description="Time in minutes to prepare")
    ingredients: list[Ingredient] = Field(description="List of ingredients")
    instructions: list[str] = Field(description="Step-by-step instructions")


def test_structured_output_recipe():
    """Test structured output with a recipe schema (from docs example)."""
    print("\n" + "=" * 60)
    print("TEST: Structured output with recipe schema")
    print("=" * 60)
    
    payload = {
        "contents": """Extract the recipe from this text:
        To make a simple pasta with garlic and olive oil (Aglio e Olio), you'll need:
        400g spaghetti, 6 cloves of garlic (thinly sliced), 1/2 cup extra virgin olive oil,
        1/4 teaspoon red pepper flakes, salt to taste, and fresh parsley for garnish.
        
        Cook pasta according to package directions. While pasta cooks, heat olive oil in a large pan
        over medium heat. Add garlic and cook until golden (about 2 minutes). Add red pepper flakes.
        Drain pasta, reserving 1/2 cup pasta water. Toss pasta with garlic oil, adding pasta water
        as needed. Season with salt and garnish with parsley. Serves 4.""",
        "model": "gemini-3-flash-preview",
        "response_schema": Recipe.model_json_schema()
    }
    
    result = make_request(payload)
    if result:
        print("SUCCESS!")
        print(f"Model: gemini-3-flash-preview")
        try:
            parsed = json.loads(result['text'])
            print(f"Recipe Name: {parsed.get('recipe_name')}")
            print(f"Prep Time: {parsed.get('prep_time_minutes')} minutes")
            print(f"Number of Ingredients: {len(parsed.get('ingredients', []))}")
            print(f"Number of Instructions: {len(parsed.get('instructions', []))}")
            print(f"\nFull JSON:\n{json.dumps(parsed, indent=2)}")
        except json.JSONDecodeError:
            print(f"Raw Response: {result['text']}")
            print("Warning: Response was not valid JSON")
        print(f"Requests Remaining: {result['requests_remaining']}")


# =============================================================================
# TEST: Structured output with gemini-2.0-flash (ElementInfo)
# =============================================================================

class ElementInfo(BaseModel):
    """Schema for chemical element information."""
    name: str
    symbol: str
    atomic_number: int
    category: Optional[str] = None


def test_structured_output_with_gemini2():
    """Test structured output with gemini-2.0-flash."""
    print("\n" + "=" * 60)
    print("TEST: Structured output with gemini-2.0-flash")
    print("=" * 60)
    
    payload = {
        "contents": "Give me information about the element Gold.",
        "model": "gemini-2.0-flash",
        "response_schema": ElementInfo.model_json_schema()
    }
    
    result = make_request(payload)
    if result:
        print("SUCCESS!")
        print(f"Model: gemini-2.0-flash")
        try:
            parsed = json.loads(result['text'])
            print(f"Parsed JSON: {json.dumps(parsed, indent=2)}")
        except json.JSONDecodeError:
            print(f"Raw Response: {result['text']}")
            print("Warning: Response was not valid JSON")
        print(f"Requests Remaining: {result['requests_remaining']}")


# =============================================================================
# Main
# =============================================================================

def main():
    test_unstructured_default_model()
    # test_unstructured_gemini3_pro()
    # test_unstructured_gemini2_flash()
    # test_unstructured_gemini2_pro()
    # test_structured_output_simple()
    # test_structured_output_recipe()
    # test_structured_output_with_gemini2()


if __name__ == "__main__":
    main()
