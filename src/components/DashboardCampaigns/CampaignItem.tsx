import { type FacebookCampaignMetrics } from "@/types/dashboard";
import { ActionSelector } from "@/components/ActionSelector";
import { CampaignMetrics } from "./CampaignMetrics";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { AIAnalysisWidget } from "@/components/AIAnalysisModal";
import { useState } from "react";
import { useBrand } from "@/contexts/BrandContext";

interface CampaignItemProps {
    campaign: FacebookCampaignMetrics;
    globalActions: string[];
    campaignActions: Record<string, string[]>;
    onCampaignActionChange: (campaignId: string, actions: string[]) => void;
    since: string;
    until: string;
}

export function CampaignItem({
    campaign,
    globalActions,
    campaignActions,
    onCampaignActionChange,
    since,
    until
}: CampaignItemProps) {
    const [showAnalysis, setShowAnalysis] = useState(false);
    const campaignId = `${campaign.account_id}-${campaign.campaign_name}`;
    const selectedActions = campaignActions[campaignId] || globalActions;
    const { selectedBrand } = useBrand();

    const handleActionChange = (newActions: string[]) => {
        onCampaignActionChange(campaignId, newActions);
    };

    // Debug
    console.log('Campaign Analysis Data:', {
        brandId: selectedBrand?.id,
        campaignId: campaign.campaign_id,
        since,
        until
    });

    if (!selectedBrand) {
        return null;
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                    <h4 className="font-medium">{campaign.campaign_name}</h4>
                    <p className="text-sm text-muted-foreground">
                        {campaign.account_name}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAnalysis(true)}
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Analisar com IA
                    </Button>
                    <ActionSelector
                        selectedActions={selectedActions}
                        onSelectionChange={handleActionChange}
                    />
                </div>
            </div>

            <CampaignMetrics
                metrics={{
                    impressions: campaign.impressions,
                    clicks: campaign.clicks,
                    spend: campaign.spend,
                    cpc: campaign.cpc,
                    ctr: campaign.ctr,
                    cpm: campaign.cpm,
                    reach: campaign.reach,
                    frequency: campaign.frequency,
                    actions: campaign.actions,
                    costPerAction: campaign.cost_per_action_type
                }}
                selectedActionTypes={selectedActions}
            />

            <AIAnalysisWidget
                open={showAnalysis}
                onOpenChange={setShowAnalysis}
                brandId={selectedBrand.id}
                campaignId={String(campaign.campaign_id)}
                period={{
                    since,
                    until
                }}
            />
        </div>
    );
}