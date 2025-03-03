"use client"

import { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Brand } from '@/types/brand'
import { AdAccountSelect } from '../AdAccountSelect'

interface BrandsTableProps {
    brands: Brand[]
    onAccountConnect?: (brandId: number) => void
}

export function BrandsTable({ brands, onAccountConnect }: BrandsTableProps) {
    const [connectingBrandId, setConnectingBrandId] = useState<number | null>(null)

    const handleAccountSelect = (brandId: number, success: boolean) => {
        if (success) {
            setConnectingBrandId(null)
            onAccountConnect?.(brandId)
        }
    }

    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Contas de Anúncio</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {brands.map((brand) => {
                        const hasAdAccount = brand.facebookAdAccounts.length > 0
                        const isConnecting = connectingBrandId === brand.id

                        return (
                            <TableRow key={brand.id}>
                                <TableCell>{brand.name}</TableCell>
                                <TableCell>
                                    {hasAdAccount ? (
                                        <span className="text-green-500">Conectada</span>
                                    ) : (
                                        <span className="text-yellow-500">Aguardando conexão</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {hasAdAccount ? (
                                        <ul>
                                            {brand.facebookAdAccounts.map((account) => (
                                                <li key={account.id}>{account.name}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        'Nenhuma conta conectada'
                                    )}
                                </TableCell>
                                <TableCell>
                                    {!hasAdAccount && !brand.facebookAccount && (
                                        <p className="text-yellow-500 text-sm">
                                            Conecte primeiro uma conta do Facebook
                                        </p>
                                    )}
                                    {!hasAdAccount && brand.facebookAccount && !isConnecting && (
                                        <button
                                            onClick={() => setConnectingBrandId(brand.id)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            Conectar conta de anúncio
                                        </button>
                                    )}
                                    {isConnecting && (
                                        <div className="w-64">
                                            <AdAccountSelect
                                                brandId={brand.id}
                                                onAccountSelect={(success) => handleAccountSelect(brand.id, success)}
                                            />
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}