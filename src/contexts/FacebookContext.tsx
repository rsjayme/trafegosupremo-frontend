// Deprecated: Este contexto foi substituído pelas funcionalidades do dashboard
// Mantido temporariamente para referência durante a migração
// TODO: Remover este arquivo após a migração completa

import { createContext } from 'react';

export const FacebookContext = createContext({});

export function useFacebook() {
    throw new Error('Este contexto foi descontinuado. Use os hooks do dashboard em seu lugar.');
}

export function FacebookProvider({ children }: { children: React.ReactNode }) {
    return <FacebookContext.Provider value={{}}>{children}</FacebookContext.Provider>;
}