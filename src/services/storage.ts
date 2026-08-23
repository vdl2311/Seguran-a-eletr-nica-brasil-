import { Product, Service, Customer, Quote, CompanySettings } from '../types';
import { calculateQuoteTotals } from './calculations';

const STORAGE_KEYS = {
  PRODUCTS: 'securquote_products',
  SERVICES: 'securquote_services',
  CUSTOMERS: 'securquote_customers',
  QUOTES: 'securquote_quotes',
  SETTINGS: 'securquote_settings',
};

export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  name: 'SecurTech Engenharia & Segurança Eletrônica',
  tradingName: 'SecurTech Segurança',
  document: '34.892.115/0001-40',
  phone: '(11) 3456-7890',
  whatsapp: '(11) 98765-4321',
  email: 'contato@securtechseguranca.com.br',
  website: 'www.securtechseguranca.com.br',
  address: {
    street: 'Av. Paulista',
    number: '1200',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
  },
  pixKey: '34.892.115/0001-40',
  pixKeyType: 'CNPJ',
  logoUrl: '',
  primaryColor: '#0f172a', // Slate 900
  defaultValidityDays: 15,
  defaultWarranty: '12 meses para equipamentos (contra defeitos de fabricação) e 90 dias para serviços de mão de obra e instalação.',
  defaultExecutionDeadline: 'Início em até 3 dias úteis após aprovação formal do orçamento.',
  defaultObservations: '• Valores com impostos inclusos para emissão de Nota Fiscal.\n• Necessário ponto de energia 110V/220V no local do gravador/central.\n• O cliente fornecerá acesso à internet no local para configuração do aplicativo de visualização remota no celular.\n• Qualquer alteração na infraestrutura predial durante a execução será comunicada previamente.',
  footerNotes: 'Agradecemos a preferência! SecurTech Segurança Eletrônica - Protegendo o que é mais importante para você.',
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Câmera Dome Full HD 1080p Infravermelho 20m',
    description: 'Câmera de segurança Dome Multi-HD 2MP, lente 2.8mm com visão noturna IR inteligente até 20m. Ideal para ambientes internos.',
    category: 'CFTV & Câmeras',
    sku: 'CAM-DOM-1080P',
    unitPrice: 169.90,
    unit: 'un',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Câmera Bullet Full HD 1080p IP67 Externa 30m',
    description: 'Câmera metálica resistente à chuva e poeira (IP67), lente 3.6mm, visão noturna até 30m para fachadas e garagens.',
    category: 'CFTV & Câmeras',
    sku: 'CAM-BUL-1080P',
    unitPrice: 198.50,
    unit: 'un',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    name: 'Câmera IP Wi-Fi 4MP com Detecção Inteligente de Pessoas',
    description: 'Câmera sem fio de alta resolução com áudio bidirecional, sirene integrada e slot para cartão microSD.',
    category: 'CFTV & Câmeras',
    sku: 'CAM-IP-WIFI4M',
    unitPrice: 349.00,
    unit: 'un',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    name: 'Gravador DVR 8 Canais 1080p Multi-HD com IA',
    description: 'DVR híbrido de 8 canais com suporte a reconhecimento facial, compressão H.265+ e aplicativo para smartphone.',
    category: 'Gravadores & Armazenamento',
    sku: 'DVR-MHD-08CH',
    unitPrice: 580.00,
    unit: 'un',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-5',
    name: 'HD Especial para CFTV 1TB WD Purple / SkyHawk',
    description: 'Disco rígido próprio para gravação contínua 24/7 sem interrupções e alta confiabilidade de dados.',
    category: 'Gravadores & Armazenamento',
    sku: 'HD-CFTV-1TB',
    unitPrice: 389.00,
    unit: 'un',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-6',
    name: 'HD Especial para CFTV 2TB WD Purple',
    description: 'Disco rígido de 2TB para gravação prolongada em alta resolução.',
    category: 'Gravadores & Armazenamento',
    sku: 'HD-CFTV-2TB',
    unitPrice: 520.00,
    unit: 'un',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-7',
    name: 'Fonte Chaveada Colmeia 12V 10A Bivolt com Filtro',
    description: 'Fonte estabilizada para alimentação centralizada de até 8 câmeras com proteção contra sobrecarga.',
    category: 'Energia & Fontes',
    sku: 'FON-COLM-12V10A',
    unitPrice: 115.00,
    unit: 'un',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-8',
    name: 'Cabo Coaxial Bipolar 4mm 100% Cobre (Rolo 100m)',
    description: 'Cabo especial para transmissão de vídeo e alimentação no mesmo condutor com blindagem especial contra interferências.',
    category: 'Cabeamento & Conexões',
    sku: 'CAB-COAX-100M',
    unitPrice: 220.00,
    unit: 'rolo',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-9',
    name: 'Kit de Conectores BNC Mola + Plug P4 com Borne (10 pares)',
    description: 'Conectores metálicos profissionais com trava reforçada e borne de fixação rápida.',
    category: 'Cabeamento & Conexões',
    sku: 'KIT-CONECT-10P',
    unitPrice: 65.00,
    unit: 'kit',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-10',
    name: 'Fechadura Digital Biométrica de Embutir com Senha e Cartão RFID',
    description: 'Fechadura eletrônica inteligente para portas de madeira/metal com leitor biométrico na maçaneta e chave mecânica de emergência.',
    category: 'Fechaduras & Interfonia',
    sku: 'FEC-BIO-SLIM',
    unitPrice: 890.00,
    unit: 'un',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-11',
    name: 'Vídeo Porteiro Wi-Fi com Monitor Touchscreen 7" e Câmera HD',
    description: 'Permite atender e abrir portões remotamente pelo smartphone ou monitor interno, visão noturna e gravação de visitantes.',
    category: 'Fechaduras & Interfonia',
    sku: 'VP-WIFI-7POL',
    unitPrice: 1150.00,
    unit: 'kit',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-12',
    name: 'Sensor de Presença Infravermelho Passivo Pet Immunity 20kg',
    description: 'Sensor de alarme com compensação automática de temperatura e imunidade para animais domésticos de até 20kg.',
    category: 'Alarmes & Sensores',
    sku: 'SEN-IVP-PET20',
    unitPrice: 95.00,
    unit: 'un',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-13',
    name: 'Central de Choque de Cerca Elétrica 18.000V com Alarme Integrado',
    description: 'Central microprocessada com rearme automático, saída para sirene e monitoramento de corte de arame.',
    category: 'Cerca Elétrica',
    sku: 'CEN-CERCA-18KV',
    unitPrice: 480.00,
    unit: 'un',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'serv-1',
    name: 'Instalação e Fixação de Ponto de Câmera CFTV',
    description: 'Fixação em teto ou parede, fixação de caixa de passagem hermética, conectorização e alinhamento de ângulo de visão.',
    category: 'Instalação',
    price: 90.00,
    unit: 'ponto',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'serv-2',
    name: 'Configuração de DVR / NVR e Acesso Remoto no Celular',
    description: 'Configuração de gravação contínua/movimento, criação de usuários, configuração de rede DDNS/P2P e instalação do app em até 3 smartphones.',
    category: 'Configuração',
    price: 180.00,
    unit: 'serviço',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'serv-3',
    name: 'Passagem e Organização de Cabeamento Estruturado / Coaxial',
    description: 'Passagem de cabos por tubulação embutida, calhas ou eletrodutos com identificação e amarração estética.',
    category: 'Infraestrutura & Passagem de Cabos',
    price: 4.50,
    unit: 'metro',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'serv-4',
    name: 'Instalação e Programação de Fechadura Digital Biométrica',
    description: 'Furação padrão, encaixe de mortise, calibração do trinco, cadastro de biometrias, senhas e tags dos moradores.',
    category: 'Instalação',
    price: 220.00,
    unit: 'un',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'serv-5',
    name: 'Instalação e Testes de Vídeo Porteiro Eletrônico',
    description: 'Montagem do módulo externo e monitor interno, interligação com fechadura eletromecânica e configuração de aplicativo.',
    category: 'Instalação',
    price: 260.00,
    unit: 'un',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'serv-6',
    name: 'Instalação de Cerca Elétrica por Metro Linear (Mão de Obra)',
    description: 'Fixação de hastes de alumínio com isoladores, repuxo de fios de aço inox e interligação com a central.',
    category: 'Instalação',
    price: 28.00,
    unit: 'metro',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'serv-7',
    name: 'Visita Técnica / Manutenção Preventiva e Limpeza de Lentes',
    description: 'Revisão geral do sistema de CFTV, limpeza das cúpulas/lentes, reaperto de conectores e teste de backup.',
    category: 'Manutenção',
    price: 150.00,
    unit: 'visita',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Condomínio Residencial Jardim das Flores',
    document: '12.345.678/0001-90',
    phone: '(11) 99123-4567',
    email: 'sindico.jardimdasflores@email.com',
    address: {
      street: 'Rua das Camélias',
      number: '450',
      complement: 'Portaria Principal',
      neighborhood: 'Jardins',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01400-000',
    },
    notes: 'Contato direto com o síndico Sr. Marcelo. Instalação preferencial em horário comercial.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: 'cust-2',
    name: 'Dra. Mariana Costa Silva',
    document: '284.938.108-44',
    phone: '(11) 98234-5678',
    email: 'mariana.costa.adv@gmail.com',
    address: {
      street: 'Alameda dos Anapurus',
      number: '1020',
      complement: 'Casa 2',
      neighborhood: 'Moema',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '04087-003',
    },
    notes: 'Residência unifamiliar. Deseja cobrir garagem, quintal e entrada social.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'cust-3',
    name: 'Auto Peças & Mecânica São Pedro Ltda',
    document: '45.678.901/0001-23',
    phone: '(11) 3210-9876',
    email: 'financeiro@autosaopedro.com.br',
    address: {
      street: 'Av. Dr. Gastão Vidigal',
      number: '1850',
      neighborhood: 'Vila Leopoldina',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05314-000',
    },
    notes: 'Galpão comercial com estoque de peças de alto valor.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  }
];

export const INITIAL_QUOTES: Quote[] = [
  {
    id: 'quote-1',
    quoteNumber: 'ORC-2026-001',
    title: 'Kit CFTV 4 Câmeras Full HD + Fechadura Biométrica',
    customer: INITIAL_CUSTOMERS[1],
    items: [
      {
        id: 'item-1',
        type: 'product',
        itemId: 'prod-1',
        name: 'Câmera Dome Full HD 1080p Infravermelho 20m',
        category: 'CFTV & Câmeras',
        sku: 'CAM-DOM-1080P',
        quantity: 2,
        unitPrice: 169.90,
        discount: 0,
        unit: 'un',
        subtotal: 339.80,
      },
      {
        id: 'item-2',
        type: 'product',
        itemId: 'prod-2',
        name: 'Câmera Bullet Full HD 1080p IP67 Externa 30m',
        category: 'CFTV & Câmeras',
        sku: 'CAM-BUL-1080P',
        quantity: 2,
        unitPrice: 198.50,
        discount: 0,
        unit: 'un',
        subtotal: 397.00,
      },
      {
        id: 'item-3',
        type: 'product',
        itemId: 'prod-4',
        name: 'Gravador DVR 8 Canais 1080p Multi-HD com IA',
        category: 'Gravadores & Armazenamento',
        sku: 'DVR-MHD-08CH',
        quantity: 1,
        unitPrice: 580.00,
        discount: 0,
        unit: 'un',
        subtotal: 580.00,
      },
      {
        id: 'item-4',
        type: 'product',
        itemId: 'prod-5',
        name: 'HD Especial para CFTV 1TB WD Purple',
        category: 'Gravadores & Armazenamento',
        sku: 'HD-CFTV-1TB',
        quantity: 1,
        unitPrice: 389.00,
        discount: 0,
        unit: 'un',
        subtotal: 389.00,
      },
      {
        id: 'item-5',
        type: 'product',
        itemId: 'prod-7',
        name: 'Fonte Chaveada Colmeia 12V 10A Bivolt com Filtro',
        category: 'Energia & Fontes',
        sku: 'FON-COLM-12V10A',
        quantity: 1,
        unitPrice: 115.00,
        discount: 0,
        unit: 'un',
        subtotal: 115.00,
      },
      {
        id: 'item-6',
        type: 'product',
        itemId: 'prod-8',
        name: 'Cabo Coaxial Bipolar 4mm 100% Cobre (Rolo 100m)',
        category: 'Cabeamento & Conexões',
        sku: 'CAB-COAX-100M',
        quantity: 1,
        unitPrice: 220.00,
        discount: 0,
        unit: 'rolo',
        subtotal: 220.00,
      },
      {
        id: 'item-7',
        type: 'product',
        itemId: 'prod-9',
        name: 'Kit de Conectores BNC Mola + Plug P4 com Borne',
        category: 'Cabeamento & Conexões',
        sku: 'KIT-CONECT-10P',
        quantity: 1,
        unitPrice: 65.00,
        discount: 0,
        unit: 'kit',
        subtotal: 65.00,
      },
      {
        id: 'item-8',
        type: 'product',
        itemId: 'prod-10',
        name: 'Fechadura Digital Biométrica de Embutir',
        category: 'Fechaduras & Interfonia',
        sku: 'FEC-BIO-SLIM',
        quantity: 1,
        unitPrice: 890.00,
        discount: 0,
        unit: 'un',
        subtotal: 890.00,
      },
      {
        id: 'item-9',
        type: 'service',
        itemId: 'serv-1',
        name: 'Instalação e Fixação de Ponto de Câmera CFTV',
        category: 'Instalação',
        quantity: 4,
        unitPrice: 90.00,
        discount: 0,
        unit: 'ponto',
        subtotal: 360.00,
      },
      {
        id: 'item-10',
        type: 'service',
        itemId: 'serv-2',
        name: 'Configuração de DVR / NVR e Acesso Remoto no Celular',
        category: 'Configuração',
        quantity: 1,
        unitPrice: 180.00,
        discount: 0,
        unit: 'serviço',
        subtotal: 180.00,
      },
      {
        id: 'item-11',
        type: 'service',
        itemId: 'serv-4',
        name: 'Instalação e Programação de Fechadura Digital Biométrica',
        category: 'Instalação',
        quantity: 1,
        unitPrice: 220.00,
        discount: 0,
        unit: 'un',
        subtotal: 220.00,
      },
    ],
    subtotalProducts: 2995.80,
    subtotalServices: 760.00,
    discountGlobal: 155.80,
    discountType: 'fixed',
    total: 3600.00,
    payment: {
      method: 'Personalizado',
      customDescription: 'Entrada de R$ 1.200,00 no Pix + 3x de R$ 800,00 no Cartão de Crédito sem juros',
      downPayment: 1200,
      installments: 3,
    },
    validityDays: 15,
    executionDeadline: '3 dias úteis após aprovação.',
    warrantyTerms: '12 meses para equipamentos e 90 dias para instalação e calibração.',
    observations: 'Instalação em horário residencial previamente agendado. Configuração em 2 celulares já inclusa.',
    status: 'approved',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'quote-2',
    quoteNumber: 'ORC-2026-002',
    title: 'Modernização de CFTV Portaria e Garagens - 8 Câmeras',
    customer: INITIAL_CUSTOMERS[0],
    items: [
      {
        id: 'item-201',
        type: 'product',
        itemId: 'prod-2',
        name: 'Câmera Bullet Full HD 1080p IP67 Externa 30m',
        category: 'CFTV & Câmeras',
        sku: 'CAM-BUL-1080P',
        quantity: 8,
        unitPrice: 198.50,
        discount: 0,
        unit: 'un',
        subtotal: 1588.00,
      },
      {
        id: 'item-202',
        type: 'product',
        itemId: 'prod-4',
        name: 'Gravador DVR 8 Canais 1080p Multi-HD com IA',
        category: 'Gravadores & Armazenamento',
        sku: 'DVR-MHD-08CH',
        quantity: 1,
        unitPrice: 580.00,
        discount: 0,
        unit: 'un',
        subtotal: 580.00,
      },
      {
        id: 'item-203',
        type: 'product',
        itemId: 'prod-6',
        name: 'HD Especial para CFTV 2TB WD Purple',
        category: 'Gravadores & Armazenamento',
        sku: 'HD-CFTV-2TB',
        quantity: 1,
        unitPrice: 520.00,
        discount: 0,
        unit: 'un',
        subtotal: 520.00,
      },
      {
        id: 'item-204',
        type: 'service',
        itemId: 'serv-1',
        name: 'Instalação e Fixação de Ponto de Câmera CFTV',
        category: 'Instalação',
        quantity: 8,
        unitPrice: 90.00,
        discount: 0,
        unit: 'ponto',
        subtotal: 720.00,
      },
      {
        id: 'item-205',
        type: 'service',
        itemId: 'serv-2',
        name: 'Configuração de DVR / NVR e Acesso Remoto no Celular',
        category: 'Configuração',
        quantity: 1,
        unitPrice: 180.00,
        discount: 0,
        unit: 'serviço',
        subtotal: 180.00,
      },
    ],
    subtotalProducts: 2688.00,
    subtotalServices: 900.00,
    discountGlobal: 0,
    discountType: 'fixed',
    total: 3588.00,
    payment: {
      method: 'Boleto Bancário',
      customDescription: 'Boleto em 3 parcelas de R$ 1.196,00 (30/60/90 dias com emissão de NF-e)',
      installments: 3,
    },
    validityDays: 15,
    executionDeadline: '5 dias úteis após liberação da assembleia.',
    warrantyTerms: '12 meses para equipamentos e 90 dias para cabeamento e fixações.',
    observations: 'Necessário autorização prévia da portaria para entrada da equipe técnica.',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  }
];

class StorageService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // --- PRODUCTS ---
  getProducts(): Product[] {
    if (!this.isBrowser()) return INITIAL_PRODUCTS;
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!data) {
      this.saveProducts(INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  saveProducts(products: Product[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent('securquote_update', { detail: 'products' }));
  }

  addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: 'prod_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products.unshift(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveProducts(products);
    return products[index];
  }

  deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length !== products.length) {
      this.saveProducts(filtered);
      return true;
    }
    return false;
  }

  // --- SERVICES ---
  getServices(): Service[] {
    if (!this.isBrowser()) return INITIAL_SERVICES;
    const data = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (!data) {
      this.saveServices(INITIAL_SERVICES);
      return INITIAL_SERVICES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_SERVICES;
    }
  }

  saveServices(services: Service[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    window.dispatchEvent(new CustomEvent('securquote_update', { detail: 'services' }));
  }

  addService(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Service {
    const services = this.getServices();
    const newService: Service = {
      ...service,
      id: 'serv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    services.unshift(newService);
    this.saveServices(services);
    return newService;
  }

  updateService(id: string, updates: Partial<Service>): Service | null {
    const services = this.getServices();
    const index = services.findIndex((s) => s.id === id);
    if (index === -1) return null;

    services[index] = {
      ...services[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveServices(services);
    return services[index];
  }

  deleteService(id: string): boolean {
    const services = this.getServices();
    const filtered = services.filter((s) => s.id !== id);
    if (filtered.length !== services.length) {
      this.saveServices(filtered);
      return true;
    }
    return false;
  }

  // --- CUSTOMERS ---
  getCustomers(): Customer[] {
    if (!this.isBrowser()) return INITIAL_CUSTOMERS;
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (!data) {
      this.saveCustomers(INITIAL_CUSTOMERS);
      return INITIAL_CUSTOMERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_CUSTOMERS;
    }
  }

  saveCustomers(customers: Customer[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    window.dispatchEvent(new CustomEvent('securquote_update', { detail: 'customers' }));
  }

  addCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Customer {
    const customers = this.getCustomers();
    const newCustomer: Customer = {
      ...customer,
      id: 'cust_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    customers.unshift(newCustomer);
    this.saveCustomers(customers);
    return newCustomer;
  }

  updateCustomer(id: string, updates: Partial<Customer>): Customer | null {
    const customers = this.getCustomers();
    const index = customers.findIndex((c) => c.id === id);
    if (index === -1) return null;

    customers[index] = {
      ...customers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveCustomers(customers);
    return customers[index];
  }

  deleteCustomer(id: string): boolean {
    const customers = this.getCustomers();
    const filtered = customers.filter((c) => c.id !== id);
    if (filtered.length !== customers.length) {
      this.saveCustomers(filtered);
      return true;
    }
    return false;
  }

  // --- QUOTES ---
  getQuotes(): Quote[] {
    if (!this.isBrowser()) return INITIAL_QUOTES;
    const data = localStorage.getItem(STORAGE_KEYS.QUOTES);
    if (!data) {
      this.saveQuotes(INITIAL_QUOTES);
      return INITIAL_QUOTES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_QUOTES;
    }
  }

  saveQuotes(quotes: Quote[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
    window.dispatchEvent(new CustomEvent('securquote_update', { detail: 'quotes' }));
  }

  getQuoteById(id: string): Quote | undefined {
    return this.getQuotes().find((q) => q.id === id);
  }

  addQuote(quoteData: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>): Quote {
    const quotes = this.getQuotes();
    const newQuote: Quote = {
      ...quoteData,
      id: 'orc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    quotes.unshift(newQuote);
    this.saveQuotes(quotes);
    return newQuote;
  }

  updateQuote(id: string, updates: Partial<Quote>): Quote | null {
    const quotes = this.getQuotes();
    const index = quotes.findIndex((q) => q.id === id);
    if (index === -1) return null;

    quotes[index] = {
      ...quotes[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveQuotes(quotes);
    return quotes[index];
  }

  deleteQuote(id: string): boolean {
    const quotes = this.getQuotes();
    const filtered = quotes.filter((q) => q.id !== id);
    if (filtered.length !== quotes.length) {
      this.saveQuotes(filtered);
      return true;
    }
    return false;
  }

  duplicateQuote(id: string): Quote | null {
    const original = this.getQuoteById(id);
    if (!original) return null;

    const quotes = this.getQuotes();
    const currentYear = new Date().getFullYear();
    const nextNumber = `ORC-${currentYear}-${String(quotes.length + 1).padStart(3, '0')}`;

    const duplicated: Quote = {
      ...original,
      id: 'orc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      quoteNumber: nextNumber,
      title: `${original.title} (Cópia)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    quotes.unshift(duplicated);
    this.saveQuotes(quotes);
    return duplicated;
  }

  // --- SETTINGS ---
  getSettings(): CompanySettings {
    if (!this.isBrowser()) return DEFAULT_COMPANY_SETTINGS;
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) {
      this.saveSettings(DEFAULT_COMPANY_SETTINGS);
      return DEFAULT_COMPANY_SETTINGS;
    }
    try {
      return { ...DEFAULT_COMPANY_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_COMPANY_SETTINGS;
    }
  }

  saveSettings(settings: CompanySettings): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('securquote_update', { detail: 'settings' }));
  }

  resetToDefaults(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.QUOTES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    this.saveProducts(INITIAL_PRODUCTS);
    this.saveServices(INITIAL_SERVICES);
    this.saveCustomers(INITIAL_CUSTOMERS);
    this.saveQuotes(INITIAL_QUOTES);
    this.saveSettings(DEFAULT_COMPANY_SETTINGS);
  }
}

export const storage = new StorageService();
