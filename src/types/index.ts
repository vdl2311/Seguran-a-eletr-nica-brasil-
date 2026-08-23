export type QuoteStatus = 
  | 'draft'      // Rascunho
  | 'sent'       // Enviado
  | 'pending'    // Aguardando resposta
  | 'approved'   // Aprovado
  | 'rejected'   // Recusado
  | 'expired';   // Expirado

export type ProductCategory = 
  | 'CFTV & Câmeras'
  | 'Gravadores & Armazenamento'
  | 'Controle de Acesso'
  | 'Alarmes & Sensores'
  | 'Cerca Elétrica'
  | 'Cabeamento & Conexões'
  | 'Fechaduras & Interfonia'
  | 'Redes & Conectividade'
  | 'Energia & Fontes'
  | 'Outros';

export type ServiceCategory = 
  | 'Instalação'
  | 'Configuração'
  | 'Manutenção'
  | 'Infraestrutura & Passagem de Cabos'
  | 'Suporte Técnico'
  | 'Outros';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  sku?: string;
  unitPrice: number;
  unit: 'un' | 'metro' | 'kit' | 'par' | 'rolo' | 'caixa';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  unit: 'un' | 'ponto' | 'hora' | 'visita' | 'metro' | 'serviço';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  document?: string; // CPF ou CNPJ
  phone: string;
  email?: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteItem {
  id: string;
  type: 'product' | 'service';
  itemId?: string; // Reference to product or service id if from catalog
  name: string;
  description?: string;
  category?: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  discount: number; // In currency value per unit or fixed total
  unit: string;
  subtotal: number;
}

export interface PaymentCondition {
  method: 'Pix' | 'Dinheiro' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Boleto Bancário' | 'À Vista' | 'Parcelado' | 'Personalizado';
  installments?: number;
  downPayment?: number; // Entrada em R$
  customDescription?: string; // Ex: "Entrada de R$ 500,00 + 3 parcelas de R$ 300,00"
}

export interface Quote {
  id: string;
  quoteNumber: string; // Ex: "ORC-2026-001"
  title: string; // Ex: "Sistema de CFTV Residencial 4 Câmeras"
  customer: Customer;
  items: QuoteItem[];
  subtotalProducts: number;
  subtotalServices: number;
  discountGlobal: number; // Desconto global adicional
  discountType: 'fixed' | 'percentage';
  total: number;
  payment: PaymentCondition;
  validityDays: number;
  executionDeadline: string; // Ex: "3 dias úteis após aprovação"
  warrantyTerms: string; // Ex: "12 meses para equipamentos e 90 dias para instalação"
  observations: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CompanySettings {
  name: string;
  tradingName: string;
  document: string; // CNPJ / CPF
  phone: string;
  whatsapp: string;
  email: string;
  website?: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  pixKey?: string;
  pixKeyType?: 'CPF' | 'CNPJ' | 'Email' | 'Telefone' | 'Aleatória';
  logoUrl?: string;
  primaryColor: string;
  defaultValidityDays: number;
  defaultWarranty: string;
  defaultExecutionDeadline: string;
  defaultObservations: string;
  footerNotes: string;
}

export interface DashboardStats {
  totalQuotes: number;
  openQuotes: number;
  approvedQuotes: number;
  rejectedQuotes: number;
  totalValue: number;
  approvedValue: number;
  conversionRate: number;
}
