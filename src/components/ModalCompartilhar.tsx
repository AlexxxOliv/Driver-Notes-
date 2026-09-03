import React, { useRef } from 'react';
import { X, Download, Share2, Car } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Jornada } from '../types';

interface ModalCompartilharProps {
  isOpen: boolean;
  onClose: () => void;
  jornada: Jornada | null;
}

export const ModalCompartilhar: React.FC<ModalCompartilharProps> = ({
  isOpen,
  onClose,
  jornada,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !jornada) return null;

  const [ano, mes, dia] = (jornada.data || '2026-01-01').split('-');
  const dataFormatada = `${dia}/${mes}/${ano}`;

  const ganhoBruto =
    (jornada.uber || 0) +
    (jornada.pop || 0) +
    (jornada.particular || 0) +
    (jornada.gorjeta || 0);

  const custoCombustivel =
    jornada.combustivelCalculado || jornada.combustivel || 0;

  let totalOutrasDespesas = 0;
  if (jornada.outrasDespesas && Array.isArray(jornada.outrasDespesas)) {
    totalOutrasDespesas = jornada.outrasDespesas.reduce(
      (acc, d) => acc + (d.valor || 0),
      0
    );
  }

  const gastosTotal = custoCombustivel + totalOutrasDespesas;
  const lucroLiquido = ganhoBruto - gastosTotal;
  const mediaRk =
    jornada.km > 0 ? (ganhoBruto / jornada.km).toFixed(2) : '0.00';

  const formatarHora = (horaVal?: string) => {
    if (!horaVal) return '0h 0m';
    if (horaVal.includes(':')) {
      const [h, m] = horaVal.split(':');
      return `${parseInt(h, 10)}h ${parseInt(m, 10)}m`;
    }
    return `${horaVal}h`;
  };

  const handleBaixarFoto = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `jornada_driver_notes_${jornada.data}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Erro ao gerar foto:', err);
      alert('Não foi possível gerar a imagem.');
    }
  };

  const handleCompartilharNativo = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          handleBaixarFoto();
          return;
        }

        const file = new File(
          [blob],
          `driver_notes_${jornada.data}.png`,
          { type: 'image/png' }
        );

        if (
          navigator.share &&
          navigator.canShare &&
          navigator.canShare({ files: [file] })
        ) {
          try {
            await navigator.share({
              files: [file],
              title: 'Resumo da Jornada - DRIVER NOTES',
              text: `Confira meus resultados do dia ${dataFormatada}! Lucro: R$ ${lucroLiquido.toFixed(2)}`,
            });
          } catch (err) {
            console.log('Compartilhamento cancelado pelo usuário');
          }
        } else {
          // Fallback
          handleBaixarFoto();
          alert(
            'Seu navegador não suporta compartilhamento direto de arquivo. A foto foi baixada para você enviar no WhatsApp ou Instagram!'
          );
        }
      }, 'image/png');
    } catch (err) {
      console.error(err);
      handleBaixarFoto();
    }
  };

  return (
    <div
      id="modal-compartilhar"
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 z-50 overflow-y-auto"
    >
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Share2 className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-xs">Compartilhar Jornada</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card capture target */}
        <div className="p-4 bg-slate-100 overflow-y-auto">
          <div
            ref={cardRef}
            id="card-para-imagem"
            className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl shadow-xl space-y-4 border border-indigo-500/30"
          >
            {/* Header of Card */}
            <div className="flex justify-between items-center border-b border-indigo-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">
                    RESUMO DA JORNADA
                  </h4>
                  <span className="text-[10px] text-indigo-300 font-semibold">
                    {dataFormatada}
                  </span>
                </div>
              </div>
              <span className="text-[9px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full font-bold border border-indigo-400/20">
                DRIVER NOTES
              </span>
            </div>

            {/* Lucro Líquido Em Destaque */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-center">
              <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider block">
                Lucro Líquido do Dia
              </span>
              <span className="text-2xl font-black text-emerald-400 tracking-tight block mt-0.5">
                R$ {lucroLiquido.toFixed(2)}
              </span>
            </div>

            {/* Grid de Estatísticas Rápidas */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                <span className="text-[9px] text-slate-400 font-bold block uppercase">
                  Bruto
                </span>
                <span className="text-xs font-black text-white">
                  R$ {ganhoBruto.toFixed(2)}
                </span>
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                <span className="text-[9px] text-slate-400 font-bold block uppercase">
                  Horas
                </span>
                <span className="text-xs font-black text-indigo-300">
                  {formatarHora(jornada.horasTrabalhadas)}
                </span>
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                <span className="text-[9px] text-slate-400 font-bold block uppercase">
                  Rodados
                </span>
                <span className="text-xs font-black text-indigo-300">
                  {jornada.km} km
                </span>
              </div>
            </div>

            {/* Detalhes por App e Média */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-[11px] bg-white/5 px-2.5 py-1.5 rounded-lg">
                <span className="text-slate-300 font-semibold">Média por KM:</span>
                <span className="font-black text-emerald-400">R$ {mediaRk}/km</span>
              </div>

              <div className="space-y-1 pt-1">
                {jornada.uber > 0 && (
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-white inline-block" />
                      Uber:
                    </span>
                    <span className="font-bold text-white">
                      R$ {jornada.uber.toFixed(2)}
                    </span>
                  </div>
                )}
                {jornada.pop > 0 && (
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                      99 (Pop):
                    </span>
                    <span className="font-bold text-white">
                      R$ {jornada.pop.toFixed(2)}
                    </span>
                  </div>
                )}
                {jornada.particular > 0 && (
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                      Particular:
                    </span>
                    <span className="font-bold text-white">
                      R$ {jornada.particular.toFixed(2)}
                    </span>
                  </div>
                )}
                {jornada.gorjeta > 0 && (
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                      Gorjeta:
                    </span>
                    <span className="font-bold text-emerald-400">
                      R$ {jornada.gorjeta.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Despesas / Gastos */}
            <div className="border-t border-indigo-500/20 pt-2 flex justify-between items-center text-[10px] text-slate-300">
              <span>Gastos Totais (Gasolina / Outros):</span>
              <span className="font-bold text-rose-400">
                R$ {gastosTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <button
            type="button"
            onClick={handleBaixarFoto}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar Foto</span>
          </button>
          <button
            type="button"
            onClick={handleCompartilharNativo}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Enviar Foto</span>
          </button>
        </div>
      </div>
    </div>
  );
};
