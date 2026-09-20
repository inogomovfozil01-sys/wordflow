'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, Lightbulb, HelpCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { CefrLevel } from '@/types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AiTutorChatProps {
  userLevel?: CefrLevel;
}

const SUGGESTED_PROMPTS = [
  'What is the difference between "say" and "tell"?',
  'Give me a mnemonic to remember "ubiquitous".',
  'How do I use "collaborate" naturally in a software job interview?',
  'Explain the grammar around "resilient" with 3 examples.',
  'Create a 3-question vocabulary quiz for my level.',
];

export function AiTutorChat({ userLevel = 'B1' }: AiTutorChatProps) {
  const { error } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I am your WordFlow AI English Tutor. I have calibrated my explanations for your **${userLevel}** level.\n\nYou can ask me to explain grammar around any word, create mnemonics, compare similar words, or give you personalized practice sentences. What would you like to explore today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        error(data.error || 'Failed to receive AI response');
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Sorry, I ran into an issue answering your question. Please try again.' },
        ]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch {
      error('Network error communicating with AI tutor');
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Network error. Please check your connection and try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden">
      {/* Top Bar */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">WordFlow AI Tutor</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <span>Powered by Gemini 3.8 Flash</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">Active Recall</span>
            </p>
          </div>
        </div>

        <Badge variant="cefr" level={userLevel}>
          Calibrated to {userLevel}
        </Badge>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                m.role === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
              }`}
            >
              {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div
              className={`p-4 rounded-2xl text-sm leading-relaxed max-w-[85%] whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-xs shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-tl-xs border border-slate-200/50 dark:border-slate-700/50'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-tl-xs text-sm flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse delay-75" />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse delay-150" />
              <span className="text-xs">Tutor is formulating response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length < 3 && (
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
          {SUGGESTED_PROMPTS.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(p)}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            >
              <Lightbulb size={12} className="text-amber-500" />
              <span>{p}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a grammar question, request an example, or compare two words..."
          className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          disabled={isLoading}
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!input.trim() || isLoading}
          className="rounded-2xl px-5 font-bold"
        >
          <Send size={16} />
        </Button>
      </form>
    </div>
  );
}
