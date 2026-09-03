import React from 'react';
import { TrendingUp, ListChecks, Target, Sparkles } from 'lucide-react';

export type ActiveTab = 'painel' | 'historico' | 'objetivos' | 'ia';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav
      id="bottom-navigation"
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] z-40"
    >
      <div className="max-w-md mx-auto flex justify-around items-center py-1.5 px-2">
        {/* Tab 1: Painel */}
        <button
          type="button"
          onClick={() => onTabChange('painel')}
          id="tab-painel"
          className={`flex-1 flex flex-col items-center py-1 transition ${
            activeTab === 'painel'
              ? 'text-indigo-600 font-extrabold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <TrendingUp className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Painel</span>
        </button>

        {/* Tab 2: Histórico */}
        <button
          type="button"
          onClick={() => onTabChange('historico')}
          id="tab-historico"
          className={`flex-1 flex flex-col items-center py-1 transition ${
            activeTab === 'historico'
              ? 'text-indigo-600 font-extrabold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <ListChecks className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Histórico</span>
        </button>

        {/* Tab 3: Metas */}
        <button
          type="button"
          onClick={() => onTabChange('objetivos')}
          id="tab-objetivos"
          className={`flex-1 flex flex-col items-center py-1 transition ${
            activeTab === 'objetivos'
              ? 'text-amber-600 font-extrabold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <Target className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Metas</span>
        </button>

        {/* Tab 4: IA Copilot */}
        <button
          type="button"
          onClick={() => onTabChange('ia')}
          id="tab-ia"
          className={`flex-1 flex flex-col items-center py-1 transition ${
            activeTab === 'ia'
              ? 'text-indigo-600 font-extrabold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5 text-amber-500" />
          <span className="text-[10px]">Assistente IA</span>
        </button>
      </div>
    </nav>
  );
};
