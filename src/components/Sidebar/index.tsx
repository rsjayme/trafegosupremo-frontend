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
    Bell,
    CaretLeft,
    Briefcase
} from "@phosphor-icons/react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
        label: "Núcleo de Gestão",
        icon: Briefcase,
        href: "/nucleo-gestao",
    },
    {
        label: "Configurações",
        icon: Gear,
        href: "/settings",
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);

    useEffect(() => {
        setMounted(true);
        const savedCollapsed = localStorage.getItem("sidebarCollapsed");
        if (savedCollapsed !== null) {
            setIsCollapsed(JSON.parse(savedCollapsed));
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
        }
    }, [isCollapsed, mounted]);

    if (!mounted) {
        return null;
    }

    return (
        <aside className={cn(
            "relative border-r bg-background min-h-screen transition-all duration-300",
            isCollapsed ? "w-[80px]" : "w-[280px]"
        )}>
            <div className="h-14 px-4 border-b flex items-center justify-end">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="transition-opacity"
                >
                    <CaretLeft className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        isCollapsed && "rotate-180"
                    )} />
                </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-3.5rem)]">
                <nav className="space-y-2 px-4 py-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <HoverCard key={item.href} openDelay={200} closeDelay={100}>
                                <HoverCardTrigger asChild>
                                    <Link
                                        href={item.href}
                                        className="block"
                                    >
                                        <Button
                                            variant={isActive ? "secondary" : "ghost"}
                                            className={cn(
                                                "w-full transition-all duration-300",
                                                isCollapsed ? "justify-center" : "justify-start gap-3",
                                                isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                                            )}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            {!isCollapsed && (
                                                <span className="transition-opacity duration-300">
                                                    {item.label}
                                                </span>
                                            )}
                                        </Button>
                                    </Link>
                                </HoverCardTrigger>
                                {isCollapsed && (
                                    <HoverCardContent
                                        side="right"
                                        align="start"
                                        className="w-40 p-2"
                                    >
                                        {item.label}
                                    </HoverCardContent>
                                )}
                            </HoverCard>
                        );
                    })}
                </nav>
            </ScrollArea>
        </aside>
    );
}
