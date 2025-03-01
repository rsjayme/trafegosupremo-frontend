import { type FacebookAction } from "@/types/dashboard";
import { MetricCard } from "./MetricCard";
import { getMetricValue } from "./formatters";
import { getMetricLabel, getCostPerActionLabel } from "./metric-labels";

interface BaseMetrics {
    impressions: string;
    clicks: string;
    spend: string;
    cpc: string;
    ctr: string;
    cpm: string;
    reach: string;
    frequency: string;
}

interface CampaignMetricsProps {
    metrics: BaseMetrics & {
        actions: FacebookAction[];
        costPerAction: FacebookAction[];
    };
    selectedActionTypes: string[];
}

// Base metric configuration for consistent display and type safety
const BASE_METRICS = [
    "impressions",
    "clicks",
    "spend",
    "cpc",
    "ctr",
    "cpm",
    "reach",
    "frequency"
] as const satisfies readonly (keyof BaseMetrics)[];

export function CampaignMetrics({
    metrics,
    selectedActionTypes
}: CampaignMetricsProps) {
    return (
        <div className="space-y-6">
            {/* Base metrics - always visible */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {BASE_METRICS.map((id) => (
                    <MetricCard
                        key={id}
                        label={getMetricLabel(id)}
                        value={getMetricValue(id, metrics[id])}
                    />
                ))}
            </div>

            {/* Custom action metrics - if any selected */}
            {selectedActionTypes.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {metrics.actions
                        .filter(action => selectedActionTypes.includes(action.action_type))
                        .map(action => {
                            const cost = metrics.costPerAction.find(
                                c => c.action_type === action.action_type
                            );

                            return (
                                <MetricCard
                                    key={action.action_type}
                                    label={getMetricLabel(action.action_type)}
                                    value={getMetricValue("impressions", action.value)}
                                    subtitle={cost ? `${getCostPerActionLabel(action.action_type)}: ${getMetricValue("cpc", cost.value)}` : undefined}
                                />
                            );
                        })}
                </div>
            )}
        </div>
    );
}