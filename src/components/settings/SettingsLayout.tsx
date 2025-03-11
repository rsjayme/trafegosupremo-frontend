import { ReactNode } from 'react';

interface SettingsLayoutProps {
    children: ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
    return (
        <div className="container mx-auto py-10">
            <div className="max-w-4xl mx-auto">
                {children}
            </div>
        </div>
    );
}