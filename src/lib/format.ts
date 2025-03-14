export function numberToCurrency(value: number): string {
    return (value / 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function formatPhone(phone: string): string {
    // Remove todos os caracteres não numéricos
    const numbers = phone.replace(/\D/g, '');

    // Verifica se é um número internacional
    if (phone.startsWith('+')) {
        // Retorna no formato original se for internacional
        return phone;
    }

    // Formata números nacionais
    if (numbers.length === 11) {
        // Celular: (99) 99999-9999
        return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numbers.length === 10) {
        // Fixo: (99) 9999-9999
        return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    // Retorna o número original se não se encaixar nos padrões
    return phone;
}

export function unformatPhone(phone: string): string {
    return phone.replace(/\D/g, '');
}