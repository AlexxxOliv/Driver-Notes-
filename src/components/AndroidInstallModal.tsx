import React from 'react';
import { Smartphone, X, Check, ArrowRight, Download, HelpCircle } from 'lucide-react';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  onTriggerInstall: () => void;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  onTriggerInstall,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="android-install-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="android-install-modal"
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-2xl shadow-indigo-950/40 text-slate-100"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 ring-1 ring-indigo-500/30">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Como Instalar no Android</h2>
              <p className="text-xs text-slate-400">
                Transforme esta página em um aplicativo nativo na tela do seu telefone
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

        {/* Direct native trigger if available */}
        {isInstallable && (
          <div className="my-4 rounded-xl border border-indigo-500/40 bg-indigo-950/40 p-3.5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-indigo-300">Seu navegador suporta instalação direta!</p>
                <p className="text-[11px] text-slate-300">
                  Clique no botão abaixo para o Android exibir a janela oficial de instalação.
                </p>
              </div>
              <button
                onClick={() => {
                  onTriggerInstall();
                  onClose();
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-500 transition"
              >
                <Download className="h-4 w-4" />
                Instalar Agora
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4 my-4 text-xs text-slate-300">
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] text-white">
                1
              </span>
              No Google Chrome (Android):
            </div>
            <ul className="space-y-2 text-slate-300 list-disc list-inside">
              <li>
                Toque no menu de <strong>três pontinhos (⋮)</strong> no canto superior direito do Chrome.
              </li>
              <li>
                Procure e selecione a opção <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
              </li>
              <li>
                Toque em <strong>"Instalar"</strong> para confirmar.
              </li>
              <li className="text-emerald-400 font-medium list-none flex items-center gap-1.5 mt-1">
                <Check className="h-3.5 w-3.5" /> O app será adicionado à sua gaveta de aplicativos com ícone próprio!
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-[11px] text-white">
                2
              </span>
              No Samsung Internet:
            </div>
            <ul className="space-y-2 text-slate-300 list-disc list-inside">
              <li>
                Toque no ícone de <strong>menu (☰)</strong> no canto inferior direito.
              </li>
              <li>
                Selecione <strong>"+ Adicionar página a"</strong> e escolha <strong>"Tela inicial"</strong>.
              </li>
              <li>Confirme e o atalho funcionará com tela cheia!</li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-950/30 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-1">
              <HelpCircle className="h-4 w-4 text-slate-400" />
              Por que usar como PWA?
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Diferente de um site normal, o PWA abre sem as barras de endereço do navegador, carrega mais rápido usando cache local, suporta modo offline básico e não ocupa centenas de megabytes no armazenamento do seu aparelho.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
          >
            Entendi, fechar
          </button>
        </div>
      </div>
    </div>
  );
};
