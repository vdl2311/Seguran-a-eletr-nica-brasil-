import React, { useState } from 'react';
import { Quote, CompanySettings, QuoteStatus } from '../../types';
import { formatCurrency, formatDate } from '../../services/calculations';
import { StatusBadge } from '../ui/StatusBadge';
import { 
  Printer, 
  ArrowLeft, 
  Share2, 
  Check, 
  Edit3, 
  ShieldCheck, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock, 
  QrCode,
  FileCheck2,
  Copy
} from 'lucide-react';

interface QuotePreviewProps {
  quote: Quote;
  settings: CompanySettings;
  onBack: () => void;
  onEdit: (quote: Quote) => void;
  onUpdateStatus: (id: string, status: QuoteStatus) => void;
}

export const QuotePreview: React.FC<QuotePreviewProps> = ({
  quote,
  settings,
  onBack,
  onEdit,
  onUpdateStatus,
}) => {
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const generateWhatsappText = () => {
    const products = quote.items.filter(i => i.type === 'product');
    const services = quote.items.filter(i => i.type === 'service');

    let text = `*ORÇAMENTO DE SEGURANÇA ELETRÔNICA - ${settings.tradingName || settings.name}*\n`;
    text += `📄 *Orçamento:* ${quote.quoteNumber}\n`;
    text += `👤 *Cliente:* ${quote.customer?.name || 'Cliente'}\n`;
    text += `📅 *Data:* ${formatDate(quote.createdAt)} (Validade: ${quote.validityDays} dias)\n\n`;

    if (products.length > 0) {
      text += `📦 *EQUIPAMENTOS / PRODUTOS:*\n`;
      products.forEach(p => {
        text += `• ${p.quantity}x ${p.name} - ${formatCurrency(p.subtotal)}\n`;
      });
      text += `\n`;
    }

    if (services.length > 0) {
      text += `🛠️ *MÃO DE OBRA / SERVIÇOS:*\n`;
      services.forEach(s => {
        text += `• ${s.quantity}x ${s.name} - ${formatCurrency(s.subtotal)}\n`;
      });
      text += `\n`;
    }

    text += `💰 *RESUMO FINANCEIRO:*\n`;
    if (quote.discountGlobal > 0) {
      text += `• Subtotal Bruto: ${formatCurrency(quote.subtotalProducts + quote.subtotalServices)}\n`;
      text += `• Desconto Especial: -${formatCurrency(quote.discountGlobal)}\n`;
    }
    text += `⭐ *VALOR TOTAL: ${formatCurrency(quote.total)}*\n\n`;

    text += `💳 *CONDIÇÕES DE PAGAMENTO:*\n`;
    text += `${quote.payment.customDescription || quote.payment.method}\n\n`;

    if (quote.executionDeadline) {
      text += `⏱️ *Prazo de Execução:* ${quote.executionDeadline}\n`;
    }
    if (quote.warrantyTerms) {
      text += `🛡️ *Garantia:* ${quote.warrantyTerms}\n`;
    }

    text += `\n📞 Dúvidas? Fale conosco: ${settings.phone || settings.whatsapp}`;
    return text;
  };

  const handleCopyWhatsapp = () => {
    const text = generateWhatsappText();
    navigator.clipboard.writeText(text);
    setCopiedWhatsapp(true);
    setTimeout(() => setCopiedWhatsapp(false), 3000);
  };

  const productItems = quote.items.filter(item => item.type === 'product');
  const serviceItems = quote.items.filter(item => item.type === 'service');

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Top Action Bar (Hidden on Print) */}
      <div className="print:hidden bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Voltar à listagem"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{quote.quoteNumber}</span>
              <StatusBadge status={quote.status} size="sm" />
            </div>
            <p className="text-xs text-slate-500">Visualização de Documento Comercial</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Status Changer */}
          <select
            value={quote.status}
            onChange={(e) => onUpdateStatus(quote.id, e.target.value as QuoteStatus)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 hover:bg-slate-100 focus:outline-hidden cursor-pointer"
          >
            <option value="draft">Status: Rascunho</option>
            <option value="sent">Status: Enviado</option>
            <option value="pending">Status: Aguardando</option>
            <option value="approved">Status: Aprovado</option>
            <option value="rejected">Status: Recusado</option>
            <option value="expired">Status: Expirado</option>
          </select>

          {/* Copy WhatsApp */}
          <button
            onClick={handleCopyWhatsapp}
            className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-2 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
            title="Copiar resumo formatado para enviar no WhatsApp"
          >
            {copiedWhatsapp ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedWhatsapp ? 'Copiado!' : 'Copiar p/ WhatsApp'}</span>
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(quote)}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editar</span>
          </button>

          {/* Print to PDF */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / Salvar PDF</span>
          </button>
        </div>
      </div>

      {/* --- PRINTABLE A4 PROPOSAL DOCUMENT --- */}
      <div 
        id="printable-quote"
        className="bg-white p-8 sm:p-12 rounded-xl border border-slate-200 shadow-sm text-slate-800 print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none space-y-8"
      >
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-slate-900 pb-6">
          
          {/* Company Brand & Info */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center print:border print:border-slate-900">
                <ShieldCheck className="w-6 h-6 text-blue-400 print:text-slate-900" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900 leading-tight">
                  {settings.tradingName || settings.name}
                </h1>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Engenharia de Segurança Eletrônica
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-0.5 pt-2">
              {settings.document && <div><strong>CNPJ:</strong> {settings.document}</div>}
              <div><strong>Telefone/WhatsApp:</strong> {settings.phone} {settings.whatsapp ? `| ${settings.whatsapp}` : ''}</div>
              <div><strong>E-mail:</strong> {settings.email}</div>
              {settings.address?.street && (
                <div>
                  <strong>Endereço:</strong> {settings.address.street}, {settings.address.number} - {settings.address.neighborhood}, {settings.address.city}/{settings.address.state}
                </div>
              )}
            </div>
          </div>

          {/* Quote Meta Box */}
          <div className="bg-slate-50 print:bg-white p-4 rounded-lg border border-slate-200 text-right shrink-0 min-w-48 space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase">Proposta Comercial</div>
            <div className="text-lg font-black font-mono text-slate-900">{quote.quoteNumber}</div>
            <div className="text-xs text-slate-600 pt-1">
              <strong>Emissão:</strong> {formatDate(quote.createdAt)}
            </div>
            <div className="text-xs text-slate-600">
              <strong>Validade:</strong> {quote.validityDays} dias
            </div>
            <div className="pt-1">
              <StatusBadge status={quote.status} size="sm" />
            </div>
          </div>

        </div>

        {/* Customer Block */}
        <div className="bg-slate-50/70 p-5 rounded-lg border border-slate-200">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Identificação do Cliente
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-sm font-bold text-slate-900">{quote.customer?.name}</div>
              {quote.customer?.document && (
                <div className="text-slate-600 mt-0.5"><strong>CPF/CNPJ:</strong> {quote.customer.document}</div>
              )}
              {quote.customer?.email && (
                <div className="text-slate-600 mt-0.5"><strong>E-mail:</strong> {quote.customer.email}</div>
              )}
              {quote.customer?.phone && (
                <div className="text-slate-600 mt-0.5"><strong>Telefone:</strong> {quote.customer.phone}</div>
              )}
            </div>

            <div>
              {quote.customer?.address?.street ? (
                <div className="text-slate-600 space-y-0.5">
                  <div className="font-semibold text-slate-700">Local de Instalação / Atendimento:</div>
                  <div>{quote.customer.address.street}, {quote.customer.address.number} {quote.customer.address.complement ? `- ${quote.customer.address.complement}` : ''}</div>
                  <div>{quote.customer.address.neighborhood} - {quote.customer.address.city}/{quote.customer.address.state}</div>
                  {quote.customer.address.zipCode && <div>CEP: {quote.customer.address.zipCode}</div>}
                </div>
              ) : (
                <div className="text-slate-400 italic">Endereço no local do cliente</div>
              )}
            </div>
          </div>
        </div>

        {/* Title of the project */}
        {quote.title && (
          <div className="border-l-4 border-slate-900 pl-3">
            <h2 className="text-base font-bold text-slate-900">{quote.title}</h2>
          </div>
        )}

        {/* --- PRODUCTS TABLE --- */}
        {productItems.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between border-b border-slate-200 pb-1">
              <span>1. Equipamentos e Materiais</span>
              <span className="text-[11px] font-semibold text-slate-500 font-mono">Subtotal: {formatCurrency(quote.subtotalProducts)}</span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold uppercase">
                <tr>
                  <th className="py-2 px-3">Item / Especificação Técnica</th>
                  <th className="py-2 px-2 text-center w-16">Qtd</th>
                  <th className="py-2 px-3 text-right w-24">Unitário</th>
                  <th className="py-2 px-3 text-right w-24">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {productItems.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{item.name}</div>
                      {item.description && (
                        <div className="text-[11px] text-slate-500 mt-0.5">{item.description}</div>
                      )}
                      {item.sku && (
                        <span className="text-[10px] text-slate-400 font-mono">Cód: {item.sku}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center font-medium">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      {formatCurrency(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- SERVICES TABLE --- */}
        {serviceItems.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between border-b border-slate-200 pb-1">
              <span>2. Serviços Especializados e Mão de Obra</span>
              <span className="text-[11px] font-semibold text-slate-500 font-mono">Subtotal: {formatCurrency(quote.subtotalServices)}</span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold uppercase">
                <tr>
                  <th className="py-2 px-3">Descrição do Serviço Técnico</th>
                  <th className="py-2 px-2 text-center w-16">Qtd</th>
                  <th className="py-2 px-3 text-right w-24">Unitário</th>
                  <th className="py-2 px-3 text-right w-24">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {serviceItems.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{item.name}</div>
                      {item.description && (
                        <div className="text-[11px] text-slate-500 mt-0.5">{item.description}</div>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center font-medium">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      {formatCurrency(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- FINANCIAL TOTALS BOX --- */}
        <div className="border-t-2 border-slate-900 pt-4 flex flex-col sm:flex-row justify-between items-start gap-6">
          
          {/* Payment Details */}
          <div className="flex-1 space-y-3">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
                <span>Condições de Pagamento</span>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {quote.payment.customDescription || quote.payment.method}
              </div>
              {settings.pixKey && (
                <div className="text-xs text-slate-600 mt-2 pt-2 border-t border-slate-200">
                  <strong>Chave Pix ({settings.pixKeyType || 'CNPJ'}):</strong> {settings.pixKey}
                </div>
              )}
            </div>

            {quote.executionDeadline && (
              <div className="text-xs text-slate-700">
                <strong>Prazo de Instalação:</strong> {quote.executionDeadline}
              </div>
            )}

            {quote.warrantyTerms && (
              <div className="text-xs text-slate-700">
                <strong>Termo de Garantia:</strong> {quote.warrantyTerms}
              </div>
            )}
          </div>

          {/* Breakdown Totals */}
          <div className="w-full sm:w-72 bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Total de Equipamentos:</span>
              <span className="font-semibold">{formatCurrency(quote.subtotalProducts)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total de Mão de Obra:</span>
              <span className="font-semibold">{formatCurrency(quote.subtotalServices)}</span>
            </div>
            
            {quote.discountGlobal > 0 && (
              <div className="flex justify-between text-rose-700 font-semibold pt-1 border-t border-slate-200">
                <span>Desconto Especial:</span>
                <span>-{formatCurrency(quote.discountGlobal)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-900 font-black text-base pt-2 border-t-2 border-slate-900">
              <span>VALOR TOTAL:</span>
              <span className="text-slate-900">{formatCurrency(quote.total)}</span>
            </div>
          </div>

        </div>

        {/* Observations and Technical Notes */}
        {quote.observations && (
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs space-y-1">
            <div className="font-bold uppercase tracking-wider text-slate-600 mb-1">
              Observações Técnicas e Condições Gerais:
            </div>
            <div className="text-slate-700 whitespace-pre-line leading-relaxed">
              {quote.observations}
            </div>
          </div>
        )}

        {/* Footer Notes & Signatures */}
        <div className="pt-10 space-y-12">
          
          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 text-center text-xs pt-8">
            <div>
              <div className="border-t border-slate-400 w-3/4 mx-auto pt-1.5 font-bold text-slate-900">
                {settings.tradingName || settings.name}
              </div>
              <div className="text-[11px] text-slate-500">Responsável Técnico / Comercial</div>
            </div>

            <div>
              <div className="border-t border-slate-400 w-3/4 mx-auto pt-1.5 font-bold text-slate-900">
                {quote.customer?.name}
              </div>
              <div className="text-[11px] text-slate-500">De acordo / Assinatura do Cliente</div>
            </div>
          </div>

          {/* Footer Branding Text */}
          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4">
            {settings.footerNotes || 'Documento gerado eletronicamente por SecurQuote - Sistema de Gestão de Orçamentos'}
          </div>

        </div>

      </div>

    </div>
  );
};
