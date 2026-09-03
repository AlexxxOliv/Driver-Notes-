import React from 'react';
import { PlusCircle, Download, Sparkles, Film, Share2 } from 'lucide-react';

interface DriverHeaderProps {
  subtitle: string;
  onNovaJornada: () => void;
  onOpenInstallGuide: () => void;
  onOpenShareApp: () => void;
  onOpenAI: () => void;
  onReplaySplash: () => void;
  isInstallable: boolean;
}

export const DriverHeader: React.FC<DriverHeaderProps> = ({
  subtitle,
  onNovaJornada,
  onOpenInstallGuide,
  onOpenShareApp,
  onOpenAI,
  onReplaySplash,
  isInstallable,
}) => {
  return (
    <header
      id="driver-header"
      className="bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 text-white shadow-lg sticky top-0 z-40 border-b border-indigo-500/20"
    >
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* App Logo & Title */}
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 shrink-0 overflow-hidden shadow-sm">
            <img
              src="/icon.svg"
              alt="Driver Notes Icon"
              className="w-7 h-7 object-contain drop-shadow"
              onError={(e) => {
                // Fallback to car SVG if needed
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="truncate">
            <h1 className="text-base font-black tracking-wider leading-tight text-white flex items-center gap-1.5">
              <span>DRIVER NOTES</span>
            </h1>
            <span className="text-[10px] text-indigo-200 font-medium tracking-wide block truncate">
              {subtitle}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1.5 shrink-0">
          {/* Replay Splash button */}
          <button
            type="button"
            onClick={onReplaySplash}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-indigo-100 transition"
            title="Ver tela de abertura (DRIVER NOTES by ALEX)"
          >
            <Film className="w-4 h-4" />
          </button>

          {/* AI Insights Copilot */}
          <button
            type="button"
            onClick={onOpenAI}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-amber-300 transition"
            title="Assistente Gemini para Motoristas"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Share App */}
          <button
            type="button"
            onClick={onOpenShareApp}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-indigo-100 transition"
            title="Compartilhar aplicativo"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Install PWA Button (if installable or open guide) */}
          <button
            type="button"
            onClick={onOpenInstallGuide}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-emerald-300 transition"
            title="Instalar no Celular (Android / PWA)"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* + Jornada Button */}
          <button
            type="button"
            onClick={onNovaJornada}
            id="btn-nova-jornada-header"
            className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs px-3 py-2 rounded-xl shadow-md border border-emerald-400/40 flex items-center space-x-1.5 transition shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Jornada</span>
          </button>
        </div>
      </div>
    </header>
  );
};
