// Web Speech API utility for speech recognition
// This file handles browser compatibility, initialization, and core functionality

// Type definition for browser support detection result
export type SpeechRecognitionSupport = {
  isSupported: boolean;
  engine: string | null;
};

// Type for recognition state
export type SpeechRecognitionState = {
  isListening: boolean;
  transcript: string;
  error: string | null;
};

// Interface for SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionInterface extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

// Type for the SpeechRecognition constructor
type SpeechRecognitionConstructor = new () => SpeechRecognitionInterface;

// Check if the browser supports the Web Speech API
export const checkSpeechRecognitionSupport = (): SpeechRecognitionSupport => {
  if (typeof window === "undefined") {
    return { isSupported: false, engine: null };
  }

  // Check for the various implementations of SpeechRecognition
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition;

  if (SpeechRecognition) {
    // Determine which engine is being used
    if (window.SpeechRecognition)
      return { isSupported: true, engine: "standard" };
    if (window.webkitSpeechRecognition)
      return { isSupported: true, engine: "webkit" };
    if (window.mozSpeechRecognition)
      return { isSupported: true, engine: "mozilla" };
    if (window.msSpeechRecognition)
      return { isSupported: true, engine: "microsoft" };
  }

  return { isSupported: false, engine: null };
};

// Initialize and manage a speech recognition instance
export const initSpeechRecognition = (
  onTranscriptChange: (transcript: string) => void,
  onStateChange: (state: SpeechRecognitionState) => void,
  options: {
    continuous?: boolean;
    interimResults?: boolean;
    language?: string;
  } = {}
) => {
  if (typeof window === "undefined") {
    return {
      start: () => {},
      stop: () => {},
      isSupported: false,
    };
  }

  const support = checkSpeechRecognitionSupport();

  if (!support.isSupported) {
    onStateChange({
      isListening: false,
      transcript: "",
      error: "Speech recognition is not supported in this browser",
    });

    return {
      start: () => {},
      stop: () => {},
      isSupported: false,
    };
  }

  // Get the appropriate constructor
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition;

  // Create a new instance
  const recognition =
    new (SpeechRecognition as unknown as SpeechRecognitionConstructor)();

  // Configure options
  recognition.continuous = options.continuous ?? true;
  recognition.interimResults = options.interimResults ?? true;
  recognition.lang = options.language ?? "en-US";

  // Track state
  let state: SpeechRecognitionState = {
    isListening: false,
    transcript: "",
    error: null,
  };
  let finalTranscript = ""; // Keep track of the finalized transcript

  // Handle results
  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interimTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcriptPart = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcriptPart + " "; // Add space after final parts
      } else {
        interimTranscript += transcriptPart;
      }
    }

    const currentTranscript = finalTranscript + interimTranscript;
    state = {
      ...state,
      transcript: currentTranscript.trim(), // Update state with combined transcript
    };

    onTranscriptChange(state.transcript);
    onStateChange(state);
  };

  // Handle errors
  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    state = {
      ...state,
      error: event.error,
    };
    onStateChange(state);
  };

  // Handle ending
  recognition.onend = () => {
    // Reset final transcript when recognition ends, unless stopped manually
    // We might need a flag here if manual stop shouldn't clear it
    // finalTranscript = ""; // Decide if reset is needed
    state = {
      ...state,
      isListening: false,
    };
    onStateChange(state);
  };

  return {
    start: () => {
      try {
        finalTranscript = ""; // Reset transcript on new start
        recognition.start();
        state = {
          ...state,
          isListening: true,
          error: null,
        };
        onStateChange(state);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        state = {
          ...state,
          error: "Failed to start speech recognition",
        };
        onStateChange(state);
      }
    },
    stop: () => {
      try {
        recognition.stop();
        // Update state immediately, onend will confirm
        state = {
          ...state,
          isListening: false,
        };
        onStateChange(state);
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
        // Handle potential errors during stop
      }
    },
    isSupported: true,
  };
};

// Browser compatibility information for Web Speech API
export const speechRecognitionCompatibility = {
  chrome: "Full support (desktop & mobile)",
  edge: "Full support",
  safari: "Partial support (iOS 13+, macOS 14.1+)",
  firefox: "No support (as of 2023)",
  opera: "Full support",
  samsung: "Full support",
  ie: "No support",
};
// Add type declarations for browser Speech Recognition APIs
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    mozSpeechRecognition?: SpeechRecognitionConstructor;
    msSpeechRecognition?: SpeechRecognitionConstructor;
  }
}
