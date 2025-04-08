import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
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

    // Define your system prompt for the AI
    const systemPrompt = `You are FlowCraft AI, a specialized assistant for UX designers. Your task is to analyze a project brief and generate a logical user flow with 4-6 steps.

For each step, you should:
1. Provide a clear, concise title
2. Write a brief description of what happens at this step
3. Suggest 2-3 UI components that would be appropriate for this step
4. Consider both the user perspective and technical feasibility

Output format should be valid JSON array like this:
[
  {
    "id": "step1",
    "title": "Step title",
    "description": "Step description",
    "components": ["Component 1", "Component 2"]
  },
  ...more steps
]

Important: Your response should ONLY contain the JSON array and no other text.`;

    // Use the streamText method to create a streaming response
    const { textStream } = streamText({
      model: anthropic("claude-3-haiku-20240307"),
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Generate a user flow based on this brief: ${brief}`,
        },
      ],
    });

    // Return the text stream as the response
    return new Response(textStream);
  } catch (error) {
    console.error("Error generating flow:", error);
    return new Response(JSON.stringify({ error: "Failed to generate flow" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
