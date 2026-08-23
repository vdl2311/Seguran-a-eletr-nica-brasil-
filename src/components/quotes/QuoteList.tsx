import React, { useState, useMemo } from 'react';
import { Quote, QuoteStatus } from '../../types';
import { formatCurrency, formatDate } from '../../services/calculations';
import { StatusBadge } from '../ui/StatusBadge';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit3, 
  Copy, 
  Trash2, 
  Filter, 
  FileText,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';

interface QuoteListProps {
  quotes: Quote[];
  onNewQuote: () => void;
  onViewQuote: (quote: Quote) => void;
  onEditQuote: (quote: Quote) => void;
  onDuplicateQuote: (id: string) => void;
  onDeleteQuote: (id: string) => void;
  onUpdateStatus: (id: string, status: QuoteStatus) => void;
}

export const QuoteList: React.FC<QuoteListProps> = ({
  quotes,
  onNewQuote,
  onViewQuote,
  onEditQuote,
  onDuplicateQuote,
  onDeleteQuote,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null);

  const filteredQuotes = useMemo(() => {
    return quotes.filter((quote) => {
      const matchesSearch = 
        quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.customer?.document?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;

      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [quotes, searchTerm, statusFilter]);

  const statusCounts = useMemo(() => {
    return {
      all: quotes.length,
      draft: quotes.filter(q => q.status === 'draft').length,
      sent: quotes.filter(q => q.status === 'sent').length,
      pending: quotes.filter(q => q.status === 'pending').length,
      approved: quotes.filter(q => q.status === 'approved').length,
      rejected: quotes.filter(q => q.status === 'rejected').length,
      expired: quotes.filter(q => q.status === 'expired').length,
    };
  }, [quotes]);

  const confirmDelete = () => {
    if (quoteToDelete) {
      onDeleteQuote(quoteToDelete.id);
      setQuoteToDelete(null);
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Header & Main Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Gerenciamento de Orçamentos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Visualize, filtre, altere status e emita documentos comerciais
          </p>
        </div>
        <button
          onClick={onNewQuote}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Novo Orçamento</span>
        </button>
      </div>

      {/* Filters and Search Strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por cliente, nº do orçamento, título ou CPF/CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Quick Clear Filter if active */}
          {(searchTerm || statusFilter !== 'all') && (
            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
              className="text-xs text-slate-600 hover:text-slate-900 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
            >
              Limpar Filtros
            </button>
          )}
        </div>

        {/* Status Pills Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos ({statusCounts.all})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'draft'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Rascunho ({statusCounts.draft})
          </button>
          <button
            onClick={() => setStatusFilter('sent')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'sent'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
            }`}
          >
            Enviados ({statusCounts.sent})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
            }`}
          >
            Aguardando ({statusCounts.pending})
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'approved'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            Aprovados ({statusCounts.approved})
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'rejected'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-900 hover:bg-rose-100'
            }`}
          >
            Recusados ({statusCounts.rejected})
          </button>
          <button
            onClick={() => setStatusFilter('expired')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'expired'
                ? 'bg-zinc-700 text-white'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            Expirados ({statusCounts.expired})
          </button>
        </div>
      </div>

      {/* Quotes Table or Mobile Card View or Empty State */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredQuotes.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">
              Nenhum orçamento encontrado
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'all'
                ? 'Nenhum resultado corresponde aos filtros selecionados. Tente ajustar os termos de busca.'
                : 'Você ainda não possui orçamentos cadastrados.'}
            </p>
            {searchTerm || statusFilter !== 'all' ? (
              <button
                onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Limpar filtros de busca
              </button>
            ) : (
              <button
                onClick={onNewQuote}
                className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Novo Orçamento</span>
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop / Tablet Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Número</th>
                    <th className="py-3 px-4">Cliente / Proposta</th>
                    <th className="py-3 px-4">Emissão</th>
                    <th className="py-3 px-4">Itens</th>
                    <th className="py-3 px-4 text-right">Valor Total</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredQuotes.map((quote) => {
                    const prodCount = quote.items?.filter(i => i.type === 'product').length || 0;
                    const servCount = quote.items?.filter(i => i.type === 'service').length || 0;

                    return (
                      <tr key={quote.id} className="hover:bg-slate-50/70 transition-colors">
                        
                        {/* Número */}
                        <td className="py-3.5 px-4 font-mono font-semibold text-xs text-slate-900 whitespace-nowrap">
                          {quote.quoteNumber}
                        </td>

                        {/* Cliente e Descrição */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{quote.customer?.name || 'Cliente não informado'}</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 max-w-sm truncate">
                            {quote.title || 'Orçamento de Segurança Eletrônica'}
                          </div>
                          {quote.customer?.phone && (
                            <div className="text-[11px] text-slate-400">
                              {quote.customer.phone}
                            </div>
                          )}
                        </td>

                        {/* Data de Emissão */}
                        <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{formatDate(quote.createdAt)}</span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Validade: {quote.validityDays || 15} dias
                          </div>
                        </td>

                        {/* Quantidade de Itens */}
                        <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>
                              {prodCount} prod. | {servCount} serv.
                            </span>
                          </div>
                        </td>

                        {/* Valor Total */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="font-bold text-slate-900 text-sm">
                            {formatCurrency(quote.total)}
                          </div>
                          {quote.discountGlobal > 0 && (
                            <div className="text-[11px] text-emerald-600 font-medium">
                              Desc: -{formatCurrency(quote.discountGlobal)}
                            </div>
                          )}
                        </td>

                        {/* Status Dropdown */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <select
                            value={quote.status}
                            onChange={(e) => onUpdateStatus(quote.id, e.target.value as QuoteStatus)}
                            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-md py-1 px-2 focus:ring-2 focus:ring-blue-500 focus:outline-hidden cursor-pointer hover:bg-slate-100"
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
                          <div className="flex items-center justify-end gap-1">
                            
                            {/* Visualizar / Imprimir */}
                            <button
                              onClick={() => onViewQuote(quote)}
                              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                              title="Visualizar / Imprimir"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Editar */}
                            <button
                              onClick={() => onEditQuote(quote)}
                              className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                              title="Editar Orçamento"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {/* Duplicar */}
                            <button
                              onClick={() => onDuplicateQuote(quote.id)}
                              className="p-1.5 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors cursor-pointer"
                              title="Duplicar Orçamento"
                            >
                              <Copy className="w-4 h-4" />
                            </button>

                            {/* Excluir */}
                            <button
                              onClick={() => setQuoteToDelete(quote)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                              title="Excluir Orçamento"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List (optimized for small screens) */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredQuotes.map((quote) => (
                <div key={quote.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {quote.quoteNumber}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {formatDate(quote.createdAt)}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm mt-1">
                        {quote.customer?.name || 'Cliente não identificado'}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {quote.title || 'Orçamento de Segurança'}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-slate-900">
                        {formatCurrency(quote.total)}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {quote.items?.length || 0} item(ns)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
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

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onViewQuote(quote)}
                        className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                        title="Ver Orçamento"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditQuote(quote)}
                        className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors cursor-pointer"
                        title="Editar Orçamento"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDuplicateQuote(quote.id)}
                        className="p-1.5 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors cursor-pointer"
                        title="Duplicar"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setQuoteToDelete(quote)}
                        className="p-1.5 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal for Deletion */}
      {quoteToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Confirmar Exclusão de Orçamento
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Tem certeza que deseja excluir o orçamento <strong className="text-slate-900">{quoteToDelete.quoteNumber}</strong> para o cliente <strong>{quoteToDelete.customer?.name}</strong>?
            </p>
            <p className="text-xs text-rose-600 mt-2 font-medium">
              Esta ação não pode ser desfeita.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setQuoteToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
              >
                Excluir Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
