import React, { useState } from 'react';
import { Github, X, Copy, Check, ExternalLink, Globe, Code, FileText, Sparkles } from 'lucide-react';

interface GitHubPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WORKFLOW_CODE = `name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm install

      - name: Build static site
        run: npx vite build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

export const GitHubPagesModal: React.FC<GitHubPagesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);
  const [activeTab, setActiveTab] = useState<'passo-a-passo' | 'workflow' | 'api-key'>('passo-a-passo');

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWorkflow(true);
    setTimeout(() => setCopiedWorkflow(false), 2000);
  };

  return (
    <div
      id="github-pages-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="github-pages-modal"
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-indigo-950/40 text-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-white ring-1 ring-slate-700">
              <Github className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white sm:text-lg">
                Como Hospedar no GitHub Pages
              </h2>
              <p className="text-xs text-slate-400">
                Seu app já está 100% configurado para o GitHub Pages e PWA
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

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-5 pt-2 shrink-0">
          <button
            onClick={() => setActiveTab('passo-a-passo')}
            className={`flex items-center gap-2 border-b-2 px-3 py-2 text-xs font-medium transition ${
              activeTab === 'passo-a-passo'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Passo a Passo
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`flex items-center gap-2 border-b-2 px-3 py-2 text-xs font-medium transition ${
              activeTab === 'workflow'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            Arquivo de Deploy (.github)
          </button>
          <button
            onClick={() => setActiveTab('api-key')}
            className={`flex items-center gap-2 border-b-2 px-3 py-2 text-xs font-medium transition ${
              activeTab === 'api-key'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Como o Gemini Funciona no Pages
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-slate-300">
          {activeTab === 'passo-a-passo' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-emerald-300">
                <p className="font-semibold text-xs flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-400" />
                  Boas notícias: Todas as configurações de build já foram feitas!
                </p>
                <p className="text-[11px] text-emerald-400/90 mt-1">
                  O projeto já possui <code>base: './'</code> no Vite (para não dar erro de caminhos no GitHub Pages) e o fluxo automático de compilação.
                </p>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] text-white">
                      1
                    </span>
                    Crie um repositório no GitHub
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Acesse <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-indigo-400 underline inline-flex items-center gap-0.5">github.com/new <ExternalLink className="h-3 w-3" /></a> e crie um novo repositório público (ex: <code>meu-gemini-app</code>).
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] text-white">
                      2
                    </span>
                    Exporte ou envie o código para o GitHub
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-2">
                    Você pode conectar sua conta GitHub diretamente no Google AI Studio (menu superior direito &gt; <strong>Export to GitHub</strong>), ou baixar o ZIP e fazer o <code>git push</code>.
                  </p>
                  <div className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-[11px] font-mono text-slate-300">
                    git remote add origin https://github.com/SEU_USUARIO/meu-gemini-app.git<br />
                    git branch -M main<br />
                    git push -u origin main
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] text-white">
                      3
                    </span>
                    Ative o GitHub Pages em 1 clique
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                    <li>No seu repositório no GitHub, clique na aba <strong>Settings</strong>.</li>
                    <li>No menu lateral esquerdo, clique em <strong>Pages</strong>.</li>
                    <li>Em <strong>Build and deployment &gt; Source</strong>, selecione: <strong className="text-indigo-300">GitHub Actions</strong>.</li>
                    <li>Pronto! O GitHub vai rodar a Action criada e publicar seu site em <code>https://seu-usuario.github.io/meu-gemini-app/</code>.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workflow' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Arquivo: <code>.github/workflows/deploy.yml</code> (já adicionado no projeto!)
                </p>
                <button
                  onClick={() => copyToClipboard(WORKFLOW_CODE)}
                  className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700 transition"
                >
                  {copiedWorkflow ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" /> Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copiar Código
                    </>
                  )}
                </button>
              </div>

              <pre className="max-h-72 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-[11px] text-indigo-300">
                {WORKFLOW_CODE}
              </pre>
            </div>
          )}

          {activeTab === 'api-key' && (
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <h3 className="text-sm font-semibold text-white">
                  Diferença entre o Link do AI Studio e o GitHub Pages
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  <strong>1. No Link Atual (AI Studio / Cloud Run):</strong><br />
                  O app possui um servidor seguro embutido. Qualquer pessoa que abrir o seu link pode conversar com a IA sem precisar digitar nenhuma chave, pois o servidor utiliza a chave configurada no projeto!
                </p>
                <p className="text-slate-300 leading-relaxed">
                  <strong>2. No GitHub Pages:</strong><br />
                  O GitHub Pages é uma hospedagem de arquivos puramente estática (HTML/JS). Por isso, criamos uma opção nas <strong>Configurações (⚙️)</strong> do app para que você ou seus usuários possam inserir uma chave gratuita do Gemini diretamente na interface, armazenada localmente com total segurança no navegador (localStorage).
                </p>
              </div>

              <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-3.5">
                <p className="text-xs font-medium text-indigo-300">Onde conseguir a chave gratuita?</p>
                <p className="text-[11px] text-slate-300 mt-1">
                  Qualquer pessoa pode gerar uma chave gratuita em segundos no{' '}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 underline inline-flex items-center gap-0.5"
                  >
                    Google AI Studio API Keys <ExternalLink className="h-3 w-3" />
                  </a>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 p-4 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            Dúvidas? Você pode testar e usar o app imediatamente pelo link atual!
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
