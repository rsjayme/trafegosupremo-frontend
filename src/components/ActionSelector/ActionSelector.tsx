import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Settings2, X } from "lucide-react";
import { CategoryGroup } from "./CategoryGroup";
import { SearchBar } from "./SearchBar";
import { ACTION_DEFINITIONS, CATEGORY_DEFINITIONS } from "./constants";

interface ActionSelectorProps {
    selectedActions: string[];
    onSelectionChange: (actions: string[]) => void;
}

export function ActionSelector({
    selectedActions,
    onSelectionChange,
}: ActionSelectorProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");

    // Filter actions based on search
    const filteredActions = React.useMemo(() => {
        if (!searchTerm) return ACTION_DEFINITIONS;

        const term = searchTerm.toLowerCase();
        return ACTION_DEFINITIONS.filter(
            action =>
                action.label.toLowerCase().includes(term) ||
                action.description?.toLowerCase().includes(term)
        );
    }, [searchTerm]);

    // Get actions by category
    const getActionsByCategory = React.useCallback((categoryId: string) => {
        return filteredActions.filter(action => action.category === categoryId);
    }, [filteredActions]);

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                >
                    <Settings2 className="h-4 w-4" />
                    <span>Selecionar Métricas</span>
                    <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {selectedActions.length}
                    </span>
                </Button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg">
                    <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-semibold">
                            Selecionar Métricas
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Fechar</span>
                            </Button>
                        </Dialog.Close>
                    </div>

                    <SearchBar
                        onSearch={setSearchTerm}
                        totalActions={ACTION_DEFINITIONS.length}
                        matchCount={filteredActions.length}
                        suggestions={
                            searchTerm ?
                                ACTION_DEFINITIONS
                                    .filter(a => a.label.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .slice(0, 3)
                                    .map(a => a.label)
                                : undefined
                        }
                    />

                    <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-6">
                            {CATEGORY_DEFINITIONS.map(category => {
                                const categoryActions = getActionsByCategory(category.id);
                                if (categoryActions.length === 0 && searchTerm) return null;

                                return (
                                    <CategoryGroup
                                        key={category.id}
                                        category={category}
                                        actions={categoryActions}
                                        selectedActions={new Set(selectedActions)}
                                        onSelectionChange={(actionIds) => {
                                            onSelectionChange(actionIds);
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </ScrollArea>

                    <div className="flex items-center justify-end gap-2 border-t pt-4">
                        <Dialog.Close asChild>
                            <Button variant="outline">Cancelar</Button>
                        </Dialog.Close>
                        <Dialog.Close asChild>
                            <Button onClick={() => setIsOpen(false)}>
                                Aplicar
                            </Button>
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}