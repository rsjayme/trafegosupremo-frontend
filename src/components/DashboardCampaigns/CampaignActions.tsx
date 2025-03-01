import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type FacebookAction } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { ACTION_LABELS } from "./action-labels";

interface CampaignActionsProps {
    actions: FacebookAction[];
    costPerAction: FacebookAction[];
    selectedActionTypes: string[];
}

export function CampaignActions({
    actions,
    costPerAction,
    selectedActionTypes
}: CampaignActionsProps) {
    const formatCurrency = (value: string | number) => {
        const number = Number(value);
        if (isNaN(number)) return "R$ 0,00";

        return number.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const formatNumber = (value: string | number) => {
        const number = Number(value);
        if (isNaN(number)) return "0";

        return number.toLocaleString("pt-BR");
    };

    // Filter actions based on selection
    const filteredActions = actions.filter(
        action => selectedActionTypes.includes(action.action_type)
    );

    if (filteredActions.length === 0) {
        return null;
    }

    return (
        <div className="p-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredActions.map((action) => {
                    const cost = costPerAction.find(
                        cost => cost.action_type === action.action_type
                    );

                    const label = ACTION_LABELS[action.action_type] || action.action_type;

                    return (
                        <Card
                            key={action.action_type}
                            className={cn(
                                "p-4 space-y-2",
                                "hover:bg-muted/50 transition-colors"
                            )}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <h4 className="text-sm font-medium text-pretty" title={label}>
                                    {label}
                                </h4>
                                <Badge variant="default" className="shrink-0">
                                    {formatNumber(action.value)}
                                </Badge>
                            </div>

                            {cost && (
                                <p className="text-xs text-muted-foreground">
                                    Custo por ação: {formatCurrency(cost.value)}
                                </p>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}