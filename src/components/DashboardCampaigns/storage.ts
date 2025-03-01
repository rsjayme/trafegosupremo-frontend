const GLOBAL_ACTIONS_KEY = 'dashboard-global-actions';
const CAMPAIGN_ACTIONS_PREFIX = 'dashboard-campaign-actions';

export interface StoredActions {
    actions: string[];
    lastUpdated: string;
}

export function getCampaignStorageKey(campaignId: string) {
    return `${CAMPAIGN_ACTIONS_PREFIX}-${campaignId}`;
}

export function loadGlobalActions(): string[] {
    try {
        const stored = localStorage.getItem(GLOBAL_ACTIONS_KEY);
        if (stored) {
            const data = JSON.parse(stored) as StoredActions;
            return data.actions;
        }
    } catch (error) {
        console.error('Failed to load global actions:', error);
    }
    return [];
}

export function saveGlobalActions(actions: string[]) {
    try {
        const data: StoredActions = {
            actions,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(GLOBAL_ACTIONS_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save global actions:', error);
    }
}

export function loadCampaignActions(campaignId: string): string[] {
    try {
        const stored = localStorage.getItem(getCampaignStorageKey(campaignId));
        if (stored) {
            const data = JSON.parse(stored) as StoredActions;
            return data.actions;
        }
    } catch (error) {
        console.error('Failed to load campaign actions:', error);
    }
    return loadGlobalActions(); // Fallback to global actions
}

export function saveCampaignActions(campaignId: string, actions: string[]) {
    try {
        const data: StoredActions = {
            actions,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(getCampaignStorageKey(campaignId), JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save campaign actions:', error);
    }
}