/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { DriverHeader } from './components/DriverHeader';
import { DashboardView } from './components/DashboardView';
import { HistoryView } from './components/HistoryView';
import { BottomNav, ActiveTab } from './components/BottomNav';
import { ModalJornada } from './components/ModalJornada';
import { ModalCompartilhar } from './components/ModalCompartilhar';
import { ModalGastos } from './components/ModalGastos';
import { ModalObjetivos } from './components/ModalObjetivos';
import { ModalBackup } from './components/ModalBackup';
import { DriverAIAssistant } from './components/DriverAIAssistant';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import { AndroidInstallBanner } from './components/AndroidInstallBanner';
import { ShareModal } from './components/ShareModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { usePWAInstall } from './hooks/usePWAInstall';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { Jornada, Objetivo } from './types';
import { CheckCircle2, X } from 'lucide-react';

const STORAGE_REGISTROS = 'diario_motorista_dados';
const STORAGE_OBJETIVOS = 'diario_motorista_objetivos';

const SAMPLE_REGISTROS: Jornada[] = [
  {
    id: 1,
    data: '2026-09-01',
    horasTrabalhadas: '09:30',
    km: 150,
    precoLitro: 5.8,
    mediaKml: 10,
    combustivelCalculado: 87.0,
    uber: 180.0,
    pop: 110.0,
    particular: 50.0,
    gorjeta: 25.0,
    outrasDespesas: [
      { tipo: 'Pneu', valor: 35.0 },
      { tipo: 'Lanche', valor: 22.0 },
    ],
    obs: 'Exemplo do dia 1 - Trânsito moderado',
  },
  {
    id: 2,
    data: '2026-09-02',
    horasTrabalhadas: '08:15',
    km: 135,
    precoLitro: 5.8,
    mediaKml: 10.5,
    combustivelCalculado: 74.57,
    uber: 210.0,
    pop: 85.0,
    particular: 70.0,
    gorjeta: 30.0,
    outrasDespesas: [{ tipo: 'Lanche', valor: 18.0 }],
    obs: 'Bom fluxo na região central',
  },
];

const SAMPLE_OBJETIVOS: Objetivo[] = [
  { id: 1, titulo: 'Lava-Jato Completo', valor: 50.0 },
  { id: 2, titulo: 'Troca de Óleo e Filtros', valor: 200.0 },
  { id: 3, titulo: 'Pneu Novo Dianteiro', valor: 350.0 },
];

export default function App() {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const isOnline = useOnlineStatus();

  // Splash Screen on initial load
  const [showSplash, setShowSplash] = useState(true);
  const [replaySplash, setReplaySplash] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('painel');

  // Month & Year Filter
  const [filtroMesAno, setFiltroMesAno] = useState<string>(() => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    return `${ano}-${mes}`;
  });

  // Registros de Jornadas
  const [registros, setRegistros] = useState<Jornada[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REGISTROS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_REGISTROS;
  });

  // Objetivos / Metas
  const [objetivos, setObjetivos] = useState<Objetivo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_OBJETIVOS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_OBJETIVOS;
  });

  // Modals state
  const [isModalJornadaOpen, setIsModalJornadaOpen] = useState(false);
  const [jornadaEditando, setJornadaEditando] = useState<Jornada | null>(null);

  const [isModalGastosOpen, setIsModalGastosOpen] = useState(false);
  const [isModalObjetivosOpen, setIsModalObjetivosOpen] = useState(false);
  const [isModalBackupOpen, setIsModalBackupOpen] = useState(false);
  const [isModalAIOpen, setIsModalAIOpen] = useState(false);
  const [isModalInstallOpen, setIsModalInstallOpen] = useState(false);
  const [isShareAppOpen, setIsShareAppOpen] = useState(false);

  // Compartilhar card
  const [jornadaParaCompartilhar, setJornadaParaCompartilhar] = useState<Jornada | null>(null);

  // Toast notification
  const [notification, setNotification] = useState<string | null>(null);

  const triggerNotification = (text: string) => {
    setNotification(text);
    setTimeout(() => setNotification(null), 3500);
  };

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REGISTROS, JSON.stringify(registros));
    } catch (e) {
      console.error(e);
    }
  }, [registros]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_OBJETIVOS, JSON.stringify(objetivos));
    } catch (e) {
      console.error(e);
    }
  }, [objetivos]);

  // Handlers for Jornada
  const handleSaveJornada = (jornada: Jornada) => {
    const existsIndex = registros.findIndex((r) => r.id === jornada.id);
    if (existsIndex >= 0) {
      const copia = [...registros];
      copia[existsIndex] = jornada;
      setRegistros(copia);
      triggerNotification('Jornada atualizada com sucesso!');
    } else {
      setRegistros([jornada, ...registros]);
      triggerNotification('Nova jornada salva com sucesso!');
    }
    setJornadaEditando(null);
  };

  const handleDeleteJornada = (id: string | number) => {
    if (window.confirm('Tem certeza que deseja excluir esta jornada?')) {
      setRegistros(registros.filter((r) => r.id !== id));
      triggerNotification('Jornada removida.');
    }
  };

  const handleEditJornada = (jornada: Jornada) => {
    setJornadaEditando(jornada);
    setIsModalJornadaOpen(true);
  };

  const handleOpenNovaJornada = () => {
    setJornadaEditando(null);
    setIsModalJornadaOpen(true);
  };

  // Handlers for Objetivos
  const handleSaveObjetivo = (obj: Objetivo) => {
    const exists = objetivos.findIndex((o) => o.id === obj.id);
    if (exists >= 0) {
      const copia = [...objetivos];
      copia[exists] = obj;
      setObjetivos(copia);
    } else {
      setObjetivos([...objetivos, obj]);
    }
    triggerNotification('Objetivo salvo com sucesso!');
  };

  const handleDeleteObjetivo = (id: number) => {
    setObjetivos(objetivos.filter((o) => o.id !== id));
    triggerNotification('Objetivo excluído.');
  };

  // Handlers for Backup
  const handleImportSuccess = (novosRegistros: Jornada[], novosObjetivos: Objetivo[]) => {
    setRegistros(novosRegistros);
    setObjetivos(novosObjetivos);
    triggerNotification('Backup sincronizado com sucesso!');
  };

  // Calculate month profit for goals calculation
  const [anoSelStr, mesSelStr] = filtroMesAno.split('-');
  const anoSel = parseInt(anoSelStr, 10);
  const mesSel = parseInt(mesSelStr, 10);

  let lucroMesAtual = 0;
  registros.forEach((r) => {
    if (!r.data) return;
    const [a, m] = r.data.split('-');
    if (parseInt(a, 10) === anoSel && parseInt(m, 10) === mesSel) {
      const bruto = (r.uber || 0) + (r.pop || 0) + (r.particular || 0) + (r.gorjeta || 0);
      const comb = r.combustivelCalculado || r.combustivel || 0;
      let extras = 0;
      if (r.outrasDespesas) {
        extras = r.outrasDespesas.reduce((acc, d) => acc + (d.valor || 0), 0);
      }
      lucroMesAtual += bruto - (comb + extras);
    }
  });

  const getSubtituloHeader = () => {
    switch (activeTab) {
      case 'painel':
        return 'Painel de Controle';
      case 'historico':
        return 'Histórico Mensal';
      case 'objetivos':
        return 'Metas & Objetivos';
      case 'ia':
        return 'Assistente IA Gemini';
      default:
        return 'Painel de Controle';
    }
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-slate-100 text-gray-800 font-sans antialiased overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Splash Screen on startup matching Carregamento.jpg */}
      {showSplash && (
        <SplashScreen
          autoCloseDelay={2200}
          onFinish={() => setShowSplash(false)}
        />
      )}

      {/* Replay Splash screen modal */}
      {replaySplash && (
        <SplashScreen
          isReplay
          autoCloseDelay={0}
          onClose={() => setReplaySplash(false)}
        />
      )}

      {/* Main Header */}
      <DriverHeader
        subtitle={getSubtituloHeader()}
        onNovaJornada={handleOpenNovaJornada}
        onOpenInstallGuide={() => setIsModalInstallOpen(true)}
        onOpenShareApp={() => setIsShareAppOpen(true)}
        onOpenAI={() => setIsModalAIOpen(true)}
        onReplaySplash={() => setReplaySplash(true)}
        isInstallable={isInstallable}
      />

      {/* Android Install Banner (if on mobile web) */}
      <AndroidInstallBanner
        isInstalled={isInstalled}
        onInstall={install}
        onOpenGuide={() => setIsModalInstallOpen(true)}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed top-16 left-4 right-4 z-50 max-w-md mx-auto flex items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-950/90 text-emerald-200 px-4 py-2.5 text-xs shadow-2xl backdrop-blur animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 hover:text-white text-emerald-400"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Scrollable View */}
      <main className="flex-1 overflow-y-auto px-4 pt-3 pb-24 max-w-md mx-auto w-full">
        {activeTab === 'painel' && (
          <DashboardView
            filtroMesAno={filtroMesAno}
            onMesAnoChange={setFiltroMesAno}
            registros={registros}
            objetivos={objetivos}
            onOpenGastosModal={() => setIsModalGastosOpen(true)}
            onOpenObjetivosModal={() => setIsModalObjetivosOpen(true)}
            onExportBackup={() => setIsModalBackupOpen(true)}
            onOpenImportModal={() => setIsModalBackupOpen(true)}
          />
        )}

        {activeTab === 'historico' && (
          <HistoryView
            filtroMesAno={filtroMesAno}
            registros={registros}
            onCompartilhar={(j) => setJornadaParaCompartilhar(j)}
            onEditar={handleEditJornada}
            onDeletar={handleDeleteJornada}
          />
        )}

        {activeTab === 'objetivos' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-2xl shadow-md flex justify-between items-center">
              <div>
                <span className="text-[10px] text-amber-100 font-bold uppercase tracking-wider block">
                  Metas Financeiras
                </span>
                <h2 className="text-lg font-black text-white">Objetivos Cadastrados</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalObjetivosOpen(true)}
                className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition"
              >
                + Nova Meta
              </button>
            </div>

            <ModalObjetivos
              isOpen={true}
              onClose={() => setActiveTab('painel')}
              objetivos={objetivos}
              lucroMes={lucroMesAtual}
              onSaveObjetivo={handleSaveObjetivo}
              onDeleteObjetivo={handleDeleteObjetivo}
            />
          </div>
        )}

        {activeTab === 'ia' && (
          <div className="h-[75vh]">
            <DriverAIAssistant
              isOpen={true}
              onClose={() => setActiveTab('painel')}
              registros={registros}
              objetivos={objetivos}
              filtroMesAno={filtroMesAno}
            />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'ia') {
            setIsModalAIOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
      />

      {/* Offline Toast */}
      <OfflineIndicator isOnline={isOnline} />

      {/* Modal Nova / Editar Jornada */}
      <ModalJornada
        isOpen={isModalJornadaOpen}
        onClose={() => {
          setIsModalJornadaOpen(false);
          setJornadaEditando(null);
        }}
        onSave={handleSaveJornada}
        jornadaParaEditar={jornadaEditando}
      />

      {/* Modal Compartilhar Jornada (Gerador de Imagem) */}
      <ModalCompartilhar
        isOpen={!!jornadaParaCompartilhar}
        onClose={() => setJornadaParaCompartilhar(null)}
        jornada={jornadaParaCompartilhar}
      />

      {/* Modal Detalhes de Gastos */}
      <ModalGastos
        isOpen={isModalGastosOpen}
        onClose={() => setIsModalGastosOpen(false)}
        filtroMesAno={filtroMesAno}
        registros={registros}
      />

      {/* Modal Gerenciar Objetivos */}
      {activeTab !== 'objetivos' && (
        <ModalObjetivos
          isOpen={isModalObjetivosOpen}
          onClose={() => setIsModalObjetivosOpen(false)}
          objetivos={objetivos}
          lucroMes={lucroMesAtual}
          onSaveObjetivo={handleSaveObjetivo}
          onDeleteObjetivo={handleDeleteObjetivo}
        />
      )}

      {/* Modal Backup & Restauração */}
      <ModalBackup
        isOpen={isModalBackupOpen}
        onClose={() => setIsModalBackupOpen(false)}
        registros={registros}
        objetivos={objetivos}
        onImportSuccess={handleImportSuccess}
      />

      {/* Modal Assistente IA */}
      {activeTab !== 'ia' && (
        <DriverAIAssistant
          isOpen={isModalAIOpen}
          onClose={() => setIsModalAIOpen(false)}
          registros={registros}
          objetivos={objetivos}
          filtroMesAno={filtroMesAno}
        />
      )}

      {/* Modal Instalação Android PWA */}
      <AndroidInstallModal
        isOpen={isModalInstallOpen}
        onClose={() => setIsModalInstallOpen(false)}
        isInstallable={isInstallable}
        onTriggerInstall={install}
      />

      {/* Modal Compartilhar App */}
      <ShareModal
        isOpen={isShareAppOpen}
        onClose={() => setIsShareAppOpen(false)}
        config={{
          name: 'DRIVER NOTES',
          tagline: 'Diário de bordo e controle financeiro para motoristas de app',
          systemInstruction: '',
          starterPrompts: [],
          temperature: 0.7,
          themeColor: '#1e3a8a',
        }}
      />
    </div>
  );
}
