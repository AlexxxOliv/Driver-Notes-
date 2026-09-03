import React from 'react';
import {
  CalendarDays,
  Wallet,
  ChevronRight,
  PieChart,
  Target,
  CloudDownload,
  CloudUpload,
} from 'lucide-react';
import { DailyBarChart } from './DailyBarChart';
import { Jornada, Objetivo } from '../types';

interface DashboardViewProps {
  filtroMesAno: string; // "YYYY-MM"
  onMesAnoChange: (novo: string) => void;
  registros: Jornada[];
  objetivos: Objetivo[];
  onOpenGastosModal: () => void;
  onOpenObjetivosModal: () => void;
  onExportBackup: () => void;
  onOpenImportModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  filtroMesAno,
  onMesAnoChange,
  registros,
  objetivos,
  onOpenGastosModal,
  onOpenObjetivosModal,
  onExportBackup,
  onOpenImportModal,
}) => {
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
  const nomeMesAtual = `${mesesNomes[mesSel - 1]} / ${anoSel}`;
  const dataHojeStr = new Date().toLocaleDateString('pt-BR');

  // Calculate stats for selected month
  let totalGanhoBrutoMes = 0;
  let totalGastosMes = 0;
  let totalLucroMes = 0;
  let totalKmMes = 0;
  let totalLucroAnual = 0;

  const registrosDoMes = registros.filter((item) => {
    if (!item.data) return false;
    const [anoItem, mesItem] = item.data.split('-');
    return parseInt(anoItem, 10) === anoSel && parseInt(mesItem, 10) === mesSel;
  });

  // Calculate annual accumulated profit
  registros.forEach((item) => {
    if (!item.data) return;
    const [anoItem] = item.data.split('-');
    if (parseInt(anoItem, 10) === anoSel) {
      const bruto =
        (item.uber || 0) +
        (item.pop || 0) +
        (item.particular || 0) +
        (item.gorjeta || 0);
      const comb = item.combustivelCalculado || item.combustivel || 0;
      let extras = 0;
      if (item.outrasDespesas && Array.isArray(item.outrasDespesas)) {
        extras = item.outrasDespesas.reduce((acc, d) => acc + (d.valor || 0), 0);
      }
      totalLucroAnual += bruto - (comb + extras);
    }
  });

  registrosDoMes.forEach((item) => {
    const bruto =
      (item.uber || 0) +
      (item.pop || 0) +
      (item.particular || 0) +
      (item.gorjeta || 0);
    const comb = item.combustivelCalculado || item.combustivel || 0;
    let extras = 0;
    if (item.outrasDespesas && Array.isArray(item.outrasDespesas)) {
      extras = item.outrasDespesas.reduce((acc, d) => acc + (d.valor || 0), 0);
    }
    const despesasTotal = comb + extras;
    const lucro = bruto - despesasTotal;

    totalGanhoBrutoMes += bruto;
    totalGastosMes += despesasTotal;
    totalLucroMes += lucro;
    totalKmMes += item.km || 0;
  });

  const mediaRkMes =
    totalKmMes > 0 ? (totalGanhoBrutoMes / totalKmMes).toFixed(2) : '0.00';

  // Calculate Objectives progress
  let valorTotalMetas = 0;
  let valorTotalAcumulado = 0;
  let saldoRestante = Math.max(0, totalLucroMes);

  const objetivosOrdenados = [...objetivos].sort((a, b) => a.valor - b.valor);
  objetivosOrdenados.forEach((obj) => {
    valorTotalMetas += obj.valor;
    const pago = Math.min(saldoRestante, obj.valor);
    valorTotalAcumulado += pago;
    saldoRestante = Math.max(0, saldoRestante - pago);
  });

  const porcentagemGeral =
    valorTotalMetas > 0 ? Math.min(100, (valorTotalAcumulado / valorTotalMetas) * 100) : 0;

  return (
    <div id="aba-painel" className="space-y-4 pb-4">
      {/* Month & Year Selector with Date Badge */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200/80 flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <CalendarDays className="w-3.5 h-3.5" />
          </div>
          <span>Mês de Análise:</span>
        </label>
        <div className="flex items-center space-x-2">
          <span
            id="hoje-data"
            className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-bold border border-slate-200 shrink-0"
          >
            Hoje: {dataHojeStr}
          </span>
          <input
            type="month"
            id="seletor-mes-filtro"
            value={filtroMesAno}
            onChange={(e) => onMesAnoChange(e.target.value)}
            className="border border-slate-300 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition bg-white"
          />
        </div>
      </div>

      {/* 4 Main Summary Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Card 1: Lucro do Mês */}
        <div
          id="card-lucro-mes"
          className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-3.5 rounded-2xl shadow-md flex flex-col justify-between relative overflow-hidden active:scale-[0.98] transition"
        >
          <div className="absolute -right-2 -bottom-2 opacity-10 text-white pointer-events-none">
            <Wallet className="w-20 h-20" />
          </div>
          <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">
            Lucro do Mês
          </span>
          <span
            id="total-lucro-mes"
            className="text-xl font-black text-emerald-400 mt-1 tracking-tight"
          >
            R$ {totalLucroMes.toFixed(2)}
          </span>
          <span
            id="nome-mes-atual"
            className="text-[9px] text-indigo-200 truncate font-medium mt-0.5"
          >
            {nomeMesAtual}
          </span>
        </div>

        {/* Card 2: Gastos Totais do Mês (Clickable) */}
        <div
          id="card-gastos-mes"
          onClick={onOpenGastosModal}
          className="bg-gradient-to-br from-rose-50 to-red-50 text-rose-950 p-3.5 rounded-2xl shadow-sm border border-rose-200/80 flex flex-col justify-between cursor-pointer active:scale-[0.98] transition group"
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider">
              Gastos do Mês
            </span>
            <ChevronRight className="w-3 h-3 text-rose-400 group-hover:translate-x-0.5 transition" />
          </div>
          <span
            id="total-gastos-mes"
            className="text-xl font-black text-rose-600 mt-1 tracking-tight"
          >
            R$ {totalGastosMes.toFixed(2)}
          </span>
          <span className="text-[9px] text-rose-600 font-bold flex items-center gap-1 mt-0.5">
            <PieChart className="w-3 h-3" /> Ver Detalhes
          </span>
        </div>

        {/* Card 3: Ganho Bruto & Acumulado Anual */}
        <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Ganho Bruto Mensal
          </span>
          <span
            id="ganho-bruto-mes"
            className="text-lg font-black text-emerald-600 mt-1 tracking-tight"
          >
            R$ {totalGanhoBrutoMes.toFixed(2)}
          </span>
          <span
            id="lucro-acumulado-anual"
            className="text-[9px] text-slate-400 font-medium truncate mt-0.5"
          >
            Acum. {anoSel}: R$ {totalLucroAnual.toFixed(2)}
          </span>
        </div>

        {/* Card 4: Quilometragem & Média R$/KM */}
        <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Quilometragem
          </span>
          <span
            id="total-km"
            className="text-lg font-black text-indigo-600 mt-1 tracking-tight"
          >
            {totalKmMes.toFixed(1)} km
          </span>
          <span
            id="media-rk-mes"
            className="text-[9px] text-emerald-600 font-bold mt-0.5"
          >
            Média: R$ {mediaRkMes}/km
          </span>
        </div>
      </div>

      {/* Card de Objetivos / Metas do Mês */}
      <div
        id="card-objetivos-mes"
        onClick={onOpenObjetivosModal}
        className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-3.5 rounded-2xl shadow-sm border border-amber-400 flex flex-col justify-between cursor-pointer active:scale-[0.98] transition relative overflow-hidden"
      >
        <div className="flex justify-between items-center mb-1.5">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
              <Target className="w-3.5 h-3.5 text-amber-100" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">
              Objetivos do Mês
            </span>
          </div>
          <span
            id="porcentagem-objetivos-geral"
            className="text-xs font-black bg-white/20 px-2 py-0.5 rounded-full"
          >
            {porcentagemGeral.toFixed(0)}%
          </span>
        </div>

        <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden p-0.5 border border-white/20 mb-2">
          <div
            id="barra-progresso-objetivos-geral"
            className="bg-gradient-to-r from-emerald-300 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${porcentagemGeral}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[10px] text-amber-100 font-medium">
          <span id="texto-progresso-objetivos">
            {valorTotalMetas > 0
              ? `R$ ${valorTotalAcumulado.toFixed(2)} de R$ ${valorTotalMetas.toFixed(2)}`
              : 'Nenhum objetivo cadastrado'}
          </span>
          <span className="font-bold underline flex items-center gap-1">
            Gerenciar <ChevronRight className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>

      {/* Daily Bar Chart */}
      <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200/80 space-y-3">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Ganhos vs Despesas Diárias
          </h3>
          <span
            id="label-grafico-mes"
            className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-bold"
          >
            {nomeMesAtual}
          </span>
        </div>

        <DailyBarChart ano={anoSel} mes={mesSel} registros={registrosDoMes} />
      </div>

      {/* Backup Buttons */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200/80 flex items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={onExportBackup}
          id="btn-salvar-backup"
          className="flex-1 bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-700 border border-emerald-200/80 font-bold py-2.5 px-2 rounded-xl text-xs transition flex items-center justify-center space-x-1.5"
        >
          <CloudDownload className="w-4 h-4" />
          <span>Salvar Backup</span>
        </button>
        <button
          type="button"
          onClick={onOpenImportModal}
          id="btn-restaurar-backup"
          className="flex-1 bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-700 border border-blue-200/80 font-bold py-2.5 px-2 rounded-xl text-xs transition flex items-center justify-center space-x-1.5"
        >
          <CloudUpload className="w-4 h-4" />
          <span>Restaurar Backup</span>
        </button>
      </div>
    </div>
  );
};
