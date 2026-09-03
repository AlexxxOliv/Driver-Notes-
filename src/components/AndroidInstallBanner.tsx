import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';

interface AndroidInstallBannerProps {
  isInstalled: boolean;
  onInstall: () => void;
  onOpenGuide: () => void;
}

export const AndroidInstallBanner: React.FC<AndroidInstallBannerProps> = ({
  isInstalled,
  onInstall,
  onOpenGuide,
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed) return null;

  return (
    <div
      id="android-install-banner"
      className="mx-3 mt-3 sm:mx-6 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/70 via-slate-900/90 to-indigo-900/40 p-3 shadow-lg shadow-indigo-950/50 backdrop-blur-sm transition"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600/30 text-indigo-400 ring-1 ring-indigo-500/40">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-1.5">
              Instale no seu Android
              <span className="inline-flex items-center gap-1 text-[11px] font-normal text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3" /> PWA Pronto
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              Acesse como um app nativo na tela inicial, em tela cheia e super rápido.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="install-banner-action-btn"
            onClick={onInstall}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-indigo-500 active:scale-95 transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Instalar</span>
          </button>
          <button
            id="install-banner-help-btn"
            onClick={onOpenGuide}
            className="hidden sm:inline-flex items-center rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition"
          >
            Como funciona?
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-md"
            title="Fechar banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
