import React, { useState } from 'react';
import { Jornada } from '../types';

interface DailyBarChartProps {
  ano: number;
  mes: number;
  registros: Jornada[];
}

export const DailyBarChart: React.FC<DailyBarChartProps> = ({ ano, mes, registros }) => {
  const [activeDay, setActiveDay] = useState<{
    dia: number;
    ganho: number;
    despesa: number;
    lucro: number;
  } | null>(null);

  const totalDiasNoMes = new Date(ano, mes, 0).getDate();
  const dias = Array.from({ length: totalDiasNoMes }, (_, i) => i + 1);

  // Map earnings and expenses per day
  const dailyData = dias.map((dia) => {
    const diaStr = String(dia).padStart(2, '0');
    const mesStr = String(mes).padStart(2, '0');
    const dataTarget = `${ano}-${mesStr}-${diaStr}`;

    let ganho = 0;
    let despesa = 0;

    registros.forEach((reg) => {
      if (reg.data === dataTarget) {
        const bruto =
          (reg.uber || 0) +
          (reg.pop || 0) +
          (reg.particular || 0) +
          (reg.gorjeta || 0);

        const combustivel = reg.combustivelCalculado || reg.combustivel || 0;
        let extras = 0;
        if (reg.outrasDespesas && Array.isArray(reg.outrasDespesas)) {
          extras = reg.outrasDespesas.reduce((acc, d) => acc + (d.valor || 0), 0);
        }

        ganho += bruto;
        despesa += combustivel + extras;
      }
    });

    return {
      dia,
      ganho,
      despesa,
      lucro: ganho - despesa,
    };
  });

  const maxVal = Math.max(
    100,
    ...dailyData.map((d) => Math.max(d.ganho, d.despesa))
  );

  return (
    <div className="space-y-3">
      {/* Legend & Tooltip Status */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-blue-500 inline-block" />
            <span className="text-[11px] font-bold text-slate-600">Ganhos</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block" />
            <span className="text-[11px] font-bold text-slate-600">Despesas</span>
          </div>
        </div>

        {activeDay ? (
          <div className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
            Dia {String(activeDay.dia).padStart(2, '0')}: +R${' '}
            {activeDay.ganho.toFixed(0)} / -R$ {activeDay.despesa.toFixed(0)}
          </div>
        ) : (
          <span className="text-[10px] text-slate-400">Toque na barra para ver</span>
        )}
      </div>

      {/* Horizontal Scroll Area */}
      <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
        <div className="h-44 min-w-[620px] flex items-end gap-2 px-2 pt-6 pb-4 border-b border-slate-100 relative">
          {/* Subtle grid lines */}
          <div className="absolute inset-x-0 top-6 border-b border-slate-100/60 pointer-events-none" />
          <div className="absolute inset-x-0 top-20 border-b border-slate-100/60 pointer-events-none" />
          <div className="absolute inset-x-0 top-32 border-b border-slate-100/60 pointer-events-none" />

          {dailyData.map((item) => {
            const ganhoHeight = (item.ganho / maxVal) * 110;
            const despesaHeight = (item.despesa / maxVal) * 110;
            const hasData = item.ganho > 0 || item.despesa > 0;

            return (
              <div
                key={item.dia}
                onClick={() => setActiveDay(item)}
                className={`flex-1 flex flex-col items-center justify-end h-full group cursor-pointer transition-all ${
                  hasData ? 'opacity-100' : 'opacity-40 hover:opacity-75'
                }`}
              >
                {/* Bar pair container */}
                <div className="flex items-end justify-center gap-0.5 w-full h-[120px]">
                  {/* Ganho Bar */}
                  <div
                    style={{ height: `${Math.max(item.ganho > 0 ? 4 : 0, ganhoHeight)}px` }}
                    className="w-2.5 bg-blue-500 rounded-t-xs hover:bg-blue-600 transition-all group-hover:scale-y-105 origin-bottom"
                    title={`Dia ${item.dia} - Ganho: R$ ${item.ganho.toFixed(2)}`}
                  />

                  {/* Despesa Bar */}
                  <div
                    style={{
                      height: `${Math.max(item.despesa > 0 ? 4 : 0, despesaHeight)}px`,
                    }}
                    className="w-2.5 bg-rose-500 rounded-t-xs hover:bg-rose-600 transition-all group-hover:scale-y-105 origin-bottom"
                    title={`Dia ${item.dia} - Despesa: R$ ${item.despesa.toFixed(2)}`}
                  />
                </div>

                {/* Day label */}
                <span
                  className={`text-[9px] font-bold mt-1.5 ${
                    hasData
                      ? 'text-indigo-700 font-extrabold'
                      : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                >
                  {String(item.dia).padStart(2, '0')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
