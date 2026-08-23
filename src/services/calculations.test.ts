import { 
  calculateItemSubtotal, 
  calculateQuoteTotals, 
  formatCurrency, 
  generateQuoteNumber 
} from './calculations';
import { QuoteItem } from '../types';

export function runTests(): { passed: boolean; results: string[] } {
  const results: string[] = [];
  let passed = true;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      results.push(`[PASS] ${testName}`);
    } else {
      results.push(`[FAIL] ${testName}`);
      passed = false;
    }
  }

  // 1. calculateItemSubtotal
  assert(calculateItemSubtotal(2, 100, 0) === 200, 'Subtotal 2x 100 sem desconto = 200');
  assert(calculateItemSubtotal(4, 50, 20) === 180, 'Subtotal 4x 50 com desc 20 = 180');
  assert(calculateItemSubtotal(1, 100, 150) === 0, 'Subtotal não pode ser negativo quando desconto > total');

  // 2. calculateQuoteTotals (Fixed discount)
  const sampleItems: QuoteItem[] = [
    {
      id: '1',
      type: 'product',
      name: 'Câmera Dome',
      quantity: 2,
      unitPrice: 150,
      discount: 0,
      unit: 'un',
      subtotal: 300,
    },
    {
      id: '2',
      type: 'service',
      name: 'Instalação',
      quantity: 2,
      unitPrice: 80,
      discount: 0,
      unit: 'ponto',
      subtotal: 160,
    }
  ];

  const fixedTotals = calculateQuoteTotals(sampleItems, 60, 'fixed');
  assert(fixedTotals.subtotalProducts === 300, 'Subtotal produtos = 300');
  assert(fixedTotals.subtotalServices === 160, 'Subtotal serviços = 160');
  assert(fixedTotals.grossTotal === 460, 'Total bruto = 460');
  assert(fixedTotals.globalDiscountValue === 60, 'Desconto fixo = 60');
  assert(fixedTotals.netTotal === 400, 'Total líquido = 400');

  // 3. calculateQuoteTotals (Percentage discount)
  const percentTotals = calculateQuoteTotals(sampleItems, 10, 'percentage');
  assert(percentTotals.globalDiscountValue === 46, 'Desconto 10% de 460 = 46');
  assert(percentTotals.netTotal === 414, 'Total líquido com 10% = 414');

  // 4. generateQuoteNumber
  const currentYear = new Date().getFullYear();
  assert(generateQuoteNumber(0) === `ORC-${currentYear}-001`, 'Gera ORC-YYYY-001 para count 0');
  assert(generateQuoteNumber(9) === `ORC-${currentYear}-010`, 'Gera ORC-YYYY-010 para count 9');

  // 5. formatCurrency
  const formatted = formatCurrency(1250.50);
  assert(formatted.includes('1.250,50') || formatted.includes('1250,50') || formatted.includes('R$'), 'Formatador de moeda BRL funciona');

  return { passed, results };
}

// Auto-run if executed via CLI
const testOutput = runTests();
console.log('--- TEST RESULTS ---');
testOutput.results.forEach(r => console.log(r));
if (!testOutput.passed) {
  console.error('Calculations test failed!');
  process.exit(1);
} else {
  console.log('All calculations tests passed successfully!');
}
