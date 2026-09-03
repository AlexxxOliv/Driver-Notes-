import React, { useState } from 'react';
import { X, Target, Plus, Check, Edit2, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Objetivo } from '../types';

interface ModalObjetivosProps {
  isOpen: boolean;
  onClose: () => void;
  objetivos: Objetivo[];
  lucroMes: number;
  onSaveObjetivo: (obj: Objetivo) => void;
  onDeleteObjetivo: (id: number) => void;
}

export const ModalObjetivos: React.FC<ModalObjetivosProps> = ({
  isOpen,
  onClose,
  objetivos,
  lucroMes,
  onSaveObjetivo,
  onDeleteObjetivo,
}) => {
  if (!isOpen) return null;

  const [idEdicao, setIdEdicao] = useState<number | null>(null);
  const [titulo, setTitulo] = useState('');
  const [valor, setValor] = useState('');

  // Calculate progress for each goal based on available month profit
  let saldoRestante = Math.max(0, lucroMes);
  const copia = [...objetivos].sort((a, b) => a.valor - b.valor);

  const objetivosProcessados = copia.map((obj) => {
    let pago = 0;
    if (saldoRestante >= obj.valor) {
      pago = obj.valor;
      saldoRestante -= obj.valor;
    } else {
      pago = saldoRestante;
      saldoRestante = 0;
    }
    const porcentagem = obj.valor > 0 ? (pago / obj.valor) * 100 : 0;
    return {
      ...obj,
      pago,
      porcentagem: Math.min(100, porcentagem),
      concluido: pago >= obj.valor && obj.valor > 0,
    };
  });

  const handleStartEdit = (obj: Objetivo) => {
    setIdEdicao(obj.id);
    setTitulo(obj.titulo);
    setValor(String(obj.valor));
  };

  const handleResetForm = () => {
    setIdEdicao(null);
    setTitulo('');
    setValor('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valNum = parseFloat(valor);
    if (!titulo.trim() || isNaN(valNum) || valNum <= 0) return;

    onSaveObjetivo({
      id: idEdicao || Date.now(),
      titulo: titulo.trim(),
      valor: valNum,
    });

    handleResetForm();

    // Trigger subtle confetti celebration
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <div
      id="modal-objetivos"
      className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-start justify-center p-3 pt-6 z-50 overflow-y-auto"
    >
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-5 py-3.5 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <h3 className="font-bold text-sm">Metas e Objetivos</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-90 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Add/Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-amber-50/60 p-4 border-b border-amber-100 space-y-3 shrink-0"
        >
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
            {idEdicao ? 'Editar Objetivo' : 'Novo Objetivo'}
          </span>

          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-7">
              <input
                type="text"
                placeholder="Ex: IPVA, Pneu, Reserva..."
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              />
            </div>
            <div className="col-span-5 relative">
              <span className="absolute left-2.5 top-2.5 text-xs text-slate-400 font-bold">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                min="1"
                placeholder="300.00"
                required
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 pl-8 text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{idEdicao ? 'Atualizar Objetivo' : 'Adicionar Objetivo'}</span>
            </button>
            {idEdicao && (
              <button
                type="button"
                onClick={handleResetForm}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2.5 px-3 rounded-xl text-xs transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* List of Goals */}
        <div className="p-4 overflow-y-auto space-y-3">
          {objetivosProcessados.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Nenhum objetivo cadastrado no momento.
            </div>
          ) : (
            objetivosProcessados.map((obj) => (
              <div
                key={obj.id}
                className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-800">
                      {obj.titulo}
                    </span>
                    {obj.concluido && (
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" />
                        Concluído
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(obj)}
                      className="text-slate-400 hover:text-amber-600 active:scale-90 p-1 transition"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteObjetivo(obj.id)}
                      className="text-slate-300 hover:text-rose-500 active:scale-90 p-1 transition"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${obj.porcentagem}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold pt-0.5">
                  <span>
                    Atingido:{' '}
                    <strong className="text-emerald-600 font-bold">
                      R$ {obj.pago.toFixed(2)}
                    </strong>
                  </span>
                  <span>
                    Meta:{' '}
                    <strong className="text-slate-800 font-bold">
                      R$ {obj.valor.toFixed(2)}
                    </strong>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
