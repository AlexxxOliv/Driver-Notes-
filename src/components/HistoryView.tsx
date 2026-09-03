import React, { useState } from 'react';
import {
  Clock,
  Share2,
  Edit2,
  Trash2,
  Gift,
  Car,
  Fuel,
  Receipt,
  FileText,
  FolderOpen,
} from 'lucide-react';
import { Jornada } from '../types';

interface HistoryViewProps {
  filtroMesAno: string;
  registros: Jornada[];
  onCompartilhar: (jornada: Jornada) => void;
  onEditar: (jornada: Jornada) => void;
  onDeletar: (id: string | number) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  filtroMesAno,
  registros,
  onCompartilhar,
  onEditar,
  onDeletar,
}) => {
  const [categoriaFiltro, setCategoriaFiltro] = useState<'Todos' | 'Uber' | 'Pop' | 'Particular'>('Todos');

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
  const tituloMes = `${mesesNomes[mesSel - 1]} / ${anoSel}`;

  // Filter journeys for selected month
  const registrosDoMes = registros.filter((item) => {
    if (!item.data) return false;
    const [anoItem, mesItem] = item.data.split('-');
    return parseInt(anoItem, 10) === anoSel && parseInt(mesItem, 10) === mesSel;
  });

  // Filter by app category
  let registrosFiltrados = registrosDoMes;
  if (categoriaFiltro === 'Uber') {
    registrosFiltrados = registrosDoMes.filter((r) => (r.uber || 0) > 0);
  } else if (categoriaFiltro === 'Pop') {
    registrosFiltrados = registrosDoMes.filter((r) => (r.pop || 0) > 0);
  } else if (categoriaFiltro === 'Particular') {
    registrosFiltrados = registrosDoMes.filter((r) => (r.particular || 0) > 0);
  }

  // Format HH:MM to readable text
  const formatarHora = (horaVal?: string | number) => {
    if (!horaVal && horaVal !== 0) return '0h 0m';
    if (typeof horaVal === 'string' && horaVal.includes(':')) {
      const [h, m] = horaVal.split(':');
      return `${parseInt(h, 10)}h ${parseInt(m, 10)}m`;
    }
    const num = parseFloat(String(horaVal)) || 0;
    const h = Math.floor(num);
    const m = Math.round((num - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div id="aba-historico" className="space-y-4 pb-4">
      {/* Month Header Banner */}
      <div className="bg-indigo-900 text-white p-4 rounded-2xl shadow-md flex items-center justify-between">
        <div>
          <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">
            Registros do Mês
          </span>
          <h2 id="titulo-historico-mes" className="text-lg font-black text-white">
            {tituloMes}
          </h2>
        </div>
        <div className="text-right">
          <span
            id="qtd-registros-historico"
            className="text-xs font-bold bg-indigo-800/80 px-3 py-1 rounded-full text-indigo-200 border border-indigo-700 inline-block"
          >
            {registrosDoMes.length} {registrosDoMes.length === 1 ? 'Jornada' : 'Jornadas'}
          </span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex space-x-1 bg-slate-200/70 p-1 rounded-2xl text-[11px] font-bold">
        {(['Todos', 'Uber', 'Pop', 'Particular'] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoriaFiltro(cat)}
            className={`flex-1 py-2 px-2 rounded-xl transition-all ${
              categoriaFiltro === cat
                ? 'bg-white shadow-sm text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat === 'Pop' ? 'Pop (99)' : cat}
          </button>
        ))}
      </div>

      {/* Journeys List */}
      <div className="space-y-3">
        {registrosFiltrados.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-slate-200/80">
            <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <span className="text-xs font-bold text-slate-400 block">
              Nenhum registro encontrado para este filtro
            </span>
          </div>
        ) : (
          registrosFiltrados.map((item) => {
            const [ano, mes, dia] = (item.data || '2026-01-01').split('-');
            const dataFormatada = `${dia}/${mes}/${ano}`;

            const ganhoBruto =
              (item.uber || 0) +
              (item.pop || 0) +
              (item.particular || 0) +
              (item.gorjeta || 0);

            const custoCombustivel =
              item.combustivelCalculado || item.combustivel || 0;

            let totalOutrasDespesas = 0;
            let listaDespesasTexto = '';
            if (item.outrasDespesas && Array.isArray(item.outrasDespesas)) {
              totalOutrasDespesas = item.outrasDespesas.reduce(
                (acc, d) => acc + (d.valor || 0),
                0
              );
              listaDespesasTexto = item.outrasDespesas
                .map((d) => `${d.tipo}: R$ ${d.valor.toFixed(2)}`)
                .join(', ');
            }

            const gastosTotal = custoCombustivel + totalOutrasDespesas;
            const lucroLiquido = ganhoBruto - gastosTotal;
            const mediaRk =
              item.km > 0 ? (ganhoBruto / item.km).toFixed(2) : '0.00';

            return (
              <div
                key={item.id}
                className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200/80 space-y-2.5 active:scale-[0.99] transition"
              >
                {/* Header of Card */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                      {dataFormatada}
                    </span>
                    {item.horasTrabalhadas && (
                      <span className="text-[10px] text-slate-500 font-bold flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-slate-400" />
                        {formatarHora(item.horasTrabalhadas)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => onCompartilhar(item)}
                      className="text-emerald-600 hover:text-emerald-700 active:scale-90 p-1.5 transition bg-emerald-50 rounded-lg"
                      title="Compartilhar Card"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditar(item)}
                      className="text-slate-400 hover:text-indigo-600 active:scale-90 p-1.5 transition"
                      title="Editar Jornada"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeletar(item.id)}
                      className="text-slate-300 hover:text-rose-500 active:scale-90 p-1.5 transition"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* App Tags */}
                <div className="flex items-center justify-between text-xs py-0.5">
                  <div className="flex flex-wrap gap-1">
                    {item.uber > 0 && (
                      <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                        Uber R$ {item.uber.toFixed(2)}
                      </span>
                    )}
                    {item.pop > 0 && (
                      <span className="bg-amber-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                        Pop R$ {item.pop.toFixed(2)}
                      </span>
                    )}
                    {item.particular > 0 && (
                      <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                        Part. R$ {item.particular.toFixed(2)}
                      </span>
                    )}
                    {item.gorjeta > 0 && (
                      <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
                        <Gift className="w-2.5 h-2.5" />
                        R$ {item.gorjeta.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Grid with 4 metrics: Bruto, Gastos, Lucro, Média KM */}
                <div className="grid grid-cols-4 gap-1.5 text-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">
                      Bruto
                    </span>
                    <span className="text-xs font-black text-slate-800">
                      R$ {ganhoBruto.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">
                      Gastos
                    </span>
                    <span className="text-xs font-black text-rose-500">
                      R$ {gastosTotal.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">
                      Lucro
                    </span>
                    <span
                      className={`text-xs font-black ${
                        lucroLiquido >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      R$ {lucroLiquido.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">
                      Média KM
                    </span>
                    <span className="text-xs font-black text-indigo-600">
                      R$ {mediaRk}/km
                    </span>
                  </div>
                </div>

                {/* KM & Expenses breakdown */}
                <div className="text-[11px] text-slate-500 space-y-0.5 pt-0.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="flex items-center">
                      <Car className="w-3 h-3 text-slate-400 mr-1" />
                      {item.km} km rodados
                    </span>
                    <span className="text-rose-600 font-semibold flex items-center">
                      <Fuel className="w-3 h-3 mr-1" />
                      Combustível: R$ {custoCombustivel.toFixed(2)}
                    </span>
                  </div>

                  {listaDespesasTexto && (
                    <div className="text-[10px] text-rose-500 font-medium flex items-center">
                      <Receipt className="w-3 h-3 mr-1 shrink-0" />
                      <span>
                        Outros: R$ {totalOutrasDespesas.toFixed(2)}{' '}
                        <span className="text-slate-400">({listaDespesasTexto})</span>
                      </span>
                    </div>
                  )}

                  {item.obs && (
                    <div className="text-slate-500 italic text-[10px] mt-1 bg-amber-50/70 p-1.5 rounded-lg border border-amber-100/80 flex items-start">
                      <FileText className="w-3 h-3 text-amber-500 mr-1 shrink-0 mt-0.5" />
                      <span>{item.obs}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
