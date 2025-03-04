import { useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import { cn } from "@/lib/utils";
import { Widget } from "@/app/(authenticated)/relatorios/page";

interface DraggableItem {
    template: {
        defaultConfig: Omit<Widget, "id" | "position">;
        type: Widget["type"];
    };
}

interface DropZoneProps {
    onDrop: (widget: Widget) => void;
    index: number;
    widgets: Widget[];
}

export function DropZone({ onDrop, index, widgets }: DropZoneProps) {
    const ref = useRef<HTMLDivElement>(null);

    const [{ isOver }, connectDrop] = useDrop<DraggableItem, void, { isOver: boolean }>({
        accept: "WIDGET",
        drop: (item) => {
            const position = {
                x: 0,
                y: index === 0 ? 0 : Math.max(...widgets.map(w => w.position.y)) + 1
            };

            onDrop({
                ...item.template.defaultConfig,
                id: `${item.template.type}-${Date.now()}`,
                position
            });
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
                isOver && "h-8 bg-primary/10 border-2 border-dashed border-primary/50 rounded-lg"
            )}
        />
    );
}