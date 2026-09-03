import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Fuel, DollarSign, Calendar, Clock, Car } from 'lucide-react';
import { Jornada, DespesaExtra } from '../types';

interface ModalJornadaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (jornada: Jornada) => void;
  jornadaParaEditar?: Jornada | null;
}

const STORAGE_PRECO_LITRO = 'diario_preco_litro';
const STORAGE_MEDIA_KML = 'diario_media_kml';

export const ModalJornada: React.FC<ModalJornadaProps> = ({
  isOpen,
  onClose,
  onSave,
  jornadaParaEditar,
}) => {
  if (!isOpen) return null;

  const [data, setData] = useState<string>(() => {
    return jornadaParaEditar ? jornadaParaEditar.data : new Date().toISOString().split('T')[0];
  });
  const [horasTrabalhadas, setHorasTrabalhadas] = useState<string>(
    jornadaParaEditar ? jornadaParaEditar.horasTrabalhadas : '08:00'
  );
  const [km, setKm] = useState<string>(
    jornadaParaEditar ? String(jornadaParaEditar.km || '') : ''
  );

  // Fuel calculation
  const [precoLitro, setPrecoLitro] = useState<string>(() => {
    if (jornadaParaEditar && jornadaParaEditar.precoLitro) {
      return String(jornadaParaEditar.precoLitro);
    }
    return localStorage.getItem(STORAGE_PRECO_LITRO) || '5.89';
  });

  const [mediaKml, setMediaKml] = useState<string>(() => {
    if (jornadaParaEditar && jornadaParaEditar.mediaKml) {
      return String(jornadaParaEditar.mediaKml);
    }
    return localStorage.getItem(STORAGE_MEDIA_KML) || '11.0';
  });

  // Gross earnings
  const [uber, setUber] = useState<string>(
    jornadaParaEditar ? String(jornadaParaEditar.uber || '') : ''
  );
  const [pop, setPop] = useState<string>(
    jornadaParaEditar ? String(jornadaParaEditar.pop || '') : ''
  );
  const [particular, setParticular] = useState<string>(
    jornadaParaEditar ? String(jornadaParaEditar.particular || '') : ''
  );
  const [gorjeta, setGorjeta] = useState<string>(
    jornadaParaEditar ? String(jornadaParaEditar.gorjeta || '') : ''
  );

  // Extra expenses
  const [outrasDespesas, setOutrasDespesas] = useState<DespesaExtra[]>(() => {
    if (jornadaParaEditar && jornadaParaEditar.outrasDespesas?.length) {
      return [...jornadaParaEditar.outrasDespesas];
    }
    return [{ tipo: 'Lanche', valor: 0 }];
  });

  const [obs, setObs] = useState<string>(jornadaParaEditar?.obs || '');

  // Calculate dynamic fuel cost
  const kmNum = parseFloat(km) || 0;
  const precoNum = parseFloat(precoLitro) || 0;
  const kmlNum = parseFloat(mediaKml) || 0;

  let combustivelCalc = 0;
  if (kmNum > 0 && precoNum > 0 && kmlNum > 0) {
    combustivelCalc = (kmNum / kmlNum) * precoNum;
  }

  const handleAddDespesa = () => {
    setOutrasDespesas([...outrasDespesas, { tipo: 'Lanche', valor: 0 }]);
  };

  const handleUpdateDespesa = (index: number, campo: 'tipo' | 'valor', valor: any) => {
    const copia = [...outrasDespesas];
    if (campo === 'tipo') {
      copia[index].tipo = valor;
    } else {
      copia[index].valor = parseFloat(valor) || 0;
    }
    setOutrasDespesas(copia);
  };

  const handleRemoveDespesa = (index: number) => {
    setOutrasDespesas(outrasDespesas.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Persist fuel defaults for future quick entry
    if (precoLitro) localStorage.setItem(STORAGE_PRECO_LITRO, precoLitro);
    if (mediaKml) localStorage.setItem(STORAGE_MEDIA_KML, mediaKml);

    const filtradasDespesas = outrasDespesas.filter((d) => d.valor > 0);

    const novaJornada: Jornada = {
      id: jornadaParaEditar ? jornadaParaEditar.id : Date.now(),
      data: data || new Date().toISOString().split('T')[0],
      horasTrabalhadas: horasTrabalhadas || '00:00',
      km: kmNum,
      precoLitro: precoNum,
      mediaKml: kmlNum,
      combustivelCalculado: combustivelCalc,
      uber: parseFloat(uber) || 0,
      pop: parseFloat(pop) || 0,
      particular: parseFloat(particular) || 0,
      gorjeta: parseFloat(gorjeta) || 0,
      outrasDespesas: filtradasDespesas,
      obs: obs.trim() || undefined,
    };

    onSave(novaJornada);
    onClose();
  };

  return (
    <div
      id="modal-registro"
      className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-start justify-center p-3 pt-6 z-50 overflow-y-auto"
    >
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-800 text-white px-5 py-3.5 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-sm" id="titulo-modal">
            {jornadaParaEditar ? 'Editar Jornada' : 'Novo Registro de Jornada'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-90 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4">
          {/* 1. Dados da Jornada */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2.5">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> 1. Dados da Jornada
            </span>

            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Data de Trabalho
                </label>
                <input
                  type="date"
                  required
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Horas Trabalhadas (HH:MM)
                  </label>
                  <input
                    type="time"
                    required
                    value={horasTrabalhadas}
                    onChange={(e) => setHorasTrabalhadas(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Total KM Rodados
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Ex: 150"
                      required
                      value={km}
                      onChange={(e) => setKm(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-9 bg-white"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">
                      km
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Ganhos Brutos */}
          <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200/80 space-y-2.5">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" /> 2. Ganhos Brutos (R$)
            </span>

            <div className="space-y-2">
              {/* Uber */}
              <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200">
                <label className="text-xs font-bold text-slate-800 flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-black inline-block" />
                  <span>Uber</span>
                </label>
                <div className="relative w-28">
                  <span className="absolute left-2.5 top-1.5 text-xs text-slate-400">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={uber}
                    onChange={(e) => setUber(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg py-1 pl-7 pr-2 text-xs font-bold text-right text-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Pop (99) */}
              <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200">
                <label className="text-xs font-bold text-slate-800 flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                  <span>Pop (99)</span>
                </label>
                <div className="relative w-28">
                  <span className="absolute left-2.5 top-1.5 text-xs text-slate-400">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={pop}
                    onChange={(e) => setPop(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg py-1 pl-7 pr-2 text-xs font-bold text-right text-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Particular */}
              <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200">
                <label className="text-xs font-bold text-slate-800 flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" />
                  <span>Particular</span>
                </label>
                <div className="relative w-28">
                  <span className="absolute left-2.5 top-1.5 text-xs text-slate-400">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={particular}
                    onChange={(e) => setParticular(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg py-1 pl-7 pr-2 text-xs font-bold text-right text-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Gorjetas */}
              <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-emerald-300">
                <label className="text-xs font-bold text-emerald-800 flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  <span>Gorjetas</span>
                </label>
                <div className="relative w-28">
                  <span className="absolute left-2.5 top-1.5 text-xs text-slate-400">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={gorjeta}
                    onChange={(e) => setGorjeta(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg py-1 pl-7 pr-2 text-xs font-bold text-right text-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Despesas do Dia (R$) */}
          <div className="bg-rose-50/60 p-3.5 rounded-2xl border border-rose-200/80 space-y-3">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5" /> 3. Despesas do Dia (R$)
            </span>

            {/* Combustível Calculado */}
            <div className="bg-white p-3 rounded-xl border border-rose-200 space-y-2">
              <span className="text-[11px] font-bold text-rose-800 flex items-center">
                <Fuel className="w-3 h-3 mr-1.5 text-rose-600" /> Cálculo do Combustível
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                    Preço Litro (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ex: 5.89"
                    value={precoLitro}
                    onChange={(e) => setPrecoLitro(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                    Média Carro (KM/L)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Ex: 11.0"
                    value={mediaKml}
                    onChange={(e) => setMediaKml(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-500">
                  Custo Est. Combustível:
                </span>
                <span className="text-xs font-black text-rose-600">
                  R$ {combustivelCalc.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Lista Dinâmica de Outras Despesas */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-700">Outras Despesas</span>
                <button
                  type="button"
                  onClick={handleAddDespesa}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 active:scale-95 transition flex items-center space-x-1 bg-white px-2 py-1 rounded-lg border border-indigo-200 shadow-sm"
                >
                  <Plus className="w-3 h-3" />
                  <span>Adicionar</span>
                </button>
              </div>

              <div className="space-y-2">
                {outrasDespesas.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm"
                  >
                    <select
                      value={item.tipo}
                      onChange={(e) => handleUpdateDespesa(idx, 'tipo', e.target.value)}
                      className="w-1/2 border border-slate-300 rounded-lg p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="Lanche">Lanche / Alimentação</option>
                      <option value="Pneu">Pneu / Borracharia</option>
                      <option value="Manutenção">Manutenção / Mecânico</option>
                      <option value="Troca de Óleo">Troca de Óleo</option>
                      <option value="Lava-Jato">Lava-Jato</option>
                      <option value="Pedágio">Pedágio</option>
                      <option value="Outros">Outras Despesas</option>
                    </select>

                    <div className="relative w-2/5">
                      <span className="absolute left-2 top-1.5 text-xs text-slate-400">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={item.valor || ''}
                        onChange={(e) => handleUpdateDespesa(idx, 'valor', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg py-1 pl-6 pr-1.5 text-xs font-bold text-right text-rose-600 focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveDespesa(idx)}
                      className="text-slate-300 hover:text-rose-500 active:scale-90 p-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Anotações / Observações
            </label>
            <input
              type="text"
              placeholder="Ex: Chuva forte na zona sul, trânsito no centro..."
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-200 mt-2 transition"
          >
            {jornadaParaEditar ? 'Atualizar Registro' : 'Salvar Registro Completo'}
          </button>
        </form>
      </div>
    </div>
  );
};
