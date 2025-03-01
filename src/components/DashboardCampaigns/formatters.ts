// Format number with BR locale
export function formatNumber(value: string | number): string {
    const number = Number(value);
    if (isNaN(number)) return "0";

    return number.toLocaleString("pt-BR");
}

// Format currency with BR locale
export function formatCurrency(value: string | number): string {
    const number = Number(value);
    if (isNaN(number)) return "R$ 0,00";

    return number.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

// Format percentage with BR locale
export function formatPercentage(value: string | number): string {
    const number = Number(value);
    if (isNaN(number)) return "0%";

    return number.toLocaleString("pt-BR", {
        style: "percent",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Format ratio with 2 decimal places
export function formatRatio(value: string | number): string {
    const number = Number(value);
    if (isNaN(number)) return "0";

    return number.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Get display value based on metric type
export function getMetricValue(type: string, value: string | number): string {
    switch (type) {
        case "impressions":
        case "clicks":
        case "reach":
            return formatNumber(value);
        case "spend":
        case "cpc":
        case "cpm":
            return formatCurrency(value);
        case "ctr":
            return formatPercentage(value);
        case "frequency":
            return formatRatio(value);
        default:
            return formatNumber(value);
    }
}

// Format large numbers with abbreviations
export function formatCompactNumber(value: string | number): string {
    const number = Number(value);
    if (isNaN(number)) return "0";

    if (number >= 1_000_000) {
        return `${(number / 1_000_000).toFixed(1)}M`;
    }
    if (number >= 1_000) {
        return `${(number / 1_000).toFixed(1)}K`;
    }
    return formatNumber(number);
}