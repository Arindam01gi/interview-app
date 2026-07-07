/**
 * Safe references to SpeechRecognition constructors.
 * Handles SSR environments where window / webkitSpeechRecognition might not exist.
 */
export function getSpeechRecognitionConstructor(): any {
  if (typeof window === "undefined") {
    return null;
  }
  
  return (
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition ||
    null
  );
}

/**
 * Checks if the browser supports Speech Recognition.
 */
export function isSpeechRecognitionSupported(): boolean {
  return getSpeechRecognitionConstructor() !== null;
}
