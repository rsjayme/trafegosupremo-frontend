import { useState, useCallback, useEffect } from 'react';
import {
    loadGlobalActions,
    saveGlobalActions,
    loadCampaignActions,
    saveCampaignActions
} from './storage';

interface UseActionSelectionProps {
    campaignId?: string;
}

export function useActionSelection({ campaignId }: UseActionSelectionProps = {}) {
    // Global actions state
    const [globalActions, setGlobalActions] = useState<string[]>(() =>
        loadGlobalActions()
    );

    // Campaign-specific actions state
    const [campaignActions, setCampaignActions] = useState<string[]>(() =>
        campaignId ? loadCampaignActions(campaignId) : []
    );

    // Persist global actions
    useEffect(() => {
        saveGlobalActions(globalActions);
    }, [globalActions]);

    // Persist campaign actions
    useEffect(() => {
        if (campaignId) {
            saveCampaignActions(campaignId, campaignActions);
        }
    }, [campaignId, campaignActions]);

    // Handle global action selection
    const handleGlobalActionChange = useCallback((actions: string[]) => {
        setGlobalActions(actions);
    }, []);

    // Handle campaign action selection
    const handleCampaignActionChange = useCallback((actions: string[]) => {
        setCampaignActions(actions);
    }, []);

    // Get selected actions based on context
    const selectedActions = campaignId ? campaignActions : globalActions;
    const handleActionChange = campaignId ? handleCampaignActionChange : handleGlobalActionChange;

    return {
        selectedActions,
        onSelectionChange: handleActionChange,
        // Allow access to both global and campaign actions if needed
        globalActions,
        campaignActions,
        setGlobalActions: handleGlobalActionChange,
        setCampaignActions: handleCampaignActionChange
    };
}