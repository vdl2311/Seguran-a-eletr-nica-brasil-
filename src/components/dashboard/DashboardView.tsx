import React from 'react';
import { Quote, QuoteStatus } from '../../types';
import { formatCurrency, formatDate } from '../../services/calculations';
import { StatusBadge } from '../ui/StatusBadge';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Plus, 
  Eye, 
  ArrowRight,
  User,
  Calendar,
  Layers
} from 'lucide-react';

interface DashboardViewProps {
  quotes: Quote[];
  onNewQuote: () => void;
  onViewQuote: (quote: Quote) => void;
  onEditQuote: (quote: Quote) => void;
  onNavigateToQuotes: () => void;
  onUpdateStatus: (id: string, newStatus: QuoteStatus) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  quotes,
  onNewQuote,
  onViewQuote,
  onNavigateToQuotes,
  onUpdateStatus,
}) => {
  const totalQuotes = quotes.length;
  const approvedQuotes = quotes.filter((q) => q.status === 'approved');
  const openQuotes = quotes.filter((q) => q.status === 'pending' || q.status === 'sent');
  const draftQuotes = quotes.filter((q) => q.status === 'draft');
  
  const totalGrossValue = quotes.reduce((acc, q) => acc + (q.total || 0), 0);
  const approvedValue = approvedQuotes.reduce((acc, q) => acc + (q.total || 0), 0);
  const openValue = openQuotes.reduce((acc, q) => acc + (q.total || 0), 0);

  const recentQuotes = [...quotes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-5">
      
      {/* Welcome Banner / Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Painel de Orçamentos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Gestão de vendas, equipamentos e serviços de segurança eletrônica
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onNewQuote}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Novo Orçamento</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Orçamentos */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Emitido
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="text-xl sm:text-2xl font-bold text-slate-900">{totalQuotes}</div>
            <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate font-medium">
              {formatCurrency(totalGrossValue)}
            </div>
          </div>
        </div>

        {/* Em Aberto / Aguardando */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-amber-800">
              Em Aberto
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="text-xl sm:text-2xl font-bold text-amber-900">{openQuotes.length}</div>
            <div className="text-[11px] sm:text-xs text-amber-700 mt-0.5 truncate font-medium">
              {formatCurrency(openValue)}
            </div>
          </div>
        </div>

        {/* Aprovados */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Aprovados
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="text-xl sm:text-2xl font-bold text-emerald-900">{approvedQuotes.length}</div>
            <div className="text-[11px] sm:text-xs text-emerald-700 mt-0.5 truncate font-medium">
              {formatCurrency(approvedValue)}
            </div>
          </div>
        </div>

        {/* Taxa de Conversão */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">
              Conversão
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="text-xl sm:text-2xl font-bold text-slate-900">
              {totalQuotes > 0 ? Math.round((approvedQuotes.length / totalQuotes) * 100) : 0}%
            </div>
            <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate font-medium">
              {draftQuotes.length} rascunho(s)
            </div>
          </div>
        </div>

      </div>

      {/* Recent Quotes Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Orçamentos Recentes
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Últimas propostas comerciais geradas no sistema
            </p>
          </div>
          <button
            onClick={onNavigateToQuotes}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer shrink-0"
          >
            <span>Ver todos ({totalQuotes})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentQuotes.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-700">Nenhum orçamento cadastrado ainda</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Clique em "Novo Orçamento" para criar sua primeira proposta de segurança eletrônica.
            </p>
            <button
              onClick={onNewQuote}
              className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Criar primeiro orçamento</span>
            </button>
          </div>
        ) : (
          <>
            {/* Desktop / Tablet Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Número</th>
                    <th className="py-3 px-4">Cliente / Título</th>
                    <th className="py-3 px-4">Data</th>
                    <th className="py-3 px-4 text-right">Valor Total</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {recentQuotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-slate-50/70 transition-colors">
                      
                      {/* Número */}
                      <td className="py-3.5 px-4 font-mono font-medium text-xs text-slate-900 whitespace-nowrap">
                        {quote.quoteNumber}
                      </td>

                      {/* Cliente e Título */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900">
                          {quote.customer?.name || 'Cliente não identificado'}
                        </div>
                        <div className="text-xs text-slate-500 truncate max-w-xs">
                          {quote.title || `${quote.items?.length || 0} item(ns)`}
                        </div>
                      </td>

                      {/* Data */}
                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(quote.createdAt)}
                      </td>

                      {/* Valor */}
                      <td className="py-3.5 px-4 text-right font-semibold text-slate-900 whitespace-nowrap">
                        {formatCurrency(quote.total)}
                      </td>

                      {/* Status com Seletor Rápido */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <select
                          value={quote.status}
                          onChange={(e) => onUpdateStatus(quote.id, e.target.value as QuoteStatus)}
                          className="text-xs font-medium bg-transparent border border-slate-200 rounded py-1 px-2 focus:ring-1 focus:ring-blue-500 cursor-pointer hover:bg-slate-100"
                        >
                          <option value="draft">Rascunho</option>
                          <option value="sent">Enviado</option>
                          <option value="pending">Aguardando</option>
                          <option value="approved">Aprovado</option>
                          <option value="rejected">Recusado</option>
                          <option value="expired">Expirado</option>
                        </select>
                      </td>

                      {/* Ações */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onViewQuote(quote)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                          title="Visualizar e Imprimir Orçamento"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver / Imprimir</span>
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (optimized for smartphones) */}
            <div className="sm:hidden divide-y divide-slate-100">
              {recentQuotes.map((quote) => (
                <div key={quote.id} className="p-4 space-y-3 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {quote.quoteNumber}
                      </span>
                      <h3 className="font-semibold text-slate-900 text-sm mt-1">
                        {quote.customer?.name || 'Cliente não identificado'}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {quote.title || 'Sistema de Segurança'}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-slate-900">
                        {formatCurrency(quote.total)}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {formatDate(quote.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <select
                      value={quote.status}
                      onChange={(e) => onUpdateStatus(quote.id, e.target.value as QuoteStatus)}
                      className="text-xs font-medium bg-slate-50 border border-slate-200 rounded py-1 px-2 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="draft">Rascunho</option>
                      <option value="sent">Enviado</option>
                      <option value="pending">Aguardando</option>
                      <option value="approved">Aprovado</option>
                      <option value="rejected">Recusado</option>
                      <option value="expired">Expirado</option>
                    </select>

                    <button
                      onClick={() => onViewQuote(quote)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver / Imprimir</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
};

