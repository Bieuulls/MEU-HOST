/**
 * Formata um número para moeda brasileira (BRL)
 * @param value Valor a ser formatado
 * @returns String formatada (ex: R$ 1.234,56)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Formata uma data para o formato brasileiro
 * @param date Data a ser formatada
 * @returns String formatada (ex: 01/01/2025)
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(
    typeof date === 'string' ? new Date(date) : date
  );
}

/**
 * Formata um número para porcentagem
 * @param value Valor a ser formatado
 * @param decimals Número de casas decimais
 * @returns String formatada (ex: 12,34%)
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
}

/**
 * Formata um número para ter sempre um número específico de casas decimais
 * @param value Valor a ser formatado
 * @param decimals Número de casas decimais
 * @returns String formatada (ex: 1.234,56)
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

/**
 * Formata um número de telefone para o formato brasileiro
 * @param phone Número de telefone (apenas dígitos)
 * @returns String formatada (ex: (11) 98765-4321)
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

/**
 * Formata um CEP para o formato brasileiro
 * @param cep CEP (apenas dígitos)
 * @returns String formatada (ex: 12345-678)
 */
export function formatCEP(cep: string): string {
  const cleaned = cep.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{5})(\d{3})$/);
  if (match) {
    return `${match[1]}-${match[2]}`;
  }
  return cep;
}

/**
 * Formata um CPF para o formato brasileiro
 * @param cpf CPF (apenas dígitos)
 * @returns String formatada (ex: 123.456.789-00)
 */
export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
  }
  return cpf;
}

/**
 * Formata um CNPJ para o formato brasileiro
 * @param cnpj CNPJ (apenas dígitos)
 * @returns String formatada (ex: 12.345.678/0001-90)
 */
export function formatCNPJ(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}`;
  }
  return cnpj;
}
