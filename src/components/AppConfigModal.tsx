import React, { useState } from 'react';
import { Settings, X, Save, RotateCcw, Sparkles, Key, ExternalLink } from 'lucide-react';
import { AppConfig, PresetApp } from '../types';
import { PRESET_APPS } from '../data/presets';

interface AppConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onSave: (newConfig: AppConfig) => void;
  onReset: () => void;
}

export const AppConfigModal: React.FC<AppConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
  onReset,
}) => {
  const [formData, setFormData] = useState<AppConfig>(config);
  const [showKeyField, setShowKeyField] = useState(false);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: PresetApp) => {
    setFormData((prev) => ({
      ...prev,
      name: preset.name,
      tagline: preset.tagline,
      systemInstruction: preset.systemInstruction,
      starterPrompts: preset.starterPrompts,
    }));
  };

  const handleStarterChange = (index: number, val: string) => {
    const updated = [...formData.starterPrompts];
    updated[index] = val;
    setFormData((prev) => ({ ...prev, starterPrompts: updated }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div
      id="app-config-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="app-config-modal"
        className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-indigo-950/40 text-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 ring-1 ring-indigo-500/30">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white sm:text-lg">
                Personalizar Seu App Gemini
              </h2>
              <p className="text-xs text-slate-400">
                Ajuste o nome, prompt do sistema e respostas do seu assistente
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Quick Presets */}
          <div>
            <label className="block font-medium text-slate-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              Carregar Modelo Rápido:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_APPS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className={`flex flex-col items-start rounded-xl border p-2.5 text-left transition ${
                    formData.name === p.name
                      ? 'border-indigo-500 bg-indigo-950/40 text-white'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="font-semibold text-xs text-slate-200">{p.name}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{p.tagline}</span>
                </button>
              ))}
            </div>
          </div>

          {/* App Name & Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Nome do Aplicativo</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Meu Assistente de Estudos"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Subtítulo / Descrição Curta</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="Ex: Resumos e dicas de produtividade"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* System Instructions / Prompt */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-medium text-slate-300">
                Instruções do Gemini (Prompt de Sistema do seu Celular)
              </label>
              <span className="text-[10px] text-indigo-400">Cole aqui o prompt do seu app</span>
            </div>
            <textarea
              rows={4}
              value={formData.systemInstruction}
              onChange={(e) => setFormData({ ...formData, systemInstruction: e.target.value })}
              placeholder="Ex: Você é um professor especialista em matemática. Responda detalhando as fórmulas passo a passo..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Starter Prompts */}
          <div>
            <label className="block font-medium text-slate-300 mb-1.5">
              Sugestões Rápidas de Início (Botões na tela inicial)
            </label>
            <div className="space-y-1.5">
              {formData.starterPrompts.map((prompt, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={prompt}
                  onChange={(e) => handleStarterChange(idx, e.target.value)}
                  placeholder={`Sugestão ${idx + 1}...`}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              ))}
            </div>
          </div>

          {/* Temperature / Creativity */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-medium text-slate-300">Criatividade (Temperatura)</label>
              <span className="text-slate-400 font-mono text-[11px]">{formData.temperature}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.2"
              step="0.1"
              value={formData.temperature}
              onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>Mais Preciso (0.1)</span>
              <span>Equilibrado (0.7)</span>
              <span>Mais Criativo (1.2)</span>
            </div>
          </div>

          {/* Optional GitHub Pages API Key */}
          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowKeyField(!showKeyField)}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition font-medium"
            >
              <Key className="h-3.5 w-3.5 text-indigo-400" />
              <span>{showKeyField ? 'Ocultar chave personalizada' : 'Configurar chave Gemini para GitHub Pages (opcional)'}</span>
            </button>

            {showKeyField && (
              <div className="mt-2.5 rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
                <p className="text-[11px] text-slate-400">
                  No link atual do AI Studio, o servidor já responde automaticamente sem precisar de chave. Se você hospedar este frontend de forma estática no GitHub Pages, você pode salvar sua chave aqui (salva apenas no seu navegador):
                </p>
                <input
                  type="password"
                  value={formData.customApiKey || ''}
                  onChange={(e) => setFormData({ ...formData, customApiKey: e.target.value })}
                  placeholder="Cole sua chave GEMINI_API_KEY aqui..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:underline"
                >
                  Obter chave gratuita no Google AI Studio <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Restaurar Padrão
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-slate-800 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition shadow"
              >
                <Save className="h-3.5 w-3.5" /> Salvar Alterações
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
