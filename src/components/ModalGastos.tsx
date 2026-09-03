import React from 'react';
import {
  X,
  Receipt,
  Fuel,
  Utensils,
  Disc,
  Wrench,
  Droplet,
  Milestone,
} from 'lucide-react';
import { Jornada } from '../types';

interface ModalGastosProps {
  isOpen: boolean;
  onClose: () => void;
  filtroMesAno: string;
  registros: Jornada[];
}

export const ModalGastos: React.FC<ModalGastosProps> = ({
  isOpen,
  onClose,
  filtroMesAno,
  registros,
}) => {
  if (!isOpen) return null;

  const [anoSelStr, mesSelStr] = filtroMesAno.split('-');
  const anoSel = parseInt(anoSelStr, 10) || new Date().getFullYear();
  const mesSel = parseInt(mesSelStr, 10) || new Date().getMonth() + 1;

  const mesesNomes = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  const nomeMes = `${mesesNomes[mesSel - 1]} / ${anoSel}`;

  const registrosDoMes = registros.filter((item) => {
    if (!item.data) return false;
    const [anoItem, mesItem] = item.data.split('-');
    return parseInt(anoItem, 10) === anoSel && parseInt(mesItem, 10) === mesSel;
  });

  const mapaGastos: Record<string, number> = {};

  registrosDoMes.forEach((item) => {
    const comb = item.combustivelCalculado || item.combustivel || 0;
    if (comb > 0) {
      mapaGastos['Combustível'] = (mapaGastos['Combustível'] || 0) + comb;
    }

    if (item.outrasDespesas && Array.isArray(item.outrasDespesas)) {
      item.outrasDespesas.forEach((d) => {
        const cat = d.tipo || 'Outros';
        const val = d.valor || 0;
        if (val > 0) {
          mapaGastos[cat] = (mapaGastos[cat] || 0) + val;
        }
      });
    }
  });

  const arrayGastos = Object.keys(mapaGastos)
    .map((cat) => ({
      categoria: cat,
      valor: mapaGastos[cat],
    }))
    .sort((a, b) => b.valor - a.valor);

  const totalConsolidado = arrayGastos.reduce((acc, g) => acc + g.valor, 0);

  const getCategoryIcon = (categoria: string) => {
    switch (categoria) {
      case 'Combustível':
        return <Fuel className="w-4 h-4 text-amber-500" />;
      case 'Lanche':
      case 'Alimentação':
        return <Utensils className="w-4 h-4 text-orange-500" />;
      case 'Pneu':
        return <Disc className="w-4 h-4 text-slate-700" />;
      case 'Manutenção':
      case 'Troca de Óleo':
        return <Wrench className="w-4 h-4 text-indigo-500" />;
      case 'Lava-Jato':
        return <Droplet className="w-4 h-4 text-blue-500" />;
      case 'Pedágio':
        return <Milestone className="w-4 h-4 text-emerald-500" />;
      default:
        return <Receipt className="w-4 h-4 text-rose-500" />;
    }
  };

  return (
    <div
      id="modal-detalhes-gastos"
      className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-start justify-center p-3 pt-6 z-50 overflow-y-auto"
    >
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-rose-600 text-white px-5 py-3.5 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2">
            <Receipt className="w-4 h-4" />
            <h3 className="font-bold text-sm">Detalhamento de Gastos</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-90 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subheader */}
        <div className="bg-rose-50 px-5 py-2 border-b border-rose-100 flex justify-between items-center shrink-0">
          <span className="text-xs font-bold text-rose-800">Mês: {nomeMes}</span>
          <span className="text-[10px] text-slate-500 font-bold">
            Ordenado por Maior Custo
          </span>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto space-y-2.5">
          {arrayGastos.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Nenhum gasto registrado neste mês!
            </div>
          ) : (
            arrayGastos.map((item, index) => (
              <div
                key={item.categoria}
                className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-5 text-center text-xs font-bold text-slate-400">
                    #{index + 1}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                    {getCategoryIcon(item.categoria)}
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    {item.categoria}
                  </span>
                </div>
                <span className="text-sm font-black text-rose-600">
                  R$ {item.valor.toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-3.5 border-t border-slate-200 flex justify-between items-center shrink-0">
          <span className="text-xs font-bold text-slate-600 uppercase">
            Total de Gastos:
          </span>
          <span className="text-lg font-black text-rose-600">
            R$ {totalConsolidado.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
