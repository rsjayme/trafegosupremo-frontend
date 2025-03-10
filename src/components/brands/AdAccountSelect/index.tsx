"use client"

import { useState, useEffect } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { facebookService, FacebookAdAccount } from '@/services/facebook'

interface AdAccountSelectProps {
    brandId: number
    onAccountSelect?: (success: boolean) => void
}

export function AdAccountSelect({ brandId, onAccountSelect }: AdAccountSelectProps) {
    const [accounts, setAccounts] = useState<FacebookAdAccount[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadAccounts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function loadAccounts() {
        try {
            setLoading(true)
            setError(null)
            const data = await facebookService.getAvailableAdAccounts()
            setAccounts(data)
        } catch (err) {
            console.error('Erro ao carregar contas:', err)
            setError('Erro ao carregar contas de anúncio')
            onAccountSelect?.(false)
        } finally {
            setLoading(false)
        }
    }

    async function handleSelect(accountId: string) {
        try {
            setError(null)
            const account = accounts.find(acc => acc.id === accountId)
            if (!account) return

            await facebookService.connectAdAccount(brandId, {
                accountId: account.account_id,
                accountName: account.name,
                businessId: account.business?.id || undefined
            })

            onAccountSelect?.(true)
        } catch (err) {
            console.error('Erro ao vincular conta:', err)
            setError('Erro ao vincular conta de anúncio')
            onAccountSelect?.(false)
        }
    }

    return (
        <div className="w-full">
            <Select
                disabled={loading}
                onValueChange={handleSelect}
            >
                <SelectTrigger className={error ? 'border-red-500' : ''}>
                    <SelectValue placeholder={
                        loading ? 'Carregando contas...' : 'Selecione uma conta de anúncio'
                    } />
                </SelectTrigger>
                <SelectContent>
                    {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                            {account.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
        </div>
    )
}