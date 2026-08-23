import { maskPhone, maskCpfCnpj, maskCep, unmask } from './masks';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`[FAIL] ${message}`);
    process.exit(1);
  } else {
    console.log(`[PASS] ${message}`);
  }
}

console.log('--- TEST MASK UTILITIES ---');

// Test phone masks
assert(maskPhone('11999998888') === '(11) 99999-8888', 'Formata celular 11 dígitos');
assert(maskPhone('1133334444') === '(11) 3333-4444', 'Formata fixo 10 dígitos');
assert(maskPhone('11') === '(11', 'Formata DDD');
assert(maskPhone('') === '', 'String vazia retorna vazio');

// Test CPF / CNPJ masks
assert(maskCpfCnpj('12345678901') === '123.456.789-01', 'Formata CPF 11 dígitos');
assert(maskCpfCnpj('12345678000195') === '12.345.678/0001-95', 'Formata CNPJ 14 dígitos');
assert(maskCpfCnpj('123') === '123', 'Formata início documento');

// Test CEP masks
assert(maskCep('01310100') === '01310-100', 'Formata CEP 8 dígitos');
assert(maskCep('01310') === '01310', 'Formata CEP parcial');

// Test unmask
assert(unmask('(11) 99999-8888') === '11999998888', 'Remove caracteres especiais');

console.log('All mask tests passed successfully!');
