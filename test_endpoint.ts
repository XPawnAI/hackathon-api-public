// test_endpoint.ts
// Run with: npx ts-node test_endpoint.ts (or compile and run with node)

// Configuration
const BASE_URL =
  "https://hackathon-api-39535212257.northamerica-northeast2.run.app";
const API_KEY = "your-api-key"; // Replace with your actual API key
const HEADERS = {
  "X-API-Key": API_KEY,
  "Content-Type": "application/json",
};

// API Response type
interface ApiResponse {
  text: string;
  requests_remaining: number;
}

interface RequestPayload {
  contents: string;
  model?: string;
  response_schema?: object;
}

async function makeRequest(
  payload: RequestPayload
): Promise<ApiResponse | null> {
  const url = `${BASE_URL}/api/generate`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return (await response.json()) as ApiResponse;
    } else {
      const text = await response.text();
      console.log(`Error: ${response.status} - ${text}`);
      return null;
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.log("Error: Could not connect to the server.");
    } else {
      console.log(`Error: ${error}`);
    }
    return null;
  }
}

// =============================================================================
// TEST: Unstructured output with default model
// =============================================================================

async function testUnstructuredDefaultModel(): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("TEST: Unstructured output with default model");
  console.log("=".repeat(60));

  const payload: RequestPayload = {
    contents: "What is the capital of France? Answer in one sentence.",
  };

  const result = await makeRequest(payload);
  if (result) {
    console.log("SUCCESS!");
    console.log("Model: default (gemini-3-flash-preview)");
    console.log(`Response: ${result.text.slice(0, 200)}...`);
    console.log(`Requests Remaining: ${result.requests_remaining}`);
  }
}

// =============================================================================
// TEST: Unstructured output with gemini-3-pro-preview
// =============================================================================

async function testUnstructuredGemini3Pro(): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("TEST: Unstructured output with gemini-3-pro-preview");
  console.log("=".repeat(60));

  const payload: RequestPayload = {
    contents: "What is the capital of Germany? Answer in one sentence.",
    model: "gemini-3-pro-preview",
  };

  const result = await makeRequest(payload);
  if (result) {
    console.log("SUCCESS!");
    console.log("Model: gemini-3-pro-preview");
    console.log(`Response: ${result.text.slice(0, 200)}...`);
    console.log(`Requests Remaining: ${result.requests_remaining}`);
  }
}

// =============================================================================
// TEST: Unstructured output with gemini-2.0-flash
// =============================================================================

async function testUnstructuredGemini2Flash(): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("TEST: Unstructured output with gemini-2.0-flash");
  console.log("=".repeat(60));

  const payload: RequestPayload = {
    contents: "What is the capital of Italy? Answer in one sentence.",
    model: "gemini-2.0-flash",
  };

  const result = await makeRequest(payload);
  if (result) {
    console.log("SUCCESS!");
    console.log("Model: gemini-2.0-flash");
    console.log(`Response: ${result.text.slice(0, 200)}...`);
    console.log(`Requests Remaining: ${result.requests_remaining}`);
  }
}

// =============================================================================
// TEST: Unstructured output with gemini-2.0-pro-exp-02-05
// =============================================================================

async function testUnstructuredGemini2Pro(): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("TEST: Unstructured output with gemini-2.0-pro-exp-02-05");
  console.log("=".repeat(60));

  const payload: RequestPayload = {
    contents: "What is the capital of Spain? Answer in one sentence.",
    model: "gemini-2.0-pro-exp-02-05",
  };

  const result = await makeRequest(payload);
  if (result) {
    console.log("SUCCESS!");
    console.log("Model: gemini-2.0-pro-exp-02-05");
    console.log(`Response: ${result.text.slice(0, 200)}...`);
    console.log(`Requests Remaining: ${result.requests_remaining}`);
  }
}

// =============================================================================
// TEST: Structured output with simple schema (CapitalInfo)
// =============================================================================

interface CapitalInfo {
  capital: string;
  country: string;
  population?: string;
}

const CapitalInfoSchema = {
  type: "object",
  properties: {
    capital: { type: "string", description: "The capital city" },
    country: { type: "string", description: "The country name" },
    population: {
      type: "string",
      description: "Approximate population of the capital",
    },
  },
  required: ["capital", "country"],
};

async function testStructuredOutputSimple(): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("TEST: Structured output with simple schema");
  console.log("=".repeat(60));

  const payload: RequestPayload = {
    contents:
      "What is the capital of Japan? Provide the capital, country name, and approximate population.",
    model: "gemini-3-flash-preview",
    response_schema: CapitalInfoSchema,
  };

  const result = await makeRequest(payload);
  console.log(result);
  if (result) {
    console.log("SUCCESS!");
    console.log("Model: gemini-3-flash-preview");
    console.log(`Raw Response: ${result.text}`);
    try {
      const parsed = JSON.parse(result.text) as CapitalInfo;
      console.log(`Parsed JSON: ${JSON.stringify(parsed, null, 2)}`);
    } catch {
      console.log("Warning: Response was not valid JSON");
    }
    console.log(`Requests Remaining: ${result.requests_remaining}`);
  }
}

// =============================================================================
// TEST: Structured output with recipe schema
// =============================================================================

interface Ingredient {
  name: string;
  quantity: string;
}

interface Recipe {
  recipe_name: string;
  prep_time_minutes?: number;
  ingredients: Ingredient[];
  instructions: string[];
}

const IngredientSchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Name of the ingredient" },
    quantity: { type: "string", description: "Quantity with units" },
  },
  required: ["name", "quantity"],
};

const RecipeSchema = {
  type: "object",
  properties: {
    recipe_name: { type: "string", description: "The name of the recipe" },
    prep_time_minutes: {
      type: "integer",
      description: "Time in minutes to prepare",
    },
    ingredients: {
      type: "array",
      items: IngredientSchema,
      description: "List of ingredients",
    },
    instructions: {
      type: "array",
      items: { type: "string" },
      description: "Step-by-step instructions",
    },
  },
  required: ["recipe_name", "ingredients", "instructions"],
};

async function testStructuredOutputRecipe(): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("TEST: Structured output with recipe schema");
  console.log("=".repeat(60));

  const payload: RequestPayload = {
    contents: `Extract the recipe from this text:
          To make a simple pasta with garlic and olive oil (Aglio e Olio), you'll need:
          400g spaghetti, 6 cloves of garlic (thinly sliced), 1/2 cup extra virgin olive oil,
          1/4 teaspoon red pepper flakes, salt to taste, and fresh parsley for garnish.
          
          Cook pasta according to package directions. While pasta cooks, heat olive oil in a large pan
          over medium heat. Add garlic and cook until golden (about 2 minutes). Add red pepper flakes.
          Drain pasta, reserving 1/2 cup pasta water. Toss pasta with garlic oil, adding pasta water
          as needed. Season with salt and garnish with parsley. Serves 4.`,
    model: "gemini-3-flash-preview",
    response_schema: RecipeSchema,
  };

  const result = await makeRequest(payload);
  if (result) {
    console.log("SUCCESS!");
    console.log("Model: gemini-3-flash-preview");
    try {
      const parsed = JSON.parse(result.text) as Recipe;
      console.log(`Recipe Name: ${parsed.recipe_name}`);
      console.log(`Prep Time: ${parsed.prep_time_minutes} minutes`);
      console.log(`Number of Ingredients: ${parsed.ingredients?.length ?? 0}`);
      console.log(
        `Number of Instructions: ${parsed.instructions?.length ?? 0}`
      );
      console.log(`\nFull JSON:\n${JSON.stringify(parsed, null, 2)}`);
    } catch {
      console.log(`Raw Response: ${result.text}`);
      console.log("Warning: Response was not valid JSON");
    }
    console.log(`Requests Remaining: ${result.requests_remaining}`);
  }
}

// =============================================================================
// TEST: Structured output with gemini-2.0-flash (ElementInfo)
// =============================================================================

interface ElementInfo {
  name: string;
  symbol: string;
  atomic_number: number;
  category?: string;
}

const ElementInfoSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    symbol: { type: "string" },
    atomic_number: { type: "integer" },
    category: { type: "string" },
  },
  required: ["name", "symbol", "atomic_number"],
};

async function testStructuredOutputWithGemini2(): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("TEST: Structured output with gemini-2.0-flash");
  console.log("=".repeat(60));

  const payload: RequestPayload = {
    contents: "Give me information about the element Gold.",
    model: "gemini-2.0-flash",
    response_schema: ElementInfoSchema,
  };

  const result = await makeRequest(payload);
  if (result) {
    console.log("SUCCESS!");
    console.log("Model: gemini-2.0-flash");
    try {
      const parsed = JSON.parse(result.text) as ElementInfo;
      console.log(`Parsed JSON: ${JSON.stringify(parsed, null, 2)}`);
    } catch {
      console.log(`Raw Response: ${result.text}`);
      console.log("Warning: Response was not valid JSON");
    }
    console.log(`Requests Remaining: ${result.requests_remaining}`);
  }
}

// =============================================================================
// Main
// =============================================================================

async function main(): Promise<void> {
  await testUnstructuredDefaultModel();
  await testUnstructuredGemini3Pro();
  await testUnstructuredGemini2Flash();
  await testUnstructuredGemini2Pro();
  await testStructuredOutputSimple();
  await testStructuredOutputRecipe();
  await testStructuredOutputWithGemini2();
}

main();
