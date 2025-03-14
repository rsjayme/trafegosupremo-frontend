import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsThreeVertical, Power } from "@phosphor-icons/react";
import { formatCurrency } from "@/lib/utils";
import { type ClientData } from "@/lib/schemas/client";

interface ClientsTableProps {
    data: ClientData[];
    onUpdateStatus: (id: number, status: 'ATIVO' | 'INATIVO') => void;
    onEdit: (client: ClientData) => React.ReactNode;
}

export function ClientsTable({ data, onUpdateStatus, onEdit }: ClientsTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Nome do Responsável</TableHead>
                        <TableHead>Nome da Empresa</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((client) => (
                        <TableRow key={client.id}>
                            <TableCell>
                                <Badge
                                    variant={client.status === 'ATIVO' ? 'success' : 'warning'}
                                >
                                    {client.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{client.responsibleName}</TableCell>
                            <TableCell>{client.companyName}</TableCell>
                            <TableCell>{client.email || '-'}</TableCell>
                            <TableCell>{client.phone || '-'}</TableCell>
                            <TableCell>
                                {client.value ? formatCurrency(client.value) : '-'}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <DotsThreeVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                        <DropdownMenuItem asChild>
                                            {onEdit(client)}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onUpdateStatus(
                                                client.id,
                                                client.status === 'ATIVO' ? 'INATIVO' : 'ATIVO'
                                            )}
                                        >
                                            <Power className="mr-2 h-4 w-4" />
                                            {client.status === 'ATIVO' ? 'Inativar' : 'Ativar'}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                    {data.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center">
                                Nenhum cliente encontrado
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}