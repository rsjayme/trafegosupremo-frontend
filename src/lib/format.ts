export function formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}

export function formatNumber(value: number): string {
    return new Intl.NumberFormat("pt-BR").format(value);
}

export function formatPercent(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
        style: "percent",
        minimumFractionDigits: 2,
    }).format(value / 100);
}