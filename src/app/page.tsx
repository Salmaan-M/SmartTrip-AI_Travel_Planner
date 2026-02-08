'use client';

import { useState, useRef, useEffect } from 'react';
import { useTamboThread, useTamboThreadInput } from '@tambo-ai/react';
import { Send, Loader2 } from 'lucide-react';

export default function Home() {
  const { thread } = useTamboThread();
  const { value, setValue, submit, isPending } = useTamboThreadInput();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    // Set up the message - Tambo will use the generateTravelPlan tool
    setValue(input);
    await submit();
    setInput('');
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-purple-50 flex flex-col relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '4s' }}></div>

      {/* Header */}
      <div className="relative z-10 bg-white/70 backdrop-blur-md border-b border-white/30 py-6 px-4 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 mb-2">
            🧳 SmartTrip AI
          </h1>
          <p className="text-gray-700 font-medium">
            Describe your dream trip and let AI create a perfect 3-day itinerary for you ✈️
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Example: "Tokyo for anime and shopping" or "Paris solo 3 days budget $2000"
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 relative z-5">
        <div className="max-w-5xl mx-auto space-y-4">
          {thread.messages.length === 0 && (
            <div className="flex items-center justify-center h-64 text-center">
              <div>
                <p className="text-2xl text-gray-400 mb-2">🌍</p>
                <p className="text-gray-500">
                  Start by telling me about your dream trip!
                </p>
              </div>
            </div>
          )}

          {thread.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-2xl ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-lg rounded-br-none p-4'
                    : 'bg-white rounded-lg rounded-bl-none p-4 shadow-md w-full'
                }`}
              >
                {/* User message */}
                {message.role === 'user' && Array.isArray(message.content) && (
                  <div className="text-sm">
                    {message.content.map((part, i) =>
                      part.type === 'text' ? (
                        <p key={i}>{part.text}</p>
                      ) : null
                    )}
                  </div>
                )}

                {/* Assistant text response */}
                {message.role === 'assistant' && Array.isArray(message.content) && (
                  <div className="text-gray-800 text-sm space-y-2">
                    {message.content.map((part, i) =>
                      part.type === 'text' ? (
                        <p key={i}>{part.text}</p>
                      ) : null
                    )}
                  </div>
                )}

                {/* Rendered component */}
                {message.renderedComponent && (
                  <div className="mt-4">
                    {message.renderedComponent}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isPending && (
            <div className="flex justify-start">
              <div className="bg-white rounded-lg rounded-bl-none p-4 shadow-md">
                <div className="flex items-center gap-2 text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Planning your trip...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="relative z-10 bg-white/70 backdrop-blur-md border-t border-white/30 p-4 shadow-lg">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What's your dream trip? E.g., 'Tokyo for anime', 'Paris 3 days budget $2000'"
              disabled={isPending}
              className="flex-1 bg-white/90 border border-white/60 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:opacity-50 font-medium placeholder:text-gray-400 transition-all"
            />
            <button
              type="submit"
              disabled={isPending || !input.trim()}
              className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl px-8 py-3 flex items-center gap-2 transition-all font-semibold shadow-lg hover:shadow-xl disabled:shadow-md"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Send
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

