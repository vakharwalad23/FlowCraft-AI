import { Anthropic } from "@anthropic-ai/sdk";
import { z } from "zod";

// Validate request body schema
const requestSchema = z.object({
  brief: z.string().min(1).max(2000),
});

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();

    // Validate request
    const { brief } = requestSchema.parse(body);

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Define your system prompt for the AI
    const systemPrompt = `You are FlowCraft AI, a specialized assistant for UX designers. Your task is to analyze a project brief and generate a logical user flow.

For each step, you must:
1. Generate a unique ID (e.g., "step1", "step2", etc.)
2. Provide a clear, concise title that describes the step
3. Write a brief description explaining what happens at this step
4. Suggest 2-3 modern UI components that would be appropriate for this step (e.g., "Search Input", "Action Button", "Card Grid", etc.)

The output MUST be a valid JSON array with this exact structure:
[
  {
    "id": "step1",
    "title": "Step Title",
    "description": "A clear description of what happens in this step",
    "components": ["Component 1", "Component 2"]
  }
]

Important guidelines:
- Each step should logically flow into the next
- Use modern, user friendly language and components
- Focus on creating an intuitive and engaging user experience
- Keep descriptions concise but informative
- Suggest trendy, modern UI components
- ONLY output the JSON array, no other text
- Ensure the JSON is valid and properly formatted`;

    // Create the message
    const response = await anthropic.messages.create({
      messages: [
        {
          role: "user",
          content: `Generate a modern user flow based on this brief: ${brief}`,
        },
      ],
      model: "claude-3-haiku-20240307",
      temperature: 0.7,
      system: systemPrompt,
      max_tokens: 2048,
    });

    // Extract and validate JSON from the response
    const content =
      response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No valid JSON array found in response");
    }

    const flowSteps = JSON.parse(jsonMatch[0]);

    // Return the parsed JSON response
    return new Response(JSON.stringify(flowSteps), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating flow:", error);
    return new Response(JSON.stringify({ error: "Failed to generate flow" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
