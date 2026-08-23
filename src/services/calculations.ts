import { QuoteItem } from '../types';

/**
 * Formata um número como Moeda Brasileira (BRL)
 */
export function formatCurrency(value: number): string {
  if (isNaN(value) || value === null || value === undefined) {
    return 'R$ 0,00';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formata uma data ISO para formato legível brasileiro
 */
export function formatDate(isoDate: string): string {
  if (!isoDate) return '';
  try {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch {
    return isoDate;
  }
}

/**
 * Calcula o subtotal de um item individual do orçamento
 */
export function calculateItemSubtotal(
  quantity: number,
  unitPrice: number,
  discount: number = 0
): number {
  const qty = Math.max(0, quantity || 0);
  const price = Math.max(0, unitPrice || 0);
  const gross = qty * price;
  const disc = Math.max(0, discount || 0);
  return Math.max(0, gross - disc);
}

/**
 * Calcula os totais e subtotais completos de uma lista de itens e desconto global
 */
export function calculateQuoteTotals(
  items: QuoteItem[],
  discountGlobal: number = 0,
  discountType: 'fixed' | 'percentage' = 'fixed'
) {
  let subtotalProducts = 0;
  let subtotalServices = 0;

  for (const item of items) {
    const itemTotal = calculateItemSubtotal(item.quantity, item.unitPrice, item.discount);
    if (item.type === 'product') {
      subtotalProducts += itemTotal;
    } else {
      subtotalServices += itemTotal;
    }
  }

  const grossTotal = subtotalProducts + subtotalServices;

  let globalDiscountValue = 0;
  if (discountType === 'percentage') {
    const percentage = Math.min(100, Math.max(0, discountGlobal));
    globalDiscountValue = (grossTotal * percentage) / 100;
  } else {
    globalDiscountValue = Math.min(grossTotal, Math.max(0, discountGlobal));
  }

  const netTotal = Math.max(0, grossTotal - globalDiscountValue);

  return {
    subtotalProducts,
    subtotalServices,
    grossTotal,
    globalDiscountValue,
    netTotal,
  };
}

/**
 * Gera o próximo número de orçamento sequencial legível
 */
export function generateQuoteNumber(existingCount: number): string {
  const currentYear = new Date().getFullYear();
  const nextNumber = String(existingCount + 1).padStart(3, '0');
  return `ORC-${currentYear}-${nextNumber}`;
}
