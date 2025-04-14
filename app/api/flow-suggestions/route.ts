import { NextResponse } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

// Validation schema for the request
const requestSchema = z.object({
  steps: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      components: z.array(z.string()),
    })
  ),
  connections: z.array(
    z.object({
      source: z.string(),
      target: z.string(),
    })
  ),
});

// Add this interface at the top of your file, below the imports and validation schema
interface SuggestionResponse {
  id?: string;
  title?: string;
  description?: string;
  type?: string;
  actionable?: boolean;
  preview?: string;
  impact?: string;
  details?: string;
  before?: string;
  after?: string;
  components?: string[];
}

export async function POST(req: Request) {
  try {
    // Authenticate the user
    const currentUser = await auth.api.getSession({
      headers: await headers(),
    });

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await req.json();
    const { steps, connections } = requestSchema.parse(body);

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Create a detailed description of the flow for the AI
    const flowDescription = steps
      .map(
        (step, index) =>
          `Step ${index + 1}: "${step.title}" - ${
            step.description
          }\nUI Components: ${step.components.join(", ")}\n`
      )
      .join("\n");

    const connectionsDescription = connections
      .map((conn) => {
        const sourceStep = steps.find((s) => s.id === conn.source);
        const targetStep = steps.find((s) => s.id === conn.target);
        return `Connection: "${sourceStep?.title}" leads to "${targetStep?.title}"`;
      })
      .join("\n");

    // Generate suggestions using Claude
    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      temperature: 0.7,
      system: `You are an expert UX design assistant specializing in user flows. Your task is to analyze a user flow and provide helpful, specific suggestions for improvements.

      IMPORTANT: You MUST respond with ONLY a valid JSON object in the following format with no other text or explanation:
      {
        "suggestions": [
          {
            "id": string,
            "title": string,
            "description": string,
            "type": "improvement"|"addition"|"flow"|"warning",
            "actionable": boolean,
            "preview": string (optional)
          }
        ]
      }
      
      Your entire response must be a valid, parseable JSON object. Do not include any markdown, explanation text, or formatting outside of the JSON. Do not explain the JSON structure.
      
      For addition suggestions, please follow these guidelines:
      1. Use format "add-after-[position]" or "add-before-[position]" for the id field
      2. In the description, clearly indicate where the new step should be placed, e.g., "Add this step after 'Payment Information'" or "Insert before the 'Checkout' step"
      3. Make sure the new step logically fits in the indicated position

      Be specific about placement in your suggestions to ensure new steps are inserted in the most appropriate position within the user flow.`,
      messages: [
        {
          role: "user",
          content: `Here is my current user flow:\n\n${flowDescription}\n\nConnections between steps:\n${connectionsDescription}\n\nPlease analyze this flow and provide suggestions for improvements, missing steps, or potential UX issues.`,
        },
      ],
    });

    // Parse and return the response
    const contentBlock = message.content[0];
    const content = "text" in contentBlock ? contentBlock.text : "";

    // Extract and validate JSON from the response
    try {
      console.log("Claude response content:", content);

      // More sophisticated JSON extraction approach
      let jsonContent = "";
      let openBraces = 0;
      const startIndex = content.indexOf("{");

      if (startIndex !== -1) {
        // Process character by character to find properly nested JSON
        for (let i = startIndex; i < content.length; i++) {
          const char = content[i];
          jsonContent += char;

          if (char === "{") {
            openBraces++;
          } else if (char === "}") {
            openBraces--;

            // If we've found a complete JSON object, break
            if (openBraces === 0) {
              break;
            }
          }
        }
      }

      // If we didn't get a complete JSON object, try regex as fallback
      if (!jsonContent || openBraces !== 0) {
        const jsonMatch = content.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
          jsonContent = jsonMatch[0].trim();
        }
      }

      // If we still don't have valid JSON, return error
      if (!jsonContent) {
        console.log("No valid JSON found in Claude response");
        return NextResponse.json({
          suggestions: [
            {
              id: "error-format",
              title: "Suggestion format issue",
              description:
                "The AI couldn't generate properly formatted suggestions. Please try again.",
              type: "warning",
              actionable: false,
            },
          ],
        });
      }

      // Try to parse the JSON with better error handling
      let parsedData;
      try {
        console.log("Attempting to parse JSON:", jsonContent);
        parsedData = JSON.parse(jsonContent);
      } catch (jsonError) {
        console.error("JSON parse error:", jsonError);

        // Try to fix common JSON formatting issues and try again
        try {
          // Use a more robust approach to fix invalid JSON
          // This handles nested quotes inside JSON string values
          const fixedContent = jsonContent
            .replace(/'/g, '"') // Replace single quotes with double quotes
            .replace(/\n/g, " ") // Replace newlines with spaces
            .replace(/,\s*}/g, "}") // Fix trailing commas in objects
            .replace(/,\s*]/g, "]") // Fix trailing commas in arrays
            .replace(/([,{[]\s*)"(.*?)"\s*:/g, '$1"$2":') // Fix property names
            .replace(/"([^"]*?)(?<!\\)"(?!\s*[,}\]:])(?!\s*")/g, '"$1\\"') // Escape unescaped quotes in values
            .replace(/""([^"]*)"/g, '"$1"'); // Fix double quotes that got doubled

          console.log("Attempting to parse fixed robust JSON:", fixedContent);

          try {
            parsedData = JSON.parse(fixedContent);
          } catch {
            // If that still fails, try a more aggressive approach with a JSON5 parser-like handling
            // Replace all problematic quotes in string values with encoded versions
            const sanitizedJson = jsonContent.replace(
              /:\s*"([^"]*?)"/g,
              (match, p1) => {
                // Replace any quotes in the string value with encoded quotes
                const sanitized = p1.replace(/"/g, '\\"');
                return ': "' + sanitized + '"';
              }
            );

            console.log("Last attempt parsing sanitized JSON:", sanitizedJson);
            parsedData = JSON.parse(sanitizedJson);
          }
        } catch (fixError) {
          console.error("Failed to fix and parse JSON:", fixError);

          // Create a fallback response with dummy suggestions when all else fails
          return NextResponse.json({
            suggestions: [
              {
                id: "json-parse-error",
                title: "Invalid JSON format",
                description:
                  "The AI response contained invalid JSON. Please try again.",
                type: "warning",
                actionable: false,
              },
            ],
          });
        }
      }

      // Continue with validation and processing...
      if (!parsedData.suggestions || !Array.isArray(parsedData.suggestions)) {
        console.log("Invalid response structure:", parsedData);

        // If the structure is wrong but we have a valid JSON, try to fix it
        if (typeof parsedData === "object") {
          // Maybe the suggestions array is under a different key or at the root level
          const possibleSuggestions = Array.isArray(parsedData)
            ? parsedData
            : Object.values(parsedData).find((val) => Array.isArray(val));

          if (possibleSuggestions && possibleSuggestions.length > 0) {
            parsedData = { suggestions: possibleSuggestions };
          } else {
            throw new Error(
              "Invalid response format: missing suggestions array"
            );
          }
        } else {
          throw new Error("Invalid response format: missing suggestions array");
        }
      }

      // Ensure each suggestion has required fields
      const validatedSuggestions = parsedData.suggestions.map(
        (suggestion: SuggestionResponse) => ({
          id:
            suggestion.id ||
            `suggestion-${Math.random().toString(36).substring(2, 11)}`,
          title: suggestion.title || "Untitled Suggestion",
          description: suggestion.description || "",
          type: ["improvement", "addition", "flow", "warning"].includes(
            suggestion.type || ""
          )
            ? suggestion.type
            : "improvement",
          actionable:
            typeof suggestion.actionable === "boolean"
              ? suggestion.actionable
              : true,
          preview: suggestion.preview || undefined,
          impact: suggestion.impact || undefined,
          details: suggestion.details || undefined,
          before: suggestion.before || undefined,
          after: suggestion.after || undefined,
          components: Array.isArray(suggestion.components)
            ? suggestion.components
            : undefined,
        })
      );

      return NextResponse.json({ suggestions: validatedSuggestions });
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      return NextResponse.json({
        suggestions: [
          {
            id: "parse-error",
            title: "Error processing suggestions",
            description:
              "There was an error processing the AI suggestions. Please try again.",
            type: "warning",
            actionable: false,
          },
        ],
      });
    }
  } catch (error) {
    console.error("Error generating flow suggestions:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
