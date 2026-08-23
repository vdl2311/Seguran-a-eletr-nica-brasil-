/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Quote, 
  Product, 
  Service, 
  Customer, 
  CompanySettings, 
  QuoteStatus 
} from './types';
import { storage } from './services/storage';
import { Header, ActiveTab } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { QuoteList } from './components/quotes/QuoteList';
import { QuoteForm } from './components/quotes/QuoteForm';
import { QuotePreview } from './components/quotes/QuotePreview';
import { CatalogView } from './components/catalog/CatalogView';
import { CustomersView } from './components/customers/CustomersView';
import { SettingsView } from './components/settings/SettingsView';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function App() {
  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [viewMode, setViewMode] = useState<'normal' | 'quote-form' | 'quote-preview'>('normal');

  // Active items for editing/viewing
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  // Application Data State
  const [quotes, setQuotes] = useState<Quote[]>(() => storage.getQuotes());
  const [products, setProducts] = useState<Product[]>(() => storage.getProducts());
  const [services, setServices] = useState<Service[]>(() => storage.getServices());
  const [customers, setCustomers] = useState<Customer[]>(() => storage.getCustomers());
  const [settings, setSettings] = useState<CompanySettings>(() => storage.getSettings());

  // Toast Feedback State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Sync state on storage event updates
  const refreshData = () => {
    setQuotes(storage.getQuotes());
    setProducts(storage.getProducts());
    setServices(storage.getServices());
    setCustomers(storage.getCustomers());
    setSettings(storage.getSettings());
  };

  useEffect(() => {
    const handleStorageUpdate = () => {
      refreshData();
    };

    window.addEventListener('securquote_update', handleStorageUpdate);
    return () => window.removeEventListener('securquote_update', handleStorageUpdate);
  }, []);

  // --- QUOTE ACTIONS ---
  const handleStartNewQuote = (presetCustomer?: Customer) => {
    if (presetCustomer) {
      const draftWithCust: Quote = {
        id: '',
        quoteNumber: '',
        title: `Sistema de Segurança - ${presetCustomer.name}`,
        customer: presetCustomer,
        items: [],
        subtotalProducts: 0,
        subtotalServices: 0,
        discountGlobal: 0,
        discountType: 'fixed',
        total: 0,
        payment: { method: 'Pix', installments: 1 },
        validityDays: settings.defaultValidityDays || 15,
        executionDeadline: settings.defaultExecutionDeadline || '3 dias úteis após aprovação',
        warrantyTerms: settings.defaultWarranty || '',
        observations: settings.defaultObservations || '',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSelectedQuote(draftWithCust);
    } else {
      setSelectedQuote(null);
    }
    setViewMode('quote-form');
  };

  const handleEditQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setViewMode('quote-form');
  };

  const handleViewQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setViewMode('quote-preview');
  };

  const handleSaveQuote = (quoteData: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedQuote && selectedQuote.id) {
      const updated = storage.updateQuote(selectedQuote.id, quoteData);
      if (updated) {
        showToast(`Orçamento ${updated.quoteNumber} atualizado com sucesso!`);
        setSelectedQuote(updated);
        setViewMode('quote-preview');
      }
    } else {
      const created = storage.addQuote(quoteData);
      showToast(`Orçamento ${created.quoteNumber} criado com sucesso!`);
      setSelectedQuote(created);
      setViewMode('quote-preview');
    }
    refreshData();
  };

  const handleDuplicateQuote = (id: string) => {
    const duplicated = storage.duplicateQuote(id);
    if (duplicated) {
      showToast(`Orçamento duplicado como ${duplicated.quoteNumber}!`);
      refreshData();
    }
  };

  const handleDeleteQuote = (id: string) => {
    const success = storage.deleteQuote(id);
    if (success) {
      showToast('Orçamento excluído com sucesso.');
      refreshData();
      if (viewMode === 'quote-preview' && selectedQuote?.id === id) {
        setViewMode('normal');
      }
    }
  };

  const handleUpdateQuoteStatus = (id: string, status: QuoteStatus) => {
    const updated = storage.updateQuote(id, { status });
    if (updated) {
      if (selectedQuote?.id === id) {
        setSelectedQuote(updated);
      }
      showToast(`Status atualizado para: ${status}`);
      refreshData();
    }
  };

  // --- PRODUCT ACTIONS ---
  const handleAddProduct = (prod: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    storage.addProduct(prod);
    showToast(`Produto "${prod.name}" cadastrado com sucesso!`);
    refreshData();
  };

  const handleUpdateProduct = (id: string, updates: Partial<Product>) => {
    storage.updateProduct(id, updates);
    showToast('Produto atualizado com sucesso!');
    refreshData();
  };

  const handleDeleteProduct = (id: string) => {
    storage.deleteProduct(id);
    showToast('Produto removido do catálogo.');
    refreshData();
  };

  // --- SERVICE ACTIONS ---
  const handleAddService = (serv: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
    storage.addService(serv);
    showToast(`Serviço "${serv.name}" cadastrado com sucesso!`);
    refreshData();
  };

  const handleUpdateService = (id: string, updates: Partial<Service>) => {
    storage.updateService(id, updates);
    showToast('Serviço atualizado com sucesso!');
    refreshData();
  };

  const handleDeleteService = (id: string) => {
    storage.deleteService(id);
    showToast('Serviço removido do catálogo.');
    refreshData();
  };

  // --- CUSTOMER ACTIONS ---
  const handleAddCustomer = (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    storage.addCustomer(customer);
    showToast(`Cliente "${customer.name}" cadastrado com sucesso!`);
    refreshData();
  };

  const handleUpdateCustomer = (id: string, updates: Partial<Customer>) => {
    storage.updateCustomer(id, updates);
    showToast('Dados do cliente atualizados com sucesso!');
    refreshData();
  };

  const handleDeleteCustomer = (id: string) => {
    storage.deleteCustomer(id);
    showToast('Cliente removido da base.');
    refreshData();
  };

  // --- SETTINGS ACTIONS ---
  const handleSaveSettings = (newSettings: CompanySettings) => {
    storage.saveSettings(newSettings);
    setSettings(newSettings);
    showToast('Configurações da empresa salvas com sucesso!');
  };

  const handleResetDemoData = () => {
    storage.resetToDefaults();
    refreshData();
    showToast('Dados iniciais de demonstração restaurados com sucesso.');
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setViewMode('normal');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      
      {/* Header Top Bar */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        onNewQuote={() => handleStartNewQuote()}
        settings={settings}
      />

      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium ${
            toast.type === 'success'
              ? 'bg-slate-900 text-white border-slate-800'
              : toast.type === 'error'
              ? 'bg-rose-900 text-white border-rose-800'
              : 'bg-blue-900 text-white border-blue-800'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
            <span>{toast.message}</span>
            <button 
              onClick={() => setToast(null)}
              className="p-1 hover:bg-white/10 rounded transition-colors ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Conditional Rendering based on viewMode & activeTab */}
        {viewMode === 'quote-form' ? (
          <QuoteForm
            initialQuote={selectedQuote}
            customers={customers}
            products={products}
            services={services}
            settings={settings}
            existingQuotesCount={quotes.length}
            onSave={handleSaveQuote}
            onCancel={() => {
              if (selectedQuote && selectedQuote.id) {
                setViewMode('quote-preview');
              } else {
                setViewMode('normal');
              }
            }}
          />
        ) : viewMode === 'quote-preview' && selectedQuote ? (
          <QuotePreview
            quote={selectedQuote}
            settings={settings}
            onBack={() => setViewMode('normal')}
            onEdit={handleEditQuote}
            onUpdateStatus={handleUpdateQuoteStatus}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                quotes={quotes}
                onNewQuote={() => handleStartNewQuote()}
                onViewQuote={handleViewQuote}
                onEditQuote={handleEditQuote}
                onNavigateToQuotes={() => setActiveTab('quotes')}
                onUpdateStatus={handleUpdateQuoteStatus}
              />
            )}

            {activeTab === 'quotes' && (
              <QuoteList
                quotes={quotes}
                onNewQuote={() => handleStartNewQuote()}
                onViewQuote={handleViewQuote}
                onEditQuote={handleEditQuote}
                onDuplicateQuote={handleDuplicateQuote}
                onDeleteQuote={handleDeleteQuote}
                onUpdateStatus={handleUpdateQuoteStatus}
              />
            )}

            {activeTab === 'catalog' && (
              <CatalogView
                products={products}
                services={services}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                onAddService={handleAddService}
                onUpdateService={handleUpdateService}
                onDeleteService={handleDeleteService}
              />
            )}

            {activeTab === 'customers' && (
              <CustomersView
                customers={customers}
                quotes={quotes}
                onAddCustomer={handleAddCustomer}
                onUpdateCustomer={handleUpdateCustomer}
                onDeleteCustomer={handleDeleteCustomer}
                onNewQuoteForCustomer={(cust) => handleStartNewQuote(cust)}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                settings={settings}
                onSaveSettings={handleSaveSettings}
                onResetDemoData={handleResetDemoData}
              />
            )}
          </>
        )}

      </main>

      {/* Global Minimal Footer */}
      <footer className="print:hidden border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            {settings.tradingName || 'SecurQuote'} © {new Date().getFullYear()} - Sistema de Orçamentos para Segurança Eletrônica
          </span>
          <span className="text-[11px] text-slate-400">
            Ambiente de Produção MVP
          </span>
        </div>
      </footer>

    </div>
  );
}
