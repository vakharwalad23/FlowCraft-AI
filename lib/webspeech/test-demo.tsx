"use client";

import { useState, useEffect, useRef } from "react";
import {
  checkSpeechRecognitionSupport,
  initSpeechRecognition,
  speechRecognitionCompatibility,
  type SpeechRecognitionState,
  type SpeechRecognitionSupport,
} from "./speechRecognition";

// Define the type for the recognition controller returned by initSpeechRecognition
type RecognitionController = ReturnType<typeof initSpeechRecognition>;

/**
 * Demo component for Web Speech API speech recognition
 *
 * This component demonstrates how to use the Web Speech API wrapper
 * and can be used as a reference for implementing speech recognition
 * in the BriefInput component.
 */
export default function WebSpeechDemo() {
  const [transcript, setTranscript] = useState("");
  const [recognitionState, setRecognitionState] =
    useState<SpeechRecognitionState>({
      isListening: false,
      transcript: "",
      error: null,
    });
  const [support, setSupport] = useState<SpeechRecognitionSupport>({
    isSupported: false,
    engine: null,
  });

  // Use useRef to store the recognition controller instance
  const recognitionRef = useRef<RecognitionController | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const supportCheck = checkSpeechRecognitionSupport();
    setSupport(supportCheck);

    // Cleanup function to stop recognition if component unmounts while listening
    return () => {
      if (recognitionRef.current && recognitionState.isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [recognitionState.isListening]); // Add dependency to re-run cleanup if listening state changes

  const handleStartListening = () => {
    if (!support.isSupported) return;

    // Clear any previous errors and transcript
    setTranscript(""); // Reset transcript display
    setRecognitionState((prev) => ({
      ...prev,
      transcript: "", // Reset internal transcript state
      error: null,
    }));

    // Initialize and store the recognition controller in the ref
    recognitionRef.current = initSpeechRecognition(
      (newTranscript) => {
        setTranscript(newTranscript);
      },
      (newState) => {
        setRecognitionState(newState);
        if (newState.error === "network") {
          console.log(
            "Network error detected. Speech recognition requires internet connection."
          );
        }
      },
      {
        continuous: true,
        interimResults: true,
        language: "en-US",
      }
    );

    // Start listening using the controller from the ref
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const handleStopListening = () => {
    // Call stop() on the controller stored in the ref
    if (recognitionRef.current && recognitionState.isListening) {
      recognitionRef.current.stop();
    }
  };

  // Helper function to render error messages more helpfully
  const getErrorMessage = (errorCode: string | null) => {
    if (!errorCode) return null;

    const errorMessages: Record<string, string> = {
      network:
        "Network error. Please check your internet connection and try again.",
      "not-allowed":
        "Microphone access denied. Please allow microphone access and try again.",
      "no-speech":
        "No speech detected. Please speak more clearly or adjust your microphone.",
      aborted: "Speech recognition was aborted.",
      "audio-capture":
        "Could not capture audio. Please check your microphone settings.",
      "service-not-allowed":
        "Speech service not allowed. This might be a browser restriction.",
    };

    return errorMessages[errorCode] || `Error: ${errorCode}`;
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Web Speech API Demo</h1>

      {/* Speech Recognition Support */}
      <div className="mb-4 p-3 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold">Support Status</h2>
        <p>
          Is Supported: <strong>{support.isSupported ? "Yes" : "No"}</strong>
        </p>
        {support.engine && (
          <p>
            Engine: <strong>{support.engine}</strong>
          </p>
        )}
      </div>

      {/* Compatibility Information */}
      <div className="mb-4 p-3 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold">Browser Compatibility</h2>
        <ul className="list-disc pl-5">
          {Object.entries(speechRecognitionCompatibility).map(
            ([browser, support]) => (
              <li key={browser}>
                <strong>{browser}</strong>: {support}
              </li>
            )
          )}
        </ul>
      </div>

      {/* Controls */}
      <div className="mb-4">
        <button
          onClick={handleStartListening}
          disabled={!support.isSupported || recognitionState.isListening}
          className={`px-4 py-2 rounded mr-2 ${
            !support.isSupported
              ? "bg-gray-300 cursor-not-allowed"
              : recognitionState.isListening
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Start Listening
        </button>
        <button
          onClick={handleStopListening}
          disabled={!support.isSupported || !recognitionState.isListening}
          className={`px-4 py-2 rounded ${
            !recognitionState.isListening
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          Stop Listening
        </button>
      </div>

      {/* Status */}
      <div className="mb-4">
        <p>
          Status:{" "}
          <strong>
            {recognitionState.isListening ? "Listening..." : "Not listening"}
          </strong>
        </p>
        {recognitionState.error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700">
            {getErrorMessage(recognitionState.error)}
            {recognitionState.error === "network" && (
              <div className="mt-1">
                <button
                  onClick={handleStartListening}
                  className="mt-1 text-sm bg-red-100 hover:bg-red-200 px-2 py-1 rounded"
                >
                  Retry Connection
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Transcript Display */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Transcript</h2>
        <div className="border rounded p-3 min-h-[100px] bg-white">
          {transcript || (
            <span className="text-gray-400">
              Start speaking after clicking &quot;Start Listening&quot;...
            </span>
          )}
        </div>
      </div>

      {/* Implementation Notes */}
      <div className="mt-8 p-3 bg-yellow-50 rounded border border-yellow-200">
        <h2 className="text-lg font-semibold">Implementation Notes for FE1</h2>
        <ul className="list-disc pl-5">
          <li>
            Use the <code>checkSpeechRecognitionSupport()</code> function to
            determine if the browser supports speech recognition
          </li>
          <li>
            Initialize recognition with <code>initSpeechRecognition()</code>,
            storing the returned controller in a ref
          </li>
          <li>
            Call <code>controller.start()</code> when the microphone button is
            clicked
          </li>
          <li>
            Call <code>controller.stop()</code> when recording should end
          </li>
          <li>Use the transcript callback to update your text input value</li>
          <li>
            Provide visual feedback based on the recognitionState (listening,
            errors)
          </li>
          <li>
            Consider adding a timeout for auto-stopping after periods of silence
          </li>
        </ul>
      </div>
    </div>
  );
}
