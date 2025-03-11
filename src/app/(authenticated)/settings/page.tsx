'use client';

import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { PasswordChange } from '@/components/settings/PasswordChange';

export default function SettingsPage() {
    return (
        <SettingsLayout>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Configurações</h3>
                    <p className="text-sm text-muted-foreground">
                        Gerencie suas preferências e configurações de conta
                    </p>
                </div>
                <div className="divide-y divide-border rounded-md border">
                    <PasswordChange />
                </div>
            </div>
        </SettingsLayout>
    );
}