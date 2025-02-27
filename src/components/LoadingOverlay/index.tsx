"use client";

import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
    message?: string;
}

export function LoadingOverlay({ message = "Carregando..." }: LoadingOverlayProps) {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">{message}</p>
            </div>
        </div>
    );
}

interface LoadingContainerProps {
    isLoading: boolean;
    children: React.ReactNode;
    message?: string;
}

export function LoadingContainer({ isLoading, children, message }: LoadingContainerProps) {
    return (
        <div className="relative min-h-full">
            {isLoading && <LoadingOverlay message={message} />}
            {children}
        </div>
    );
}