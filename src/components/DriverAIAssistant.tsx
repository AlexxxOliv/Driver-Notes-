import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Lightbulb,
  TrendingUp,
  Fuel,
  RefreshCw,
  X,
} from 'lucide-react';
import Markdown from 'react-markdown';
import { Jornada, Objetivo, ChatMessage } from '../types';

interface DriverAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  registros: Jornada[];
  objetivos: Objetivo[];
  filtroMesAno: string;
}

export const DriverAIAssistant: React.FC<DriverAIAssistantProps> = ({
  isOpen,
  onClose,
  registros,
  objetivos,
  filtroMesAno,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Olá, parceiro! Sou o assistente inteligente do **DRIVER NOTES**. Posso analisar seus ganhos, consumo de combustível, metas e sugerir estratégias para você lucrar mais no volante. Como posso te ajudar hoje?',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Build driver financial context summary to pass as system context
  const getContextSummary = () => {
    const [anoStr, mesStr] = filtroMesAno.split('-');
    const ano = parseInt(anoStr, 10);
    const mes = parseInt(mesStr, 10);

    const doMes = registros.filter((r) => {
      if (!r.data) return false;
      const [a, m] = r.data.split('-');
      return parseInt(a, 10) === ano && parseInt(m, 10) === mes;
    });

    let uber = 0;
    let pop = 0;
    let particular = 0;
    let gorjeta = 0;
    let comb = 0;
    let outrasDespesas = 0;
    let km = 0;

    doMes.forEach((r) => {
      uber += r.uber || 0;
      pop += r.pop || 0;
      particular += r.particular || 0;
      gorjeta += r.gorjeta || 0;
      comb += r.combustivelCalculado || r.combustivel || 0;
      km += r.km || 0;
      if (r.outrasDespesas) {
        outrasDespesas += r.outrasDespesas.reduce((acc, d) => acc + (d.valor || 0), 0);
      }
    });

    const bruto = uber + pop + particular + gorjeta;
    const gastos = comb + outrasDespesas;
    const lucro = bruto - gastos;
    const mediaRk = km > 0 ? (bruto / km).toFixed(2) : '0.00';

    return `
DADOS DO MOTORISTA (${filtroMesAno}):
- Total Jornadas no Mês: ${doMes.length}
- Ganho Bruto: R$ ${bruto.toFixed(2)} (Uber: R$ ${uber.toFixed(2)}, 99 Pop: R$ ${pop.toFixed(2)}, Particular: R$ ${particular.toFixed(2)}, Gorjetas: R$ ${gorjeta.toFixed(2)})
- Gastos: R$ ${gastos.toFixed(2)} (Combustível: R$ ${comb.toFixed(2)}, Outros: R$ ${outrasDespesas.toFixed(2)})
- Lucro Líquido: R$ ${lucro.toFixed(2)}
- KM Rodados: ${km.toFixed(1)} km (Média R$/KM: R$ ${mediaRk}/km)
- Metas Cadastradas: ${objetivos.map((o) => `${o.titulo} (R$ ${o.valor.toFixed(2)})`).join(', ') || 'Nenhuma'}
    `.trim();
  };

  const handleSend = async (userText: string) => {
    if (!userText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const summary = getContextSummary();
      const systemInstruction = `Você é o co-piloto e consultor financeiro especialista do aplicativo DRIVER NOTES para motoristas de aplicativo (Uber, 99, Particular).
Seu objetivo é dar respostas diretas, motivadoras, práticas e com números reais baseados nos dados fornecidos do motorista.
Use português do Brasil amigável e focado na realidade de quem está na rua trabalhando.
Quando analisar dados, aponte métricas como R$/KM, proporção de gastos sobre o faturamento, e recomendações práticas.
${summary}`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, text: m.text })),
          systemInstruction,
          temperature: 0.7,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro na resposta do Gemini');
      }

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.reply || 'Sem resposta do modelo.',
        timestamp: Date.now(),
      };
      setMessages([...newMessages, modelMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: `Desculpe, ocorreu uma instabilidade na conexão: ${err.message}. Tente novamente em instantes.`,
        timestamp: Date.now(),
      };
      setMessages([...newMessages, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    {
      label: 'Analisar meu mês atual',
      icon: TrendingUp,
      prompt: 'Analise detalhadamente o meu rendimento deste mês de acordo com meus dados registrados no DRIVER NOTES. Como está minha média por KM e o que posso melhorar?',
    },
    {
      label: 'Dicas para economizar combustível',
      icon: Fuel,
      prompt: 'Quais as melhores dicas práticas para motorista de app economizar combustível no dia a dia urbano?',
    },
    {
      label: 'Uber vs 99 vs Particular',
      icon: Lightbulb,
      prompt: 'Com base no que registrei, qual canal está sendo mais vantajoso pra mim e como posso otimizar corridas particulares?',
    },
  ];

  return (
    <div
      id="modal-assistente-ia"
      className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 z-50 overflow-y-auto"
    >
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-800 text-white px-5 py-3.5 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Assistente DRIVER NOTES</h3>
              <span className="text-[10px] text-indigo-200 block">
                Inteligência Artificial Gemini com seus dados
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-90 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-indigo-50/60 p-2.5 border-b border-indigo-100/60 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          {quickPrompts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(item.prompt)}
                disabled={loading}
                className="shrink-0 flex items-center gap-1.5 bg-white border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 px-2.5 py-1 rounded-full text-[11px] font-bold text-indigo-900 shadow-xs transition"
              >
                <Icon className="w-3 h-3 text-indigo-600" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-indigo-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  <div className="markdown-body">
                    <Markdown>{m.text}</Markdown>
                  </div>
                </div>
                {isUser && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span>Analisando suas informações...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Faça uma pergunta sobre seus ganhos ou custos..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={`p-2.5 rounded-xl text-white transition ${
                input.trim() && !loading
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
