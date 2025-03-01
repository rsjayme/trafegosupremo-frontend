import { type FacebookCampaignMetrics } from "@/types/dashboard";
import { ActionSelector } from "@/components/ActionSelector";
import { CampaignMetrics } from "./CampaignMetrics";

interface CampaignItemProps {
    campaign: FacebookCampaignMetrics;
    globalActions: string[];
    campaignActions: Record<string, string[]>;
    onCampaignActionChange: (campaignId: string, actions: string[]) => void;
}

export function CampaignItem({
    campaign,
    globalActions,
    campaignActions,
    onCampaignActionChange
}: CampaignItemProps) {
    const campaignId = `${campaign.account_id}-${campaign.campaign_name}`;
    const selectedActions = campaignActions[campaignId] || globalActions;

    const handleActionChange = (newActions: string[]) => {
        onCampaignActionChange(campaignId, newActions);
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                    <h4 className="font-medium">{campaign.campaign_name}</h4>
                    <p className="text-sm text-muted-foreground">
                        {campaign.account_name}
                    </p>
                </div>
                <ActionSelector
                    selectedActions={selectedActions}
                    onSelectionChange={handleActionChange}
                />
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
        </div>
    );
}