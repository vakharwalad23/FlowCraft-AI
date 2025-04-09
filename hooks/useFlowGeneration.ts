"use client";

import { useState } from "react";

export type FlowStep = {
  id: string;
  title: string;
  description: string;
  components: string[];
};

export type FlowGenerationState = {
  isGenerating: boolean;
  error: string | null;
  steps: FlowStep[] | null;
};

export function useFlowGeneration() {
  const [state, setState] = useState<FlowGenerationState>({
    isGenerating: false,
    error: null,
    steps: null,
  });

  const generateFlow = async (brief: string) => {
    try {
      setState({
        isGenerating: true,
        error: null,
        steps: null,
      });

      const response = await fetch("/api/generate-flow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ brief }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const rawText = await response.text();

      // Try to parse the JSON response
      let parsedData;
      try {
        // Extract JSON array from the response if needed
        const jsonMatch = rawText.match(/\[[\s\S]*\]/);
        parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(rawText);
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError, rawText);
        throw new Error("Failed to parse the AI response. Please try again.");
      }

      // Validate the data format (simplified check)
      if (!Array.isArray(parsedData)) {
        throw new Error("Invalid response format: expected an array of steps");
      }

      // Ensure each step has the required properties
      const validatedSteps = parsedData.map((step, index) => ({
        id: step.id || `step${index + 1}`,
        title: step.title || `Step ${index + 1}`,
        description: step.description || "No description provided",
        components: Array.isArray(step.components) ? step.components : [],
      }));

      setState({
        isGenerating: false,
        error: null,
        steps: validatedSteps,
      });

      return validatedSteps;
    } catch (error) {
      console.error("Error generating flow:", error);
      setState({
        isGenerating: false,
        error: error instanceof Error ? error.message : "Unknown error",
        steps: null,
      });
      throw error;
    }
  };

  return {
    generateFlow,
    ...state,
  };
}
