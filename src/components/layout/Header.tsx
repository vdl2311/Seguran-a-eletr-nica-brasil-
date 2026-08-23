import React, { useState } from 'react';
import { Plus, ShieldCheck, LayoutDashboard, FileText, Package, Users, Settings, Menu, X } from 'lucide-react';
import { CompanySettings } from '../../types';

export type ActiveTab = 'dashboard' | 'quotes' | 'catalog' | 'customers' | 'settings';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onNewQuote: () => void;
  settings: CompanySettings;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onNewQuote,
  settings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'quotes' as ActiveTab, label: 'Orçamentos', icon: FileText },
    { id: 'catalog' as ActiveTab, label: 'Catálogo', icon: Package },
    { id: 'customers' as ActiveTab, label: 'Clientes', icon: Users },
    { id: 'settings' as ActiveTab, label: 'Empresa', icon: Settings },
  ];

  const handleTabClick = (tab: ActiveTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          
          {/* Zone 1: Brand Title (single text element, one line) */}
          <div 
            onClick={() => handleTabClick('dashboard')}
            className="flex items-center gap-2 cursor-pointer shrink-0 select-none group min-w-0"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-inner group-hover:bg-blue-500 transition-colors shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white truncate max-w-[160px] sm:max-w-xs">
              {settings.tradingName || 'SecurQuote'}
            </span>
          </div>

          {/* Zone 2: Navigation Links (single line, hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-blue-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => {
                onNewQuote();
                setMobileMenuOpen(false);
              }}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-hidden"
              title="Criar Novo Orçamento"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span className="hidden xs:inline sm:inline">Novo Orçamento</span>
              <span className="xs:hidden sm:hidden">Orçar</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus-visible:outline-hidden cursor-pointer"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-3 pt-2 pb-4 space-y-1 shadow-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

