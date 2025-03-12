import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function currencyToNumber(value: string): number {
  return Math.round(
    Number(value.replace(/[^\d,-]/g, '').replace(',', '.')) * 100
  );
}

export function numberToCurrency(value: number): string {
  return (value / 100).toFixed(2).replace('.', ',');
}

export function formatPhone(value: string): string {
  // Remove tudo que não é número nem '+'
  const cleaned = value.replace(/[^\d+]/g, '');

  // Se começa com '+', é um número internacional
  if (cleaned.startsWith('+')) {
    // Agrupa os números em blocos de 2 ou 3 para melhor legibilidade
    return cleaned
      .replace(/(\+\d{2})(\d)/, '$1 $2') // Separa o código do país
      .replace(/(\d{3})(?=\d)/g, '$1 ') // Agrupa o resto em blocos de 3
      .trim();
  }

  // Número brasileiro
  const numbers = cleaned.replace(/^\+55|^55/, ''); // Remove código do país se presente

  if (numbers.length === 11) {
    // Celular: (XX) XXXXX-XXXX
    return numbers
      .replace(/(\d{2})/, '($1) ')
      .replace(/(\d{5})/, '$1-')
      .trim();
  } else if (numbers.length === 10) {
    // Fixo: (XX) XXXX-XXXX
    return numbers
      .replace(/(\d{2})/, '($1) ')
      .replace(/(\d{4})/, '$1-')
      .trim();
  }

  // Se não se encaixa em nenhum formato conhecido, retorna com espaços a cada 3 dígitos
  return cleaned.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
}

export function unformatPhone(value: string): string {
  // Mantém o '+' para números internacionais
  return value.startsWith('+')
    ? '+' + value.replace(/[^\d]/g, '')
    : value.replace(/[^\d]/g, '');
}
