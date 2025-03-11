"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    ChartLine,
    House,
    Gear,
    Buildings,
    Bell
} from "@phosphor-icons/react";

const menuItems = [
    {
        label: "Dashboard",
        icon: House,
        href: "/dashboard",
    },
    {
        label: "Relatórios",
        icon: ChartLine,
        href: "/relatorios",
    },
    {
        label: "Marcas",
        icon: Buildings,
        href: "/marcas",
    },
    {
        label: "Alertas de Orçamento",
        icon: Bell,
        href: "/alertas",
    },
    {
        label: "Configurações",
        icon: Gear,
        href: "/settings",
    },
];

import { useEffect, useState } from "react";

export function Sidebar() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <aside className="w-[280px] border-r bg-background min-h-screen">
            <ScrollArea className="h-full py-6">
                <nav className="space-y-2 px-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block"
                            >
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={`w-full justify-start gap-3 ${isActive
                                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                                        : ""
                                        }`}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>
            </ScrollArea>
        </aside>
    );
}
