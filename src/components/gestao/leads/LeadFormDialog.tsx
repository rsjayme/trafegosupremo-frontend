'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, type LeadFormData } from '@/lib/schemas/lead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { numberToCurrency, formatPhone, unformatPhone } from '@/lib/utils';
import { DateTimePicker } from './DateTimePicker';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

interface LeadFormDialogProps {
    trigger: React.ReactNode;
    defaultValues?: Partial<LeadFormData>;
    onSubmit: (data: LeadFormData) => void;
}

export function LeadFormDialog({ trigger, defaultValues, onSubmit }: LeadFormDialogProps) {
    console.log('Default Values:', defaultValues);

    const form = useForm<LeadFormData>({
        resolver: zodResolver(leadSchema),
        defaultValues: {
            status: 'LEAD',
            priority: 'MEDIA',
            value: 0,
            email: '',
            phone: '',
            lastContactDate: null,
            nextContactDate: null,
            observations: '',
            ...defaultValues,
            // Converte as datas se existirem nos defaultValues
            ...(defaultValues?.lastContactDate && {
                lastContactDate: new Date(defaultValues.lastContactDate)
            }),
            ...(defaultValues?.nextContactDate && {
                nextContactDate: new Date(defaultValues.nextContactDate)
            })
        }
    });

    const handleSubmit = (data: LeadFormData) => {
        console.log('Form Data Before Submit:', data);

        const formattedData = {
            ...data,
            phone: unformatPhone(data.phone)
        };

        console.log('Formatted Data:', formattedData);
        onSubmit(formattedData);
    };

    // Debug: Monitor form values
    console.log('Form Values:', form.watch());

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {defaultValues ? 'Editar Lead' : 'Novo Lead'}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
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
                                                    <SelectValue placeholder="Selecione o status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="LEAD">Lead</SelectItem>
                                                <SelectItem value="PROPOSTA_ENVIADA">Proposta Enviada</SelectItem>
                                                <SelectItem value="FECHADO">Fechado</SelectItem>
                                                <SelectItem value="NAO_FECHADO">Não Fechado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prioridade</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione a prioridade" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="BAIXA">Baixa</SelectItem>
                                                <SelectItem value="MEDIA">Média</SelectItem>
                                                <SelectItem value="ALTA">Alta</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="contactName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome do Contato</FormLabel>
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
                        </div>

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} />
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
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                const formatted = formatPhone(e.target.value);
                                                field.onChange(formatted);
                                            }}
                                            placeholder="(00) 00000-0000 ou +XX XXXXXXXXX"
                                            maxLength={25}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    <p className="text-xs text-muted-foreground">
                                        Use + para números internacionais (ex: +1 555 123 4567)
                                    </p>
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
                                            type="text"
                                            {...field}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                field.onChange(Number(value || 0));
                                            }}
                                            value={field.value ? `R$ ${numberToCurrency(Number(field.value))}` : 'R$ 0,00'}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastContactDate"
                            render={({ field: { value, onChange } }) => {
                                // Debug: Monitor date field value
                                console.log('Last Contact Field Value:', value);
                                return (
                                    <FormItem>
                                        <FormLabel>Último Contato</FormLabel>
                                        <FormControl>
                                            <DateTimePicker
                                                date={value}
                                                onChange={(newDate) => {
                                                    console.log('Last Contact Changed:', newDate);
                                                    onChange(newDate);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        <FormField
                            control={form.control}
                            name="nextContactDate"
                            render={({ field: { value, onChange } }) => {
                                // Debug: Monitor date field value
                                console.log('Next Contact Field Value:', value);
                                return (
                                    <FormItem>
                                        <FormLabel>Próximo Contato</FormLabel>
                                        <FormControl>
                                            <DateTimePicker
                                                date={value}
                                                onChange={(newDate) => {
                                                    console.log('Next Contact Changed:', newDate);
                                                    onChange(newDate);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        <FormField
                            control={form.control}
                            name="observations"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Observações</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" type="button">
                                Cancelar
                            </Button>
                            <Button type="submit">
                                {defaultValues ? 'Salvar' : 'Criar'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}