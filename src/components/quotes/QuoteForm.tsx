import React, { useState, useMemo, useEffect } from 'react';
import { 
  Quote, 
  QuoteItem, 
  Customer, 
  Product, 
  Service, 
  CompanySettings, 
  PaymentCondition,
  QuoteStatus 
} from '../../types';
import { calculateItemSubtotal, calculateQuoteTotals, formatCurrency, generateQuoteNumber } from '../../services/calculations';
import { maskPhone, maskCpfCnpj, maskCep } from '../../utils/masks';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Search, 
  Check, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  DollarSign, 
  ShieldCheck, 
  Wrench, 
  Package, 
  Layers,
  ChevronRight,
  Eye
} from 'lucide-react';

interface QuoteFormProps {
  initialQuote?: Quote | null;
  customers: Customer[];
  products: Product[];
  services: Service[];
  settings: CompanySettings;
  existingQuotesCount: number;
  onSave: (quoteData: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  onSaveAndPreview?: (quote: Quote) => void;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({
  initialQuote,
  customers,
  products,
  services,
  settings,
  existingQuotesCount,
  onSave,
  onCancel,
}) => {
  // --- STATE ---
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Quote Metadata
  const [quoteNumber, setQuoteNumber] = useState<string>(
    initialQuote ? initialQuote.quoteNumber : generateQuoteNumber(existingQuotesCount)
  );
  const [title, setTitle] = useState<string>(
    initialQuote?.title || 'Sistema de Segurança Eletrônica'
  );
  const [status, setStatus] = useState<QuoteStatus>(initialQuote?.status || 'draft');

  // Customer State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    initialQuote?.customer?.id || ''
  );
  const [isNewCustomer, setIsNewCustomer] = useState<boolean>(!initialQuote?.customer?.id && customers.length === 0);
  const [customerSearch, setCustomerSearch] = useState<string>('');
  
  // Direct customer input fields
  const [custName, setCustName] = useState<string>(initialQuote?.customer?.name || '');
  const [custDocument, setCustDocument] = useState<string>(initialQuote?.customer?.document || '');
  const [custPhone, setCustPhone] = useState<string>(initialQuote?.customer?.phone || '');
  const [custEmail, setCustEmail] = useState<string>(initialQuote?.customer?.email || '');
  const [custStreet, setCustStreet] = useState<string>(initialQuote?.customer?.address?.street || '');
  const [custNumber, setCustNumber] = useState<string>(initialQuote?.customer?.address?.number || '');
  const [custComplement, setCustComplement] = useState<string>(initialQuote?.customer?.address?.complement || '');
  const [custNeighborhood, setCustNeighborhood] = useState<string>(initialQuote?.customer?.address?.neighborhood || '');
  const [custCity, setCustCity] = useState<string>(initialQuote?.customer?.address?.city || settings.address.city || '');
  const [custState, setCustState] = useState<string>(initialQuote?.customer?.address?.state || settings.address.state || '');
  const [custZip, setCustZip] = useState<string>(initialQuote?.customer?.address?.zipCode || '');
  const [custNotes, setCustNotes] = useState<string>(initialQuote?.customer?.notes || '');

  // Items State
  const [items, setItems] = useState<QuoteItem[]>(initialQuote?.items || []);
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [catalogTab, setCatalogTab] = useState<'all' | 'products' | 'services'>('all');
  const [catalogCategory, setCatalogCategory] = useState<string>('all');

  // Financial discounts
  const [discountGlobal, setDiscountGlobal] = useState<number>(initialQuote?.discountGlobal || 0);
  const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>(
    initialQuote?.discountType || 'fixed'
  );

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentCondition['method']>(
    initialQuote?.payment?.method || 'Pix'
  );
  const [installments, setInstallments] = useState<number>(initialQuote?.payment?.installments || 1);
  const [downPayment, setDownPayment] = useState<number>(initialQuote?.payment?.downPayment || 0);
  const [customDescription, setCustomDescription] = useState<string>(
    initialQuote?.payment?.customDescription || ''
  );

  // Terms and Observations
  const [validityDays, setValidityDays] = useState<number>(
    initialQuote?.validityDays || settings.defaultValidityDays || 15
  );
  const [executionDeadline, setExecutionDeadline] = useState<string>(
    initialQuote?.executionDeadline || settings.defaultExecutionDeadline || '3 dias úteis após aprovação'
  );
  const [warrantyTerms, setWarrantyTerms] = useState<string>(
    initialQuote?.warrantyTerms || settings.defaultWarranty || '12 meses para equipamentos e 90 dias para serviços.'
  );
  const [observations, setObservations] = useState<string>(
    initialQuote?.observations || settings.defaultObservations || ''
  );

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Populate customer info when selecting from list
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomerId(customer.id);
    setIsNewCustomer(false);
    setCustName(customer.name);
    setCustDocument(customer.document || '');
    setCustPhone(customer.phone);
    setCustEmail(customer.email || '');
    setCustStreet(customer.address?.street || '');
    setCustNumber(customer.address?.number || '');
    setCustComplement(customer.address?.complement || '');
    setCustNeighborhood(customer.address?.neighborhood || '');
    setCustCity(customer.address?.city || '');
    setCustState(customer.address?.state || '');
    setCustZip(customer.address?.zipCode || '');
    setCustNotes(customer.notes || '');
  };

  // Filtered catalog
  const filteredCatalog = useMemo(() => {
    const term = catalogSearch.toLowerCase();
    
    let prods = products.filter(p => p.active !== false).map(p => ({
      ...p,
      itemType: 'product' as const,
    }));
    
    let servs = services.filter(s => s.active !== false).map(s => ({
      ...s,
      unitPrice: s.price,
      itemType: 'service' as const,
    }));

    let combined = [];
    if (catalogTab === 'products') combined = prods;
    else if (catalogTab === 'services') combined = servs;
    else combined = [...prods, ...servs];

    return combined.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(term) || 
                          item.description.toLowerCase().includes(term) ||
                          ('sku' in item && item.sku && item.sku.toLowerCase().includes(term));
      const matchCategory = catalogCategory === 'all' || item.category === catalogCategory;
      return matchSearch && matchCategory;
    });
  }, [products, services, catalogSearch, catalogTab, catalogCategory]);

  // Categories list for filtering
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => set.add(p.category));
    services.forEach(s => set.add(s.category));
    return Array.from(set);
  }, [products, services]);

  // Add Item to quote
  const handleAddItem = (item: Product | Service, type: 'product' | 'service') => {
    const price = type === 'product' ? (item as Product).unitPrice : (item as Service).price;
    const newItem: QuoteItem = {
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      type,
      itemId: item.id,
      name: item.name,
      description: item.description,
      category: item.category,
      sku: 'sku' in item ? item.sku : undefined,
      quantity: 1,
      unitPrice: price,
      discount: 0,
      unit: item.unit || 'un',
      subtotal: price,
    };

    setItems(prev => [...prev, newItem]);
  };

  // Add Custom Item (not in catalog)
  const handleAddCustomItem = (type: 'product' | 'service') => {
    const newItem: QuoteItem = {
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      type,
      name: type === 'product' ? 'Novo Equipamento / Material' : 'Novo Serviço / Mão de Obra',
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      unit: type === 'product' ? 'un' : 'serviço',
      subtotal: 0,
    };

    setItems(prev => [...prev, newItem]);
  };

  // Update item field
  const handleUpdateItem = (id: string, updates: Partial<QuoteItem>) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, ...updates };
      const subtotal = calculateItemSubtotal(updated.quantity, updated.unitPrice, updated.discount);
      return { ...updated, subtotal };
    }));
  };

  // Remove item
  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Live Totals Calculation
  const totals = useMemo(() => {
    return calculateQuoteTotals(items, discountGlobal, discountType);
  }, [items, discountGlobal, discountType]);

  // Automatic custom payment string updater
  useEffect(() => {
    if (paymentMethod === 'Pix') {
      setCustomDescription(`Pagamento integral via Pix à vista na entrega/conclusão`);
    } else if (paymentMethod === 'Cartão de Crédito') {
      if (installments > 1) {
        const installmentVal = totals.netTotal / installments;
        setCustomDescription(`${installments}x de ${formatCurrency(installmentVal)} no Cartão de Crédito sem juros`);
      } else {
        setCustomDescription(`1x de ${formatCurrency(totals.netTotal)} no Cartão de Crédito`);
      }
    } else if (paymentMethod === 'Boleto Bancário') {
      setCustomDescription(`Faturamento em boleto bancário (30 dias após emissão da NF-e)`);
    } else if (paymentMethod === 'Personalizado') {
      if (downPayment > 0 && installments > 1) {
        const remaining = Math.max(0, totals.netTotal - downPayment);
        const installmentVal = remaining / installments;
        setCustomDescription(`Entrada de ${formatCurrency(downPayment)} + ${installments}x de ${formatCurrency(installmentVal)}`);
      }
    }
  }, [paymentMethod, installments, downPayment, totals.netTotal]);

  // Form submission validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!custName.trim()) {
      newErrors.custName = 'O nome do cliente é obrigatório.';
    }
    if (!custPhone.trim()) {
      newErrors.custPhone = 'O telefone ou WhatsApp do cliente é obrigatório.';
    }
    if (items.length === 0) {
      newErrors.items = 'Adicione ao menos um produto ou serviço ao orçamento.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      if (errors.custName || errors.custPhone) {
        setActiveStep(1);
      } else if (errors.items) {
        setActiveStep(2);
      }
      return;
    }

    const currentCustomer: Customer = {
      id: selectedCustomerId || ('cust_' + Date.now()),
      name: custName.trim(),
      document: custDocument.trim() || undefined,
      phone: custPhone.trim(),
      email: custEmail.trim() || undefined,
      address: {
        street: custStreet.trim(),
        number: custNumber.trim(),
        complement: custComplement.trim() || undefined,
        neighborhood: custNeighborhood.trim(),
        city: custCity.trim(),
        state: custState.trim(),
        zipCode: custZip.trim() || undefined,
      },
      notes: custNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const quoteData: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'> = {
      quoteNumber: quoteNumber.trim(),
      title: title.trim() || 'Orçamento de Segurança Eletrônica',
      customer: currentCustomer,
      items,
      subtotalProducts: totals.subtotalProducts,
      subtotalServices: totals.subtotalServices,
      discountGlobal,
      discountType,
      total: totals.netTotal,
      payment: {
        method: paymentMethod,
        installments: Number(installments) || 1,
        downPayment: Number(downPayment) || 0,
        customDescription: customDescription.trim(),
      },
      validityDays: Number(validityDays) || 15,
      executionDeadline: executionDeadline.trim(),
      warrantyTerms: warrantyTerms.trim(),
      observations: observations.trim(),
      status,
    };

    onSave(quoteData);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Top Bar Header Navigation */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                {initialQuote ? `Editar Orçamento ${initialQuote.quoteNumber}` : 'Novo Orçamento'}
              </h1>
              <span className="font-mono text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                {quoteNumber}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Preencha os dados do cliente, adicione produtos e defina prazos e pagamentos
            </p>
          </div>
        </div>

        {/* Quick Save CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Orçamento</span>
          </button>
        </div>
      </div>

      {/* 4-Step Progress Navigation Header */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-2">
        
        <button
          onClick={() => setActiveStep(1)}
          className={`flex items-center gap-2.5 p-3 rounded-lg text-left transition-colors cursor-pointer ${
            activeStep === 1 
              ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
            activeStep === 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            1
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold truncate">Dados do Cliente</div>
            <div className="text-[11px] text-slate-500 truncate">
              {custName ? custName : 'Identificação'}
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveStep(2)}
          className={`flex items-center gap-2.5 p-3 rounded-lg text-left transition-colors cursor-pointer ${
            activeStep === 2 
              ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
            activeStep === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            2
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold truncate">Produtos & Serviços</div>
            <div className="text-[11px] text-slate-500 truncate">
              {items.length} item(ns) ({formatCurrency(totals.netTotal)})
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveStep(3)}
          className={`flex items-center gap-2.5 p-3 rounded-lg text-left transition-colors cursor-pointer ${
            activeStep === 3 
              ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
            activeStep === 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            3
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold truncate">Pagamento & Prazos</div>
            <div className="text-[11px] text-slate-500 truncate">
              {paymentMethod}
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveStep(4)}
          className={`flex items-center gap-2.5 p-3 rounded-lg text-left transition-colors cursor-pointer ${
            activeStep === 4 
              ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
            activeStep === 4 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            4
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold truncate">Observações & Resumo</div>
            <div className="text-[11px] text-slate-500 truncate">
              Garantia e revisão
            </div>
          </div>
        </button>

      </div>

      {/* --- STEP 1: DADOS DO CLIENTE & INFORMAÇÕES GERAIS --- */}
      {activeStep === 1 && (
        <div className="space-y-6">
          
          {/* General Quote Info */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              Informações da Proposta
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título / Descrição do Projeto
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Instalação de CFTV 4 Câmeras + Fechadura Digital"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Inicial
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as QuoteStatus)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                >
                  <option value="draft">Rascunho</option>
                  <option value="sent">Enviado</option>
                  <option value="pending">Aguardando Resposta</option>
                  <option value="approved">Aprovado</option>
                  <option value="rejected">Recusado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Customer Selection or Creation */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  Dados do Cliente
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selecione um cliente já cadastrado ou preencha diretamente os dados
                </p>
              </div>

              {/* Toggle Existing vs New */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setIsNewCustomer(false)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    !isNewCustomer ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Selecionar Cadastrado
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsNewCustomer(true);
                    setSelectedCustomerId('');
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    isNewCustomer ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Novo Cliente
                </button>
              </div>
            </div>

            {/* Quick Customer Picker */}
            {!isNewCustomer && customers.length > 0 && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Buscar e Selecionar Cliente Existente:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {customers.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectCustomer(c)}
                      className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                        selectedCustomerId === c.id
                          ? 'border-blue-500 bg-blue-50/70 text-blue-950 font-semibold ring-1 ring-blue-500'
                          : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{c.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{c.phone}</div>
                      {c.address?.city && (
                        <div className="text-[10px] text-slate-400 truncate">
                          {c.address.city}/{c.address.state}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              
              {/* Nome */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome do Cliente / Empresa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="Nome completo ou Razão Social"
                  className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 ${
                    errors.custName ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
                {errors.custName && (
                  <span className="text-xs text-rose-600 mt-1 block">{errors.custName}</span>
                )}
              </div>

              {/* CPF / CNPJ */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CPF / CNPJ (Opcional)
                </label>
                <input
                  type="text"
                  value={custDocument}
                  onChange={(e) => setCustDocument(maskCpfCnpj(e.target.value))}
                  placeholder="000.000.000-00 ou 00.000.000/0001-00"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              {/* Telefone / WhatsApp */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Telefone / WhatsApp <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={custPhone}
                  onChange={(e) => setCustPhone(maskPhone(e.target.value))}
                  placeholder="(11) 99999-9999"
                  className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 ${
                    errors.custPhone ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
                {errors.custPhone && (
                  <span className="text-xs text-rose-600 mt-1 block">{errors.custPhone}</span>
                )}
              </div>

              {/* E-mail */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  E-mail (Opcional)
                </label>
                <input
                  type="email"
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  placeholder="cliente@email.com"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              {/* Endereço - CEP */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CEP
                </label>
                <input
                  type="text"
                  value={custZip}
                  onChange={(e) => setCustZip(maskCep(e.target.value))}
                  placeholder="00000-000"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              {/* Endereço - Rua */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Endereço / Rua
                </label>
                <input
                  type="text"
                  value={custStreet}
                  onChange={(e) => setCustStreet(e.target.value)}
                  placeholder="Rua / Avenida de instalação"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              {/* Número */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Número
                </label>
                <input
                  type="text"
                  value={custNumber}
                  onChange={(e) => setCustNumber(e.target.value)}
                  placeholder="Ex: 120"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              {/* Complemento */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Complemento
                </label>
                <input
                  type="text"
                  value={custComplement}
                  onChange={(e) => setCustComplement(e.target.value)}
                  placeholder="Apto, Bloco, Galpão..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              {/* Bairro */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bairro
                </label>
                <input
                  type="text"
                  value={custNeighborhood}
                  onChange={(e) => setCustNeighborhood(e.target.value)}
                  placeholder="Bairro"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              {/* Cidade / UF */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={custCity}
                    onChange={(e) => setCustCity(e.target.value)}
                    placeholder="Cidade"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    UF
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={custState}
                    onChange={(e) => setCustState(e.target.value.toUpperCase())}
                    placeholder="SP"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 uppercase"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Step 1 Footer CTA */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <span>Avançar para Produtos & Serviços</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* --- STEP 2: PRODUTOS, SERVIÇOS & QUANTIDADES --- */}
      {activeStep === 2 && (
        <div className="space-y-6">
          
          {/* Item Catalog Picker */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  Adicionar Equipamentos & Serviços do Catálogo
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Clique para adicionar rapidamente ao orçamento
                </p>
              </div>

              {/* Catalog quick filters */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCatalogTab('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    catalogTab === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setCatalogTab('products')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    catalogTab === 'products' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Produtos
                </button>
                <button
                  type="button"
                  onClick={() => setCatalogTab('services')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    catalogTab === 'services' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Mão de Obra
                </button>
              </div>
            </div>

            {/* Search and Category Filter */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar no catálogo (ex: Câmera, DVR, HD, Instalação, Cabo)..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={catalogCategory}
                onChange={(e) => setCatalogCategory(e.target.value)}
                className="px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-700"
              >
                <option value="all">Todas Categorias</option>
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {filteredCatalog.map((item) => {
                const isProduct = item.itemType === 'product';
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleAddItem(item as any, item.itemType)}
                    className="flex flex-col justify-between text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/40 transition-all cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          isProduct ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {isProduct ? 'Produto' : 'Serviço'}
                        </span>
                        {'sku' in item && item.sku && (
                          <span className="text-[10px] font-mono text-slate-400">{item.sku}</span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-slate-900 mt-1.5 line-clamp-1 group-hover:text-blue-600">
                        {item.name}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-800">
                        {formatCurrency(item.unitPrice)}
                        <span className="text-[10px] font-normal text-slate-500">/{item.unit}</span>
                      </span>
                      <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                        + Adicionar
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Add Custom Item buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500 font-medium">Item avulso:</span>
              <button
                type="button"
                onClick={() => handleAddCustomItem('product')}
                className="inline-flex items-center gap-1 text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Produto Avulso</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddCustomItem('service')}
                className="inline-flex items-center gap-1 text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Serviço Avulso</span>
              </button>
            </div>

          </div>

          {/* Current Items Table in Quote */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Itens Inclusos no Orçamento ({items.length})
              </h2>
              {errors.items && (
                <span className="text-xs text-rose-600 font-semibold">{errors.items}</span>
              )}
            </div>

            {items.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-300">
                <Package className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700">Nenhum item adicionado ainda</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Use o catálogo acima para adicionar produtos ou serviços à proposta.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Tipo / Item</th>
                      <th className="py-2.5 px-3 w-20 text-center">Qtd</th>
                      <th className="py-2.5 px-3 w-28 text-right">Unitário (R$)</th>
                      <th className="py-2.5 px-3 w-24 text-right">Desc. (R$)</th>
                      <th className="py-2.5 px-3 w-28 text-right">Subtotal</th>
                      <th className="py-2.5 px-2 w-10 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                        
                        {/* Nome / Descrição */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0 ${
                              item.type === 'product' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                            }`}>
                              {item.type === 'product' ? 'Prod' : 'Serv'}
                            </span>
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => handleUpdateItem(item.id, { name: e.target.value })}
                              className="font-medium text-slate-900 text-xs bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded p-1 w-full"
                            />
                          </div>
                          {item.description && (
                            <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 pl-8">
                              {item.description}
                            </div>
                          )}
                        </td>

                        {/* Quantidade */}
                        <td className="py-2.5 px-3">
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                            className="w-16 text-center py-1 px-1 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:ring-1 focus:ring-blue-500 text-xs"
                          />
                        </td>

                        {/* Preço Unitário */}
                        <td className="py-2.5 px-3 text-right">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.unitPrice}
                            onChange={(e) => handleUpdateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                            className="w-24 text-right py-1 px-1.5 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:ring-1 focus:ring-blue-500 text-xs"
                          />
                        </td>

                        {/* Desconto no Item */}
                        <td className="py-2.5 px-3 text-right">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.discount || 0}
                            onChange={(e) => handleUpdateItem(item.id, { discount: parseFloat(e.target.value) || 0 })}
                            className="w-20 text-right py-1 px-1 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:ring-1 focus:ring-blue-500 text-xs text-rose-700"
                          />
                        </td>

                        {/* Subtotal Calculado */}
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900 text-xs">
                          {formatCurrency(item.subtotal)}
                        </td>

                        {/* Remover */}
                        <td className="py-2.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                            title="Remover item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Subtotals & Global Discount Card */}
            {items.length > 0 && (
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Subtotal Produtos:</span>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {formatCurrency(totals.subtotalProducts)}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium">Subtotal Mão de Obra:</span>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {formatCurrency(totals.subtotalServices)}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium">Desconto Global:</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={discountGlobal}
                        onChange={(e) => setDiscountGlobal(parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold text-rose-600"
                      />
                      <select
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value as 'fixed' | 'percentage')}
                        className="px-1.5 py-1 bg-white border border-slate-300 rounded text-xs text-slate-700"
                      >
                        <option value="fixed">R$</option>
                        <option value="percentage">%</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white p-2.5 rounded-lg flex flex-col justify-center">
                    <span className="text-[11px] text-slate-300 font-semibold uppercase">Total Geral</span>
                    <span className="text-base font-bold text-white tracking-tight">
                      {formatCurrency(totals.netTotal)}
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Step 2 Footer Navigation */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <span>Avançar para Pagamento & Prazos</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* --- STEP 3: FORMAS DE PAGAMENTO & PRAZOS --- */}
      {activeStep === 3 && (
        <div className="space-y-6">
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-5">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Condições Comerciais e Forma de Pagamento
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Defina como o cliente poderá realizar o pagamento
              </p>
            </div>

            {/* Payment Method Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'Pix', label: 'Pix à Vista' },
                { id: 'Cartão de Crédito', label: 'Cartão de Crédito' },
                { id: 'Cartão de Débito', label: 'Cartão de Débito' },
                { id: 'Boleto Bancário', label: 'Boleto Bancário' },
                { id: 'Dinheiro', label: 'Dinheiro' },
                { id: 'À Vista', label: 'À Vista Geral' },
                { id: 'Parcelado', label: 'Parcelado' },
                { id: 'Personalizado', label: 'Personalizado' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-3 rounded-lg border text-left text-xs font-semibold transition-all cursor-pointer ${
                    paymentMethod === m.id
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Installments / Downpayment Controls */}
            {(paymentMethod === 'Cartão de Crédito' || paymentMethod === 'Parcelado' || paymentMethod === 'Personalizado') && (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Número de Parcelas
                  </label>
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-900"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12, 18, 24].map((num) => (
                      <option key={num} value={num}>{num}x parcelas</option>
                    ))}
                  </select>
                </div>

                {paymentMethod === 'Personalizado' && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Valor da Entrada (R$)
                    </label>
                    <input
                      type="number"
                      step="10"
                      min="0"
                      value={downPayment}
                      onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
                      placeholder="Ex: 500.00"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-900"
                    />
                  </div>
                )}

                <div className="sm:col-span-1 flex flex-col justify-end">
                  <div className="text-[11px] text-slate-500 font-medium">
                    Valor por Parcela (estimado):
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {formatCurrency(
                      (Math.max(0, totals.netTotal - downPayment)) / Math.max(1, installments)
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Custom Payment Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Descrição da Condição de Pagamento (Como aparecerá no orçamento impresso):
              </label>
              <input
                type="text"
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="Ex: Entrada de R$ 500,00 no ato + 3 parcelas de R$ 300,00 no cartão"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium text-slate-900"
              />
            </div>

            {/* Deadlines and Validity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Validade da Proposta (em dias corridos)
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={validityDays}
                  onChange={(e) => setValidityDays(parseInt(e.target.value) || 15)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Prazo de Execução / Instalação
                </label>
                <input
                  type="text"
                  value={executionDeadline}
                  onChange={(e) => setExecutionDeadline(e.target.value)}
                  placeholder="Ex: 3 dias úteis após aprovação"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

          </div>

          {/* Step 3 Footer Navigation */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(4)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <span>Avançar para Observações & Revisão</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* --- STEP 4: OBSERVAÇÕES, TERMOS DE GARANTIA & REVISÃO --- */}
      {activeStep === 4 && (
        <div className="space-y-6">
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              Termos de Garantia e Observações Técnicas
            </h2>

            {/* Garantia */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Termos de Garantia dos Equipamentos e Mão de Obra
              </label>
              <textarea
                rows={2}
                value={warrantyTerms}
                onChange={(e) => setWarrantyTerms(e.target.value)}
                placeholder="Ex: 12 meses para equipamentos contra defeitos de fabricação e 90 dias para instalação..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>

            {/* Observações Gerais */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Observações Gerais / Condições do Serviço
              </label>
              <textarea
                rows={4}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Informações técnicas, infraestrutura, materiais não inclusos..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 font-mono"
              />
            </div>
          </div>

          {/* Quick Review Summary Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              Resumo Final da Proposta
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800">Cliente:</span> {custName || 'Não preenchido'}
                <div><span className="text-slate-500">Telefone:</span> {custPhone}</div>
                {custStreet && <div><span className="text-slate-500">Endereço:</span> {custStreet}, {custNumber} - {custNeighborhood}, {custCity}/{custState}</div>}
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800">Pagamento:</span> {customDescription || paymentMethod}
                <div><span className="text-slate-500">Prazo:</span> {executionDeadline}</div>
                <div><span className="text-slate-500">Validade:</span> {validityDays} dias</div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Total Líquido da Proposta:</span>
                <div className="text-2xl font-bold text-white tracking-tight">
                  {formatCurrency(totals.netTotal)}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {items.length} itens ({totals.subtotalProducts > 0 ? `Produtos: ${formatCurrency(totals.subtotalProducts)}` : ''} | {totals.subtotalServices > 0 ? `Serviços: ${formatCurrency(totals.subtotalServices)}` : ''})
                </div>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Salvar e Gerar Orçamento</span>
              </button>
            </div>
          </div>

          {/* Step 4 Footer Navigation */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Voltar
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
