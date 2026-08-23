import React, { useState } from 'react';
import { CompanySettings } from '../../types';
import { maskPhone, maskCpfCnpj, maskCep } from '../../utils/masks';
import { 
  Building2, 
  ShieldCheck, 
  Save, 
  Check, 
  RotateCcw, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  FileText,
  Palette
} from 'lucide-react';

interface SettingsViewProps {
  settings: CompanySettings;
  onSaveSettings: (settings: CompanySettings) => void;
  onResetDemoData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onResetDemoData,
}) => {
  const [formData, setFormData] = useState<CompanySettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [confirmResetModal, setConfirmResetModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Configurações da Empresa & Proposta
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Personalize a identidade da sua empresa e os textos padrão dos orçamentos
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Configurações salvas com sucesso!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Identificação da Empresa */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Dados Cadastrais da Empresa
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Razão Social
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Razão Social completa"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nome Fantasia / Marca no Cabeçalho
              </label>
              <input
                type="text"
                value={formData.tradingName}
                onChange={(e) => setFormData({ ...formData, tradingName: e.target.value })}
                placeholder="Ex: SecurTech Segurança Eletrônica"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                CNPJ / CPF
              </label>
              <input
                type="text"
                value={formData.document}
                onChange={(e) => setFormData({ ...formData, document: maskCpfCnpj(e.target.value) })}
                placeholder="00.000.000/0001-00"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Telefone Principal
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: maskPhone(e.target.value) })}
                placeholder="(11) 3456-7890"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                WhatsApp Comercial
              </label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: maskPhone(e.target.value) })}
                placeholder="(11) 98765-4321"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                E-mail Comercial
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contato@empresa.com.br"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
          </div>

          {/* Endereço */}
          <div className="border-t border-slate-100 pt-3 text-xs space-y-3">
            <span className="font-bold text-slate-700 block">Endereço da Empresa:</span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">CEP</label>
                <input
                  type="text"
                  value={formData.address?.zipCode || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, zipCode: maskCep(e.target.value) }
                  })}
                  placeholder="00000-000"
                  className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-600 mb-1">Rua / Logradouro</label>
                <input
                  type="text"
                  value={formData.address?.street || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value }
                  })}
                  placeholder="Rua / Avenida"
                  className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Número</label>
                <input
                  type="text"
                  value={formData.address?.number || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, number: e.target.value }
                  })}
                  placeholder="123"
                  className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Bairro</label>
                <input
                  type="text"
                  value={formData.address?.neighborhood || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, neighborhood: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Cidade</label>
                <input
                  type="text"
                  value={formData.address?.city || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">UF</label>
                <input
                  type="text"
                  maxLength={2}
                  value={formData.address?.state || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, state: e.target.value.toUpperCase() }
                  })}
                  className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 uppercase"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Chave Pix para Recebimento */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Dados para Pagamento via Pix
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tipo da Chave Pix
              </label>
              <select
                value={formData.pixKeyType || 'CNPJ'}
                onChange={(e) => setFormData({ ...formData, pixKeyType: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900"
              >
                <option value="CNPJ">CNPJ</option>
                <option value="CPF">CPF</option>
                <option value="Email">E-mail</option>
                <option value="Telefone">Telefone / WhatsApp</option>
                <option value="Aleatória">Chave Aleatória (EVP)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Chave Pix
              </label>
              <input
                type="text"
                value={formData.pixKey || ''}
                onChange={(e) => {
                  let val = e.target.value;
                  if (formData.pixKeyType === 'CPF' || formData.pixKeyType === 'CNPJ') {
                    val = maskCpfCnpj(val);
                  } else if (formData.pixKeyType === 'Telefone') {
                    val = maskPhone(val);
                  }
                  setFormData({ ...formData, pixKey: val });
                }}
                placeholder="Informe sua chave Pix para aparecer no orçamento impresso"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Padrões Automáticos de Proposta */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-5 h-5 text-purple-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Textos e Prazos Padrão para Novos Orçamentos
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Validade Padrão do Orçamento (Dias corridos)
              </label>
              <input
                type="number"
                min="1"
                max="90"
                value={formData.defaultValidityDays}
                onChange={(e) => setFormData({ ...formData, defaultValidityDays: parseInt(e.target.value) || 15 })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Prazo Padrão de Execução
              </label>
              <input
                type="text"
                value={formData.defaultExecutionDeadline}
                onChange={(e) => setFormData({ ...formData, defaultExecutionDeadline: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="text-xs space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Termo de Garantia Padrão
              </label>
              <textarea
                rows={2}
                value={formData.defaultWarranty}
                onChange={(e) => setFormData({ ...formData, defaultWarranty: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Observações Técnicas e Condições Gerais Padrão
              </label>
              <textarea
                rows={4}
                value={formData.defaultObservations}
                onChange={(e) => setFormData({ ...formData, defaultObservations: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Texto de Rodapé da Proposta
              </label>
              <input
                type="text"
                value={formData.footerNotes}
                onChange={(e) => setFormData({ ...formData, footerNotes: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          
          <button
            type="button"
            onClick={() => setConfirmResetModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar dados iniciais de demonstração</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer w-full sm:w-auto justify-center"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Configurações</span>
          </button>

        </div>

      </form>

      {/* Confirmation Modal for Resetting Demo Data */}
      {confirmResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Restaurar Dados de Demonstração?
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Isso recarregará o catálogo completo de equipamentos de segurança, serviços e orçamentos de exemplo.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmResetModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetDemoData();
                  setConfirmResetModal(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
              >
                Sim, Restaurar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
