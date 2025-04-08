# Web Speech API Integration Guide

This guide provides information about implementing voice input in the BriefInput component using the Web Speech API. The implementation is browser-dependent, so we need to handle compatibility checks and provide fallbacks.

## Browser Compatibility

- **Chrome/Edge/Opera**: Full support on desktop and mobile
- **Safari**: Added in iOS 13+ and macOS 14.1+
- **Firefox**: No support as of 2023
- **Internet Explorer**: No support

## Implementation Overview

We've created a utility wrapper around the Web Speech API that handles:

1. Browser compatibility detection
2. Speech recognition initialization
3. State management (listening/not listening)
4. Error handling
5. Transcript processing

## Integration Steps for BriefInput Component

### 1. Set Up State and Refs

```tsx
import { useRef, useState } from "react";
import {
  checkSpeechRecognitionSupport,
  initSpeechRecognition,
  type SpeechRecognitionState,
} from "../../lib/webspeech/speechRecognition";

function BriefInput() {
  // Store the brief text (combined with voice input)
  const [briefText, setBriefText] = useState("");

  // Store speech recognition state
  const [recognitionState, setRecognitionState] =
    useState<SpeechRecognitionState>({
      isListening: false,
      transcript: "",
      error: null,
    });

  // Store compatibility check result
  const [isSupported, setIsSupported] = useState(false);

  // Store reference to recognition controller for stop/start
  const recognitionRef = useRef<ReturnType<
    typeof initSpeechRecognition
  > | null>(null);

  // ...rest of the component
}
```

### 2. Check Browser Support on Mount

```tsx
import { useEffect } from "react";

// Inside component
useEffect(() => {
  const support = checkSpeechRecognitionSupport();
  setIsSupported(support.isSupported);
}, []);
```

### 3. Implement Voice Button Handlers

```tsx
const handleStartVoiceInput = () => {
  if (!isSupported) return;

  recognitionRef.current = initSpeechRecognition(
    // Transcript callback
    (transcript) => {
      // Update the brief text with the transcript
      setBriefText((prev) => prev + transcript);
    },
    // State change callback
    (state) => {
      setRecognitionState(state);
    },
    // Options
    {
      continuous: true,
      interimResults: true,
      language: "en-US",
    }
  );

  recognitionRef.current.start();
};

const handleStopVoiceInput = () => {
  if (recognitionRef.current) {
    recognitionRef.current.stop();
  }
};
```

### 4. Create Voice Input Button UI

```tsx
// Inside your component's JSX
<div className="relative">
  <textarea
    value={briefText}
    onChange={(e) => setBriefText(e.target.value)}
    className="w-full p-4 border rounded"
    rows={6}
    placeholder="Enter your project brief here or use voice input..."
  />

  <button
    onClick={
      recognitionState.isListening
        ? handleStopVoiceInput
        : handleStartVoiceInput
    }
    disabled={!isSupported}
    className={`absolute right-4 bottom-4 p-2 rounded-full ${
      !isSupported
        ? "bg-gray-300 cursor-not-allowed"
        : recognitionState.isListening
        ? "bg-red-500 text-white" // Recording state
        : "bg-blue-500 text-white" // Ready state
    }`}
    title={
      !isSupported
        ? "Voice input not supported in this browser"
        : "Click to start voice input"
    }
  >
    {/* Microphone icon - add your preferred icon library */}
    {recognitionState.isListening ? "🔴" : "🎤"}
  </button>

  {/* Optional: Show recognition status */}
  {recognitionState.isListening && (
    <div className="text-sm text-green-600 mt-1">Listening...</div>
  )}

  {/* Error message */}
  {recognitionState.error && (
    <div className="text-sm text-red-600 mt-1">
      Error: {recognitionState.error}
    </div>
  )}
</div>
```

### 5. Add Clean-up Logic

```tsx
// Clean up the recognition instance on unmount
useEffect(() => {
  return () => {
    if (recognitionRef.current && recognitionState.isListening) {
      recognitionRef.current.stop();
    }
  };
}, [recognitionState.isListening]);
```

## Best Practices

1. **Provide Visual Feedback**:

   - Change button color when listening
   - Show a "listening" indicator
   - Provide error messages when something goes wrong

2. **Handle No-Support Gracefully**:

   - Disable the voice input button if not supported
   - Provide a tooltip explaining why it's disabled

3. **Auto-Stop After Silence**:

   - Consider implementing a timeout that stops recording after X seconds of silence
   - This provides a better user experience than making users click stop

4. **Handle Errors**:
   - Network disconnection
   - Permission denied
   - Other recognition errors

## Testing Notes

1. Chrome and Edge work well for testing
2. Safari requires permission grants and has some limitations
3. Firefox won't work at all (show disabled button)

## Demo Component

A full working example is available in the `test-demo.tsx` file. You can import this component during development to see how everything works together, then remove it once you've implemented your own version.

## Need Help?

If you encounter any issues with integration, feel free to reach out to the BE/AI team members who created this implementation.
