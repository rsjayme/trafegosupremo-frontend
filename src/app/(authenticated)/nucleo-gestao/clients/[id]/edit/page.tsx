'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from '@phosphor-icons/react';
import { useClients } from '@/hooks/useClients';

const formSchema = z.object({
    status: z.enum(['ATIVO', 'INATIVO']),
    responsibleName: z.string().min(1, 'Nome do responsável é obrigatório'),
    companyName: z.string().min(1, 'Nome da empresa é obrigatório'),
    value: z.string().optional(),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    phone: z.string().optional(),
    observations: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function EditClientPage() {
    const router = useRouter();
    const params = useParams();
    const isNew = params.id === 'new';
    const clientId = isNew ? undefined : Number(params.id);

    const {
        client,
        createClient,
        updateClient,
    } = useClients(clientId ? { id: clientId } : undefined);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: 'ATIVO',
            responsibleName: '',
            companyName: '',
            value: '',
            email: '',
            phone: '',
            observations: '',
        }
    });

    useEffect(() => {
        if (client && !isNew) {
            form.reset({
                status: client.status,
                responsibleName: client.responsibleName,
                companyName: client.companyName,
                value: client.value?.toString() || '',
                email: client.email || '',
                phone: client.phone || '',
                observations: client.observations || '',
            });
        }
    }, [client, form, isNew]);

    const onSubmit = async (data: FormData) => {
        const payload = {
            ...data,
            value: data.value ? Number(data.value) : null,
            email: data.email || null,
            phone: data.phone || null,
            observations: data.observations || null,
        };

        if (isNew) {
            await createClient.mutateAsync(payload);
        } else if (clientId) {
            await updateClient.mutateAsync({
                id: clientId,
                data: payload,
            });
        }

        router.push('/nucleo-gestao/clients');
    };

    return (
        <div className="h-full flex flex-col">
            <div className="h-14 border-b flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/nucleo-gestao/clients')}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="font-medium">
                        {isNew ? 'Novo Cliente' : 'Editar Cliente'}
                    </h1>
                </div>
            </div>

            <div className="flex-1 p-4">
                <div className="max-w-2xl mx-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione um status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="ATIVO">Ativo</SelectItem>
                                                <SelectItem value="INATIVO">Inativo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="responsibleName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome do Responsável</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="companyName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome da Empresa</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Valor</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Valor em reais (R$)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="email" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Telefone</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="observations"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Observações</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                className="min-h-[100px]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={createClient.isPending || updateClient.isPending}
                            >
                                {createClient.isPending || updateClient.isPending
                                    ? 'Salvando...'
                                    : 'Salvar'}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}