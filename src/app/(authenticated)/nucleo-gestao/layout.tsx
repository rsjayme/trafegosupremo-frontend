'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserCircle, Kanban } from '@phosphor-icons/react';

interface GestaoLayoutProps {
    children: ReactNode;
}

const navigation = [
    {
        name: "Leads",
        href: "/nucleo-gestao/leads",
        icon: Kanban,
    },
    {
        name: "Clientes",
        href: "/nucleo-gestao/clients",
        icon: UserCircle,
    },
];

export default function GestaoLayout({ children }: GestaoLayoutProps) {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-full">
            <aside className="w-60 border-r">
                <div className="h-14 border-b flex items-center px-4">
                    <h2 className="font-medium">Núcleo de Gestão</h2>
                </div>
                <ScrollArea className="h-[calc(100vh-3.5rem)]">
                    <nav className="space-y-1 p-2">
                        {navigation.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            const Icon = item.icon;

                            return (
                                <Button
                                    key={item.href}
                                    variant={isActive ? "secondary" : "ghost"}
                                    asChild
                                    className="w-full justify-start"
                                >
                                    <Link href={item.href}>
                                        <Icon className="mr-2 h-5 w-5" />
                                        {item.name}
                                    </Link>
                                </Button>
                            );
                        })}
                    </nav>
                </ScrollArea>
            </aside>
            <main className="flex-1 w-full overflow-auto">
                {children}
            </main>
        </div>
    );
}