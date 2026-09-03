import React, { useState } from 'react';
import { Share2, X, Copy, Check, QrCode, Globe, Smartphone, MessageSquare } from 'lucide-react';
import { AppConfig } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedConfigLink, setCopiedConfigLink] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (!isOpen) return null;

  const baseUrl = window.location.origin + window.location.pathname;

  // Encode config so other users open the exact app customizations
  const encodedConfig = encodeURIComponent(
    JSON.stringify({
      n: config.name,
      t: config.tagline,
      s: config.systemInstruction,
      p: config.starterPrompts,
    })
  );
  const shareUrlWithConfig = `${baseUrl}#app=${encodedConfig}`;
  const regularShareUrl = window.location.href;

  const handleCopy = (url: string, isConfig: boolean) => {
    navigator.clipboard.writeText(url);
    if (isConfig) {
      setCopiedConfigLink(true);
      setTimeout(() => setCopiedConfigLink(false), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: config.name,
          text: `Acesse meu app ${config.name} online ou instale no Android!`,
          url: shareUrlWithConfig,
        });
      } catch (e) {
        console.log('Share canceled or error:', e);
      }
    } else {
      handleCopy(shareUrlWithConfig, true);
    }
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    shareUrlWithConfig
  )}&bgcolor=0f172a&color=ffffff&margin=10`;

  return (
    <div
      id="share-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="share-modal"
        className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-2xl shadow-indigo-950/40 text-slate-100"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 ring-1 ring-indigo-500/30">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white sm:text-lg">
                Compartilhar Acesso Online
              </h2>
              <p className="text-xs text-slate-400">
                Envie para amigos ou acesse em outro dispositivo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 my-5 text-xs text-slate-300">
          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1.5 flex items-center justify-between">
              <span>Link do Seu App (com seu prompt e nome)</span>
              <span className="text-[11px] text-indigo-400">Recomendado</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrlWithConfig}
                className="w-full truncate rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 font-mono text-xs text-slate-300 focus:outline-none"
              />
              <button
                onClick={() => handleCopy(shareUrlWithConfig, true)}
                className="flex items-center gap-1 shrink-0 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-500 transition active:scale-95"
              >
                {copiedConfigLink ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-300" /> Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copiar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Native mobile share button */}
          <button
            onClick={handleNativeShare}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-950/40 py-2.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/40 transition"
          >
            <Smartphone className="h-4 w-4" />
            Compartilhar via WhatsApp, Telegram ou Redes
          </button>

          {/* QR Code toggle */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              onClick={() => setShowQR(!showQR)}
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition"
            >
              <QrCode className="h-4 w-4 text-indigo-400" />
              <span>{showQR ? 'Ocultar QR Code' : 'Escanear QR Code com a câmera do celular'}</span>
            </button>

            {showQR && (
              <div className="mt-3 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950 border border-slate-800">
                <img
                  src={qrImageUrl}
                  alt="QR Code do App"
                  className="h-44 w-44 rounded-lg border border-slate-800 shadow"
                  loading="lazy"
                />
                <p className="text-[11px] text-slate-400 mt-2 text-center">
                  Aponte a câmera do seu celular para abrir o app e instalar direto!
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-800 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
