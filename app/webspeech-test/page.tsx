import WebSpeechDemo from "../../lib/webspeech/test-demo";

export default function WebSpeechTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Web Speech API Test Page
      </h1>
      <p className="text-center mb-8 text-gray-600">
        This page demonstrates the Web Speech API functionality for use in the
        BriefInput component.
      </p>

      <WebSpeechDemo />

      <div className="mt-10 text-center">
        <p className="text-sm text-gray-500">
          Note: This is a test page created by the BE/AI team to help FE1 with
          Web Speech API integration.
        </p>
      </div>
    </div>
  );
}
