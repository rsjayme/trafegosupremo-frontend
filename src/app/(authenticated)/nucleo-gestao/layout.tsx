'use client';

import { ReactNode, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserCircle, Kanban } from '@phosphor-icons/react';

interface GestaoLayoutProps {
    children: ReactNode;
}

export default function GestaoLayout({ children }: GestaoLayoutProps) {
    const pathname = usePathname();

    const menuItems = useMemo(() => [
        {
            label: "Leads",
            icon: Kanban,
            href: "/nucleo-gestao/leads",
        },
        {
            label: "Clientes", // Será implementado posteriormente
            icon: UserCircle,
            href: "/nucleo-gestao/clientes",
            disabled: true
        },
    ], []);

    return (
        <div className="flex h-full">
            <aside className="w-[240px] border-r bg-background">
                <div className="h-14 border-b flex items-center px-4">
                    <h2 className="font-medium">Núcleo de Gestão</h2>
                </div>
                <ScrollArea className="h-[calc(100vh-3.5rem)]">
                    <nav className="space-y-2 p-4">
                        {menuItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={item.disabled ? 'pointer-events-none' : ''}
                                >
                                    <Button
                                        variant={isActive ? "secondary" : "ghost"}
                                        className="w-full justify-start gap-3"
                                        disabled={item.disabled}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span>{item.label}</span>
                                    </Button>
                                </Link>
                            );
                        })}
                    </nav>
                </ScrollArea>
            </aside>
            <div className="flex-1 overflow-hidden">
                {children}
            </div>
        </div>
    );
}