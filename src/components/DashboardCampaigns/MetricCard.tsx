import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
    DollarSign,
    Eye,
    MousePointer,
    Target,
    BarChart3,
    Calculator,
    Repeat,
    MessageCircle,
    Heart,
    Share2,
    PlayCircle,
    Link as LinkIcon,
    LucideIcon
} from "lucide-react";

interface MetricCardProps {
    label: string;
    value: string;
    subtitle?: string;
    className?: string;
}

// Função para obter o ícone apropriado baseado no label
function getIconForMetric(label: string): LucideIcon {
    const lowerLabel = label.toLowerCase();

    // Métricas base
    if (lowerLabel.includes('impressões')) return Eye;
    if (lowerLabel.includes('clique')) return MousePointer;
    if (lowerLabel.includes('investimento') || lowerLabel.includes('custo')) return DollarSign;
    if (lowerLabel.includes('cpc')) return Calculator;
    if (lowerLabel.includes('ctr')) return BarChart3;
    if (lowerLabel.includes('cpm')) return Calculator;
    if (lowerLabel.includes('alcance')) return Target;
    if (lowerLabel.includes('frequência')) return Repeat;

    // Métricas de mensagem
    if (lowerLabel.includes('mensagem') || lowerLabel.includes('conversa') || lowerLabel.includes('comentário')) return MessageCircle;

    // Métricas de engajamento
    if (lowerLabel.includes('engajamento') || lowerLabel.includes('reação')) return Heart;
    if (lowerLabel.includes('compartilhamento')) return Share2;

    // Métricas de interação
    if (lowerLabel.includes('link')) return LinkIcon;
    if (lowerLabel.includes('vídeo') || lowerLabel.includes('video')) return PlayCircle;

    // Fallback
    return BarChart3;
}

export function MetricCard({
    label,
    value,
    subtitle,
    className
}: MetricCardProps) {
    const IconComponent = getIconForMetric(label);

    return (
        <Card
            className={cn(
                "p-4 transition-all hover:bg-muted/50 hover:shadow-sm relative overflow-hidden",
                className
            )}
        >
            <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                    <IconComponent className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-pretty flex items-center gap-2">
                        {label}
                    </p>
                    <p className="text-lg font-semibold mt-1">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
                    )}
                </div>
            </div>
        </Card>
    );
}