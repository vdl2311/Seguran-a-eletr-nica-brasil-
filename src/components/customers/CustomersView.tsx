import React, { useState, useMemo } from 'react';
import { Customer, Quote } from '../../types';
import { maskPhone, maskCpfCnpj, maskCep } from '../../utils/masks';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Users, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  FileText,
  X,
  FilePlus2
} from 'lucide-react';

interface CustomersViewProps {
  customers: Customer[];
  quotes: Quote[];
  onAddCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateCustomer: (id: string, updates: Partial<Customer>) => void;
  onDeleteCustomer: (id: string) => void;
  onNewQuoteForCustomer: (customer: Customer) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  quotes,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  onNewQuoteForCustomer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');
  const [zipCode, setZipCode] = useState('');
  const [notes, setNotes] = useState('');

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const term = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(term) ||
        c.phone.toLowerCase().includes(term) ||
        (c.document && c.document.toLowerCase().includes(term)) ||
        (c.email && c.email.toLowerCase().includes(term)) ||
        (c.address?.city && c.address.city.toLowerCase().includes(term))
      );
    });
  }, [customers, searchTerm]);

  const openModal = (cust?: Customer) => {
    if (cust) {
      setEditingCustomer(cust);
      setName(cust.name);
      setDocument(cust.document || '');
      setPhone(cust.phone);
      setEmail(cust.email || '');
      setStreet(cust.address?.street || '');
      setNumber(cust.address?.number || '');
      setComplement(cust.address?.complement || '');
      setNeighborhood(cust.address?.neighborhood || '');
      setCity(cust.address?.city || '');
      setState(cust.address?.state || 'SP');
      setZipCode(cust.address?.zipCode || '');
      setNotes(cust.notes || '');
    } else {
      setEditingCustomer(null);
      setName('');
      setDocument('');
      setPhone('');
      setEmail('');
      setStreet('');
      setNumber('');
      setComplement('');
      setNeighborhood('');
      setCity('São Paulo');
      setState('SP');
      setZipCode('');
      setNotes('');
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const customerData = {
      name: name.trim(),
      document: document.trim() || undefined,
      phone: phone.trim(),
      email: email.trim() || undefined,
      address: {
        street: street.trim(),
        number: number.trim(),
        complement: complement.trim() || undefined,
        neighborhood: neighborhood.trim(),
        city: city.trim(),
        state: state.trim(),
        zipCode: zipCode.trim() || undefined,
      },
      notes: notes.trim() || undefined,
    };

    if (editingCustomer) {
      onUpdateCustomer(editingCustomer.id, customerData);
    } else {
      onAddCustomer(customerData);
    }

    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      onDeleteCustomer(customerToDelete.id);
      setCustomerToDelete(null);
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Base de Clientes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Gerencie contatos, empresas e locais de atendimento para orçamentos
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Novo Cliente</span>
        </button>
      </div>

      {/* Search Filter Strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, telefone, CPF/CNPJ, e-mail ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>
      </div>

      {/* Customers List Grid / Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">Nenhum cliente encontrado</p>
            <button
              onClick={() => openModal()}
              className="mt-3 text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              + Cadastrar cliente agora
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Cliente / Documento</th>
                  <th className="py-3 px-4">Contato</th>
                  <th className="py-3 px-4">Endereço de Instalação</th>
                  <th className="py-3 px-4 text-center">Histórico</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCustomers.map((c) => {
                  const clientQuotes = quotes.filter((q) => q.customer?.id === c.id || q.customer?.name === c.name);

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      
                      {/* Nome e Documento */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{c.name}</span>
                        </div>
                        {c.document && (
                          <div className="text-xs font-mono text-slate-500 mt-0.5">
                            Doc: {c.document}
                          </div>
                        )}
                        {c.notes && (
                          <div className="text-[11px] text-slate-400 mt-0.5 max-w-xs truncate">
                            {c.notes}
                          </div>
                        )}
                      </td>

                      {/* Contato */}
                      <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                        <div className="flex items-center gap-1 text-slate-800 font-medium">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{c.phone}</span>
                        </div>
                        {c.email && (
                          <div className="flex items-center gap-1 text-slate-500 mt-0.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{c.email}</span>
                          </div>
                        )}
                      </td>

                      {/* Endereço */}
                      <td className="py-3.5 px-4 text-xs">
                        {c.address?.street ? (
                          <div className="text-slate-600">
                            <div>{c.address.street}, {c.address.number}</div>
                            <div className="text-[11px] text-slate-400">
                              {c.address.neighborhood} - {c.address.city}/{c.address.state}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Não informado</span>
                        )}
                      </td>

                      {/* Histórico de Orçamentos */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                          <FileText className="w-3 h-3 text-slate-500" />
                          <span>{clientQuotes.length} orçamento(s)</span>
                        </span>
                      </td>

                      {/* Ações */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          
                          {/* Criar orçamento para este cliente */}
                          <button
                            onClick={() => onNewQuoteForCustomer(c)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer mr-1"
                            title="Criar novo orçamento para este cliente"
                          >
                            <FilePlus2 className="w-3.5 h-3.5" />
                            <span>+ Orçar</span>
                          </button>

                          {/* Editar */}
                          <button
                            onClick={() => openModal(c)}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                            title="Editar cliente"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Excluir */}
                          <button
                            onClick={() => setCustomerToDelete(c)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                            title="Excluir cliente"
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
        )}
      </div>

      {/* --- MODAL: CLIENTE --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingCustomer ? 'Editar Dados do Cliente' : 'Cadastrar Novo Cliente'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome do Cliente / Empresa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome completo ou Razão Social"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Telefone / WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(maskPhone(e.target.value))}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    CPF / CNPJ
                  </label>
                  <input
                    type="text"
                    value={document}
                    onChange={(e) => setDocument(maskCpfCnpj(e.target.value))}
                    placeholder="000.000.000-00 ou 00.000.000/0001-00"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cliente@email.com"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              <div className="border-t border-slate-100 pt-3">
                <span className="font-bold text-slate-700 block mb-2">Endereço de Atendimento / Instalação:</span>
                
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">CEP</label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(maskCep(e.target.value))}
                      placeholder="00000-000"
                      className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-600 mb-1">Rua / Logradouro</label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Rua das Câmeras"
                      className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-3">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Número</label>
                    <input
                      type="text"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="123"
                      className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Complemento</label>
                    <input
                      type="text"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      placeholder="Apto 12"
                      className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Bairro</label>
                    <input
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Centro"
                      className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Cidade / UF</label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="São Paulo"
                        className="w-full px-2 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        maxLength={2}
                        value={state}
                        onChange={(e) => setState(e.target.value.toUpperCase())}
                        placeholder="SP"
                        className="w-12 px-1 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 uppercase text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Observações Internas sobre o Cliente
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Instruções de acesso, horários preferenciais, preferências técnicas..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CONFIRM DELETE MODAL --- */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Confirmar Exclusão de Cliente
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Deseja realmente remover o cadastro de <strong className="text-slate-900">"{customerToDelete.name}"</strong>?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setCustomerToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
