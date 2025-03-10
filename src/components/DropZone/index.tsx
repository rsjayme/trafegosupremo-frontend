import { useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import { cn } from "@/lib/utils";
import { Widget } from "@/app/(authenticated)/relatorios/page";

interface WidgetTemplate {
    type: Widget["type"];
    title: string;
    icon: React.ReactNode;
    defaultConfig: Omit<Widget, "id" | "position">;
}

interface NewWidgetItem {
    type: "WIDGET";
    template: WidgetTemplate;
    defaultConfig: Omit<Widget, "id" | "position">;
}

interface PlacedWidgetItem {
    id: string;
    currentPosition: { x: number; y: number };
    type: "PLACED_WIDGET";
}

type DraggableItem = NewWidgetItem | PlacedWidgetItem;

interface DropZoneProps {
    onDrop: (widget: Widget) => void;
    onUpdateWidget?: (id: string, updates: Partial<Widget>) => void;
    index: number;
    widgets: Widget[];
}

export function DropZone({ onDrop, onUpdateWidget, index, widgets }: DropZoneProps) {
    const ref = useRef<HTMLDivElement>(null);

    const [{ isOver }, connectDrop] = useDrop<DraggableItem, void, { isOver: boolean }>({
        accept: ["WIDGET", "PLACED_WIDGET"],
        drop: (item) => {
            if (item.type === "PLACED_WIDGET") {
                // Calcular nova posição para widget existente
                const newPosition = {
                    x: 0,
                    y: index === 0 ? 0 : index
                };

                // Primeiro atualiza o widget arrastado
                if (onUpdateWidget) {
                    onUpdateWidget(item.id, { position: newPosition });

                    // Depois atualiza os outros widgets que precisam ser movidos
                    widgets
                        .filter(w => w.id !== item.id && w.position.y >= newPosition.y)
                        .sort((a, b) => a.position.y - b.position.y)
                        .forEach((w, i) => {
                            onUpdateWidget(w.id, {
                                position: { x: 0, y: newPosition.y + i + 1 }
                            });
                        });
                }
            } else if (item.type === "WIDGET") {
                // Lógica para novos widgets
                const position = {
                    x: 0,
                    y: index === 0 ? 0 : Math.max(...widgets.map(w => w.position.y)) + 1
                };

                onDrop({
                    ...item.defaultConfig,
                    id: `${item.template.type}-${Date.now()}`,
                    position
                });
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    });

    useEffect(() => {
        connectDrop(ref);
    }, [connectDrop]);

    return (
        <div
            ref={ref}
            className={cn(
                "h-4 w-full transition-all duration-200",
                isOver && "h-8 bg-primary/10 border-2 border-dashed border-primary/50 rounded-lg scale-105",
                "hover:h-6 hover:bg-primary/5"
            )}
        />
    );
}