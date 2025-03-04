"use client";

import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ReportsSidebar } from "@/components/ReportsSidebar";
import { ReportsCanvas } from "@/components/ReportsCanvas";
import { mockData } from "@/mock/reports-data";

export interface Widget {
    id: string;
    type: "overview" | "pieChart" | "funnel";
    title: string;
    position: {
        x: number;
        y: number;
    };
    size: {
        width: number;
        height: number;
    };
    config: {
        level: "account" | "campaign";
        metrics?: string[];
        demographic?: string;
        funnelMetrics?: string[]; // Métricas específicas para o funil
        dateRange: {
            start: Date | null;
            end: Date | null;
        };
    };
}

export default function Relatorios2() {
    const [widgets, setWidgets] = useState<Widget[]>([]);

    const handleAddWidget = (widget: Widget) => {
        setWidgets((prev) => [...prev, widget]);
    };

    const handleUpdateWidget = (id: string, updates: Partial<Widget>) => {
        setWidgets((prev) =>
            prev.map((widget) =>
                widget.id === id ? { ...widget, ...updates } : widget
            )
        );
    };

    const handleRemoveWidget = (id: string) => {
        setWidgets((prev) => prev.filter((widget) => widget.id !== id));
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-1 h-full">
                <ReportsSidebar onAddWidget={handleAddWidget} />
                <div className="flex-1 p-6">
                    <div className="main-container space-y-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-semibold">Relatórios 2.0</h1>
                        </div>
                        <ReportsCanvas
                            widgets={widgets}
                            onUpdateWidget={handleUpdateWidget}
                            onRemoveWidget={handleRemoveWidget}
                            onAddWidget={handleAddWidget}
                            data={mockData}
                        />
                    </div>
                </div>
            </div>
        </DndProvider>
    );
}