import React from 'react';
import {
  Download,
  Share2,
  Github,
  Settings,
  Sparkles,
  Trash2,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { AppConfig } from '../types';

interface HeaderProps {
  config: AppConfig;
  isOnline: boolean;
  isInstalled: boolean;
  isInstallable: boolean;
  onInstallClick: () => void;
  onShareClick: () => void;
  onGitHubClick: () => void;
  onSettingsClick: () => void;
  onClearChat: () => void;
  hasMessages: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  isOnline,
  isInstalled,
  isInstallable,
  onInstallClick,
  onShareClick,
  onGitHubClick,
  onSettingsClick,
  onClearChat,
  hasMessages,
}) => {
  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/90 px-3 py-2.5 backdrop-blur-md sm:px-6 sm:py-3"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/20 text-white">
          <Sparkles className="h-5 w-5" />
          <span
            className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-slate-950 ${
              isOnline ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            title={isOnline ? 'Online' : 'Offline'}
          />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-base font-semibold tracking-tight text-white sm:text-lg">
              {config.name}
            </h1>
            <span className="hidden rounded-full bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-400 ring-1 ring-indigo-500/20 sm:inline-block">
              PWA Online
            </span>
          </div>
          <p className="truncate text-xs text-slate-400 max-w-[200px] sm:max-w-md">
            {config.tagline || 'Seu aplicativo Gemini acessível por link'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Install on Android button */}
        {!isInstalled && (
          <button
            id="install-pwa-header-btn"
            onClick={onInstallClick}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-500 transition active:scale-95 sm:px-3 sm:py-1.5"
            title="Instalar no Android como aplicativo"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden xs:inline sm:inline">Instalar no Celular</span>
            <span className="xs:hidden sm:hidden">Instalar</span>
          </button>
        )}

        {/* Share Link button */}
        <button
          id="share-link-btn"
          onClick={onShareClick}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/90 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-600 hover:bg-slate-800 transition active:scale-95 sm:px-3"
          title="Compartilhar link do app"
        >
          <Share2 className="h-3.5 w-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Compartilhar</span>
        </button>

        {/* GitHub Pages Modal button */}
        <button
          id="github-pages-btn"
          onClick={onGitHubClick}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/90 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-600 hover:bg-slate-800 transition active:scale-95 sm:px-3"
          title="Como hospedar no GitHub Pages"
        >
          <Github className="h-3.5 w-3.5 text-slate-300" />
          <span className="hidden md:inline">GitHub Pages</span>
        </button>

        {/* Clear chat */}
        {hasMessages && (
          <button
            id="clear-chat-btn"
            onClick={onClearChat}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition"
            title="Limpar conversa"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Settings button */}
        <button
          id="app-settings-btn"
          onClick={onSettingsClick}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white transition"
          title="Personalizar prompt e instruções do Gemini"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};
