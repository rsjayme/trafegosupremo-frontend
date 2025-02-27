interface CacheItem<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

class LocalCache {
    private cache: Map<string, CacheItem<unknown>> = new Map();
    private prefix: string = 'fb_cache_';

    constructor() {
        this.loadFromStorage();
        // Limpa o cache expirado a cada minuto
        setInterval(() => this.cleanExpired(), 60 * 1000);
    }

    private loadFromStorage(): void {
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.prefix)) {
                    const item = JSON.parse(localStorage.getItem(key) || '') as CacheItem<unknown>;
                    if (item && !this.isExpired(item)) {
                        this.cache.set(key.slice(this.prefix.length), item);
                    } else {
                        localStorage.removeItem(key);
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao carregar cache:', error);
            this.clear();
        }
    }

    private saveToStorage<T>(key: string, item: CacheItem<T>): void {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(item));
        } catch (error) {
            console.error('Erro ao salvar no cache:', error);
            // Se houver erro (ex: localStorage cheio), limpa o cache
            this.clear();
        }
    }

    private isExpired<T>(item: CacheItem<T>): boolean {
        return Date.now() - item.timestamp > item.ttl;
    }

    set<T>(key: string, data: T, ttl: number): void {
        const item: CacheItem<T> = {
            data,
            timestamp: Date.now(),
            ttl
        };
        this.cache.set(key, item as CacheItem<unknown>);
        this.saveToStorage(key, item);
    }

    get<T>(key: string): T | null {
        const item = this.cache.get(key) as CacheItem<T> | undefined;

        if (!item) {
            return null;
        }

        if (this.isExpired(item)) {
            this.remove(key);
            return null;
        }

        return item.data;
    }

    remove(key: string): void {
        this.cache.delete(key);
        localStorage.removeItem(this.prefix + key);
    }

    clear(): void {
        this.cache.clear();
        // Remove apenas as entradas do cache da aplicação
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        }
    }

    private cleanExpired(): void {
        for (const [key, item] of this.cache.entries()) {
            if (this.isExpired(item)) {
                this.remove(key);
            }
        }
    }

    // Utilitários para gerar chaves de cache consistentes
    static generateKey(base: string, params?: Record<string, string | number | boolean>): string {
        if (!params) {
            return base;
        }
        const sortedParams = Object.keys(params)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');
        return `${base}?${sortedParams}`;
    }

    // Utilitário para combinar múltiplas chaves
    static combineKeys(...parts: string[]): string {
        return parts.join(':');
    }
}

// Exporta uma única instância para ser usada em toda a aplicação
export const cache = new LocalCache();