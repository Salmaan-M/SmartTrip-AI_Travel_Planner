import { Tooltip } from "@/components/tambo/suggestions-tooltip";
import { useTamboThreadInput, useTamboVoice } from "@tambo-ai/react";
import { Loader2Icon, Mic, Square } from "lucide-react";
import React, { useEffect, useRef } from "react";

/**
 * Button for dictating speech into the message input.
 */
export default function DictationButton() {
  const {
    startRecording,
    stopRecording,
    isRecording,
    isTranscribing,
    transcript,
    transcriptionError,
  } = useTamboVoice();
  const { setValue } = useTamboThreadInput();
  const lastProcessedTranscriptRef = useRef<string>("");

  const handleStartRecording = () => {
    lastProcessedTranscriptRef.current = "";
    startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  useEffect(() => {
    if (!transcript) return;

    const lastTranscript = lastProcessedTranscriptRef.current;
    if (transcript === lastTranscript) return;

    // Assumes transcript updates are commonly prefix-extended (partial -> full).
    const nextChunk = transcript.startsWith(lastTranscript)
      ? transcript.slice(lastTranscript.length)
      : transcript;

    lastProcessedTranscriptRef.current = transcript;

    const normalizedChunk = nextChunk.trimStart();
    if (!normalizedChunk) return;

    setValue((prev) => (prev ? `${prev} ${normalizedChunk}` : normalizedChunk));
  }, [transcript, setValue]);

  if (isTranscribing) {
    return (
      <div className="p-2 rounded-md">
        <Loader2Icon className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center gap-2">
      <span className="text-sm text-red-500">{transcriptionError}</span>
      {isRecording ? (
        <Tooltip content="Stop">
          <button
            type="button"
            onClick={handleStopRecording}
            aria-label="Stop dictation"
            className="p-2 rounded-md cursor-pointer hover:bg-muted"
          >
            <Square className="h-4 w-4 text-red-500 fill-current animate-pulse" />
          </button>
        </Tooltip>
      ) : (
        <Tooltip content="Dictate">
          <button
            type="button"
            onClick={handleStartRecording}
            aria-label="Start dictation"
            className="p-2 rounded-md cursor-pointer hover:bg-muted"
          >
            <Mic className="h-5 w-5" />
          </button>
        </Tooltip>
      )}
    </div>
  );
}
