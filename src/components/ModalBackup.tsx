import React, { useState, useRef } from 'react';
import { X, CloudDownload, CloudUpload, FolderOpen, Check, FileJson } from 'lucide-react';
import { Jornada, Objetivo, BackupData } from '../types';

interface ModalBackupProps {
  isOpen: boolean;
  onClose: () => void;
  registros: Jornada[];
  objetivos: Objetivo[];
  onImportSuccess: (importedRegistros: Jornada[], importedObjetivos: Objetivo[]) => void;
}

export const ModalBackup: React.FC<ModalBackupProps> = ({
  isOpen,
  onClose,
  registros,
  objetivos,
  onImportSuccess,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDownloadBackup = () => {
    const backup: BackupData = {
      versao: 1.0,
      dataExportacao: new Date().toISOString(),
      registros,
      objetivos,
    };

    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const hoje = new Date().toISOString().split('T')[0];
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_driver_notes_${hoje}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setStatusMsg({
      type: 'success',
      text: 'Arquivo de backup baixado com sucesso no seu dispositivo!',
    });
  };

  const processAndApply = (dadosImportados: any) => {
    const listaEntrada = dadosImportados.registros || dadosImportados.jornadas;

    if (!listaEntrada || !Array.isArray(listaEntrada)) {
      setStatusMsg({
        type: 'error',
        text: 'Formato de dados inválido! O arquivo precisa conter a lista de jornadas.',
      });
      return;
    }

    const mapa = new Map<string | number, Jornada>();
    registros.forEach((item) => {
      const id = item.id || `${item.data}_${item.horasTrabalhadas || 0}`;
      mapa.set(id, { ...item, id });
    });

    let novosAdicionados = 0;
    listaEntrada.forEach((itemImp: any) => {
      const id = itemImp.id || `${itemImp.data}_${itemImp.horasTrabalhadas || 0}`;
      if (!mapa.has(id)) {
        mapa.set(id, { ...itemImp, id });
        novosAdicionados++;
      }
    });

    const listaFinal = Array.from(mapa.values()).sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    );

    let objetivosFinais = objetivos;
    if (dadosImportados.objetivos && Array.isArray(dadosImportados.objetivos)) {
      objetivosFinais = dadosImportados.objetivos;
    }

    onImportSuccess(listaFinal, objetivosFinais);
    setStatusMsg({
      type: 'success',
      text: `Backup restaurado! ${novosAdicionados} nova(s) jornada(s) importada(s).`,
    });
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        processAndApply(parsed);
      } catch (err) {
        setStatusMsg({
          type: 'error',
          text: 'Erro ao processar arquivo JSON. Verifique se o arquivo está corrompido.',
        });
      }
    };
    reader.readAsText(file);
  };

  const handleTextImport = () => {
    if (!jsonText.trim()) {
      setStatusMsg({ type: 'error', text: 'Cole o texto JSON na caixa abaixo.' });
      return;
    }
    try {
      const parsed = JSON.parse(jsonText.trim());
      processAndApply(parsed);
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: 'Texto JSON inválido. Verifique a formatação e tente novamente.',
      });
    }
  };

  return (
    <div
      id="modal-backup"
      className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-start justify-center p-3 pt-6 z-50 overflow-y-auto"
    >
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-indigo-700 text-white px-5 py-3.5 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2">
            <CloudUpload className="w-4 h-4" />
            <h3 className="font-bold text-sm">Backup e Restauração</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-90 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700">
          {statusMsg && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {statusMsg.text}
            </div>
          )}

          {/* Section 1: Salvar Backup */}
          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 space-y-2 text-center">
            <span className="font-bold text-emerald-900 block text-xs">
              Salvar Backup no Celular
            </span>
            <p className="text-[11px] text-slate-600">
              Baixe um arquivo contendo todas as suas jornadas e objetivos salvos no navegador.
            </p>
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-3 px-3 rounded-xl shadow transition flex items-center justify-center space-x-2 mt-2"
            >
              <CloudDownload className="w-4 h-4" />
              <span>Baixar Arquivo (.json)</span>
            </button>
          </div>

          {/* Section 2: Restaurar Arquivo */}
          <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200/80 space-y-2 text-center">
            <span className="font-bold text-blue-900 block text-xs">
              Restaurar de Arquivo (.json)
            </span>
            <p className="text-[11px] text-slate-600">
              Selecione o arquivo de backup baixado anteriormente para recuperar seus dados.
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-3 px-3 rounded-xl shadow transition flex items-center justify-center space-x-2 mt-2"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Escolher Arquivo do Celular</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Section 3: Restaurar por Texto */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-left">
            <span className="font-bold text-slate-800 block text-xs flex items-center gap-1.5">
              <FileJson className="w-3.5 h-3.5 text-slate-500" />
              Ou Cole o Texto do Backup
            </span>
            <textarea
              rows={3}
              placeholder="Cole o código JSON do backup aqui..."
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <button
              type="button"
              onClick={handleTextImport}
              className="w-full bg-slate-800 hover:bg-slate-900 active:scale-95 text-white font-bold py-2.5 px-3 rounded-xl shadow transition flex items-center justify-center space-x-2"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Importar Texto</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
