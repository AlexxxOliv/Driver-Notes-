import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, StopCircle } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  loading: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  loading,
  disabled = false,
}) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [text]);

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'pt-BR';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert('Seu navegador não suporta reconhecimento de voz direto.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!text.trim() || loading || disabled) return;
    onSendMessage(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div
      id="chat-input-bar"
      className="border-t border-slate-800/80 bg-slate-950/90 p-3 sm:p-4 backdrop-blur-md shrink-0"
    >
      <div className="max-w-3xl mx-auto flex items-end gap-2 rounded-2xl border border-slate-700/80 bg-slate-900/95 p-2 shadow-lg focus-within:border-indigo-500/80 focus-within:ring-1 focus-within:ring-indigo-500/30 transition">
        {/* Voice Input Button */}
        <button
          type="button"
          onClick={toggleVoice}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
          title={isListening ? 'Parar gravação de voz' : 'Falar por voz'}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Ouvindo sua voz...' : 'Digite sua mensagem para o Gemini...'}
          disabled={disabled || loading}
          className="flex-1 max-h-36 resize-none bg-transparent px-1 py-1.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none leading-relaxed"
        />

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!text.trim() || loading || disabled}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
            text.trim() && !loading && !disabled
              ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-500 active:scale-95'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
          title="Enviar mensagem"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      <div className="max-w-3xl mx-auto mt-2 flex items-center justify-between text-[11px] text-slate-500 px-2">
        <span className="truncate">
          Pressione <kbd className="font-mono text-[10px] bg-slate-900 px-1 py-0.5 rounded border border-slate-800">Enter</kbd> para enviar, <kbd className="font-mono text-[10px] bg-slate-900 px-1 py-0.5 rounded border border-slate-800">Shift+Enter</kbd> para nova linha
        </span>
        <span className="hidden sm:inline">Modelo: Gemini 3.8 Flash</span>
      </div>
    </div>
  );
};
