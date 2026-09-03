import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  Volume2,
  VolumeX,
  CornerDownLeft,
  Smartphone,
  Share2,
} from 'lucide-react';
import { ChatMessage, AppConfig } from '../types';

interface ChatAreaProps {
  messages: ChatMessage[];
  loading: boolean;
  config: AppConfig;
  onSelectStarter: (prompt: string) => void;
  onOpenShare: () => void;
  onOpenInstall: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  loading,
  config,
  onSelectStarter,
  onOpenShare,
  onOpenInstall,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div id="chat-messages-container" className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6 space-y-4">
      {messages.length === 0 ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center max-w-xl mx-auto py-8">
          <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 shadow-xl shadow-indigo-500/25 text-white">
            <Sparkles className="h-8 w-8" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500" />
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1.5">
            {config.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6">
            {config.tagline || 'Seu assistente Gemini conectado e pronto para responder a qualquer pessoa com o link.'}
          </p>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <button
              onClick={onOpenInstall}
              className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3 py-1 text-xs font-medium text-indigo-300 hover:bg-indigo-900/40 transition"
            >
              <Smartphone className="h-3.5 w-3.5" /> Instalar no Celular
            </button>
            <button
              onClick={onOpenShare}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
            >
              <Share2 className="h-3.5 w-3.5 text-indigo-400" /> Compartilhar Link
            </button>
          </div>

          {/* Starter Prompts Grid */}
          <div className="w-full text-left">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2.5 px-1">
              Perguntas sugeridas para iniciar:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {config.starterPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectStarter(prompt)}
                  className="group flex items-start justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-left text-xs text-slate-200 shadow-sm hover:border-indigo-500/50 hover:bg-slate-800/80 transition active:scale-[0.99]"
                >
                  <span className="line-clamp-2 leading-relaxed">{prompt}</span>
                  <CornerDownLeft className="h-4 w-4 shrink-0 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-indigo-400 transition" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((msg) => {
            const isModel = msg.role === 'model' || msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}
              >
                {isModel && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-sm mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`group relative max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isModel
                      ? 'border border-slate-800 bg-slate-900/90 text-slate-100 shadow-md'
                      : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                  }`}
                >
                  {isModel ? (
                    <div className="prose prose-invert prose-xs sm:prose-sm max-w-none break-words">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap break-words">{msg.text}</div>
                  )}

                  {/* Actions for model messages */}
                  {isModel && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleSpeak(msg.id, msg.text)}
                          className="p-1 rounded hover:bg-slate-800 hover:text-slate-200 transition"
                          title={speakingId === msg.id ? 'Parar leitura' : 'Ouvir resposta'}
                        >
                          {speakingId === msg.id ? (
                            <VolumeX className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
                          ) : (
                            <Volume2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="p-1 rounded hover:bg-slate-800 hover:text-slate-200 transition"
                          title="Copiar texto"
                        >
                          {copiedId === msg.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {!isModel && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-300 shadow-sm mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600/30 text-indigo-400 ring-1 ring-indigo-500/40 animate-pulse">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce" />
                <span className="ml-1 text-slate-400">Gemini está pensando...</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};
