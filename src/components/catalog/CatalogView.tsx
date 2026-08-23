import React, { useState, useMemo } from 'react';
import { Product, Service, ProductCategory, ServiceCategory } from '../../types';
import { formatCurrency } from '../../services/calculations';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Package, 
  Wrench, 
  Tag, 
  CheckCircle2, 
  XCircle,
  X,
  Layers
} from 'lucide-react';

interface CatalogViewProps {
  products: Product[];
  services: Service[];
  onAddProduct: (prod: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  onAddService: (serv: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateService: (id: string, updates: Partial<Service>) => void;
  onDeleteService: (id: string) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  services,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddService,
  onUpdateService,
  onDeleteService,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'product' | 'service'; name: string } | null>(null);

  // Product Form state
  const [prodName, setProdName] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodCategory, setProdCategory] = useState<ProductCategory>('CFTV & Câmeras');
  const [prodSku, setProdSku] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(0);
  const [prodUnit, setProdUnit] = useState<Product['unit']>('un');
  const [prodActive, setProdActive] = useState(true);

  // Service Form state
  const [servName, setServName] = useState('');
  const [servDescription, setServDescription] = useState('');
  const [servCategory, setServCategory] = useState<ServiceCategory>('Instalação');
  const [servPrice, setServPrice] = useState<number>(0);
  const [servUnit, setServUnit] = useState<Service['unit']>('ponto');
  const [servActive, setServActive] = useState(true);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
      const matchStatus = statusFilter === 'all' || (statusFilter === 'active' ? p.active : !p.active);
      return matchSearch && matchCat && matchStatus;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  // Filtered Services
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = categoryFilter === 'all' || s.category === categoryFilter;
      const matchStatus = statusFilter === 'all' || (statusFilter === 'active' ? s.active : !s.active);
      return matchSearch && matchCat && matchStatus;
    });
  }, [services, searchTerm, categoryFilter, statusFilter]);

  // Product Categories
  const productCategories: ProductCategory[] = [
    'CFTV & Câmeras',
    'Gravadores & Armazenamento',
    'Controle de Acesso',
    'Alarmes & Sensores',
    'Cerca Elétrica',
    'Cabeamento & Conexões',
    'Fechaduras & Interfonia',
    'Redes & Conectividade',
    'Energia & Fontes',
    'Outros',
  ];

  // Service Categories
  const serviceCategories: ServiceCategory[] = [
    'Instalação',
    'Configuração',
    'Manutenção',
    'Infraestrutura & Passagem de Cabos',
    'Suporte Técnico',
    'Outros',
  ];

  // Open Product Modal for Create or Edit
  const openProductModal = (prod?: Product) => {
    if (prod) {
      setEditingProduct(prod);
      setProdName(prod.name);
      setProdDescription(prod.description);
      setProdCategory(prod.category);
      setProdSku(prod.sku || '');
      setProdPrice(prod.unitPrice);
      setProdUnit(prod.unit);
      setProdActive(prod.active);
    } else {
      setEditingProduct(null);
      setProdName('');
      setProdDescription('');
      setProdCategory('CFTV & Câmeras');
      setProdSku('');
      setProdPrice(0);
      setProdUnit('un');
      setProdActive(true);
    }
    setIsProductModalOpen(true);
  };

  // Open Service Modal for Create or Edit
  const openServiceModal = (serv?: Service) => {
    if (serv) {
      setEditingService(serv);
      setServName(serv.name);
      setServDescription(serv.description);
      setServCategory(serv.category);
      setServPrice(serv.price);
      setServUnit(serv.unit);
      setServActive(serv.active);
    } else {
      setEditingService(null);
      setServName('');
      setServDescription('');
      setServCategory('Instalação');
      setServPrice(0);
      setServUnit('ponto');
      setServActive(true);
    }
    setIsServiceModalOpen(true);
  };

  // Save Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    if (editingProduct) {
      onUpdateProduct(editingProduct.id, {
        name: prodName.trim(),
        description: prodDescription.trim(),
        category: prodCategory,
        sku: prodSku.trim() || undefined,
        unitPrice: Number(prodPrice) || 0,
        unit: prodUnit,
        active: prodActive,
      });
    } else {
      onAddProduct({
        name: prodName.trim(),
        description: prodDescription.trim(),
        category: prodCategory,
        sku: prodSku.trim() || undefined,
        unitPrice: Number(prodPrice) || 0,
        unit: prodUnit,
        active: prodActive,
      });
    }
    setIsProductModalOpen(false);
  };

  // Save Service
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!servName.trim()) return;

    if (editingService) {
      onUpdateService(editingService.id, {
        name: servName.trim(),
        description: servDescription.trim(),
        category: servCategory,
        price: Number(servPrice) || 0,
        unit: servUnit,
        active: servActive,
      });
    } else {
      onAddService({
        name: servName.trim(),
        description: servDescription.trim(),
        category: servCategory,
        price: Number(servPrice) || 0,
        unit: servUnit,
        active: servActive,
      });
    }
    setIsServiceModalOpen(false);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'product') {
        onDeleteProduct(itemToDelete.id);
      } else {
        onDeleteService(itemToDelete.id);
      }
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Catálogo de Produtos & Serviços
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cadastre e precifique equipamentos de segurança e tabelas de mão de obra
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'products' ? (
            <button
              onClick={() => openProductModal()}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Novo Produto</span>
            </button>
          ) : (
            <button
              onClick={() => openServiceModal()}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Novo Serviço</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Switcher & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        
        {/* Tab switcher: Produtos vs Serviços */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveTab('products'); setCategoryFilter('all'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-blue-50 text-blue-900 border border-blue-200 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Produtos & Equipamentos ({products.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('services'); setCategoryFilter('all'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Serviços & Mão de Obra ({services.length})</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={activeTab === 'products' ? "Buscar por produto, descrição ou SKU..." : "Buscar por serviço ou descrição..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-700"
            >
              <option value="all">Todas as Categorias</option>
              {(activeTab === 'products' ? productCategories : serviceCategories).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {activeTab === 'products' ? (
          filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">Nenhum produto encontrado</p>
              <button
                onClick={() => openProductModal()}
                className="mt-3 text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                + Cadastrar novo produto
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Produto / Descrição</th>
                    <th className="py-3 px-4">Categoria</th>
                    <th className="py-3 px-4">Código / SKU</th>
                    <th className="py-3 px-4 text-right">Preço de Venda</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{p.name}</div>
                        {p.description && (
                          <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{p.description}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-medium">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-500 whitespace-nowrap">
                        {p.sku || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                        {formatCurrency(p.unitPrice)}
                        <span className="text-xs font-normal text-slate-500">/{p.unit}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          p.active ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${p.active ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                          {p.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openProductModal(p)}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                            title="Editar produto"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setItemToDelete({ id: p.id, type: 'product', name: p.name })}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                            title="Excluir produto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          filteredServices.length === 0 ? (
            <div className="p-12 text-center">
              <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">Nenhum serviço encontrado</p>
              <button
                onClick={() => openServiceModal()}
                className="mt-3 text-xs font-semibold text-emerald-600 hover:underline cursor-pointer"
              >
                + Cadastrar novo serviço
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Serviço Técnico / Descrição</th>
                    <th className="py-3 px-4">Categoria</th>
                    <th className="py-3 px-4 text-right">Valor Padrão</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredServices.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{s.name}</div>
                        {s.description && (
                          <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{s.description}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                        <span className="bg-emerald-50 text-emerald-800 px-2 py-1 rounded-md font-medium">
                          {s.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                        {formatCurrency(s.price)}
                        <span className="text-xs font-normal text-slate-500">/{s.unit}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          s.active ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.active ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                          {s.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openServiceModal(s)}
                            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                            title="Editar serviço"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setItemToDelete({ id: s.id, type: 'service', name: s.name })}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                            title="Excluir serviço"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* --- MODAL: PRODUTO --- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingProduct ? 'Editar Equipamento / Produto' : 'Cadastrar Novo Produto'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome do Produto <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Ex: Câmera Dome Full HD 1080p Infravermelho 20m"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                  >
                    {productCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Código / SKU (Opcional)
                  </label>
                  <input
                    type="text"
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    placeholder="CAM-DOM-1080P"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Preço de Venda (R$) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(parseFloat(e.target.value) || 0)}
                    placeholder="189.90"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Unidade de Medida
                  </label>
                  <select
                    value={prodUnit}
                    onChange={(e) => setProdUnit(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                  >
                    <option value="un">un (Unidade)</option>
                    <option value="kit">kit (Kit Completo)</option>
                    <option value="metro">metro (Metro Linear)</option>
                    <option value="rolo">rolo (Rolo/Bobina)</option>
                    <option value="par">par (Par)</option>
                    <option value="caixa">caixa (Caixa)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Descrição / Especificações Técnicas
                </label>
                <textarea
                  rows={3}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  placeholder="Detalhes técnicos, resolução, alcance de visão noturna, compatibilidade..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="prodActiveCheckbox"
                  checked={prodActive}
                  onChange={(e) => setProdActive(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="prodActiveCheckbox" className="text-slate-700 font-medium cursor-pointer">
                  Produto ativo para seleção em orçamentos
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: SERVIÇO --- */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingService ? 'Editar Serviço / Mão de Obra' : 'Cadastrar Novo Serviço'}
              </h3>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome do Serviço <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={servName}
                  onChange={(e) => setServName(e.target.value)}
                  placeholder="Ex: Instalação e Fixação de Câmera CFTV em Ponto Alto"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={servCategory}
                    onChange={(e) => setServCategory(e.target.value as ServiceCategory)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  >
                    {serviceCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Unidade de Cobrança
                  </label>
                  <select
                    value={servUnit}
                    onChange={(e) => setServUnit(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  >
                    <option value="ponto">ponto (Por Ponto Instalado)</option>
                    <option value="serviço">serviço (Serviço Fechado)</option>
                    <option value="hora">hora (Hora Técnica)</option>
                    <option value="visita">visita (Visita Técnica)</option>
                    <option value="metro">metro (Por Metro Linear)</option>
                    <option value="un">un (Unidade)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Valor Padrão (R$) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={servPrice}
                  onChange={(e) => setServPrice(parseFloat(e.target.value) || 0)}
                  placeholder="90.00"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Descrição do Serviço e Escopo de Trabalho
                </label>
                <textarea
                  rows={3}
                  value={servDescription}
                  onChange={(e) => setServDescription(e.target.value)}
                  placeholder="O que está incluso na mão de obra, testes, calibração..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="servActiveCheckbox"
                  checked={servActive}
                  onChange={(e) => setServActive(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="servActiveCheckbox" className="text-slate-700 font-medium cursor-pointer">
                  Serviço ativo para seleção em orçamentos
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
                >
                  Salvar Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CONFIRM DELETE MODAL --- */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Confirmar Exclusão
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Deseja realmente excluir {itemToDelete.type === 'product' ? 'o produto' : 'o serviço'} <strong className="text-slate-900">"{itemToDelete.name}"</strong>?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setItemToDelete(null)}
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
