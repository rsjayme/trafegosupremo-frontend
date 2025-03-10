import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { aiAnalysisService, type AnalysisResponse } from '@/services/ai-analysis';
import ReactMarkdown from 'react-markdown';

interface AIAnalysisModalProps {
    brandId: number;
    campaignId: string;
    period: {
        since: string;
        until: string;
    };
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AIAnalysisWidget({
    brandId,
    campaignId,
    period,
    open,
    onOpenChange
}: AIAnalysisModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
    const [progress, setProgress] = useState(0);

    // Gerencia a barra de progresso
    useEffect(() => {
        let progressInterval: NodeJS.Timeout;

        if (isLoading) {
            setProgress(0);
            progressInterval = setInterval(() => {
                setProgress(currentProgress => {
                    // Aumenta mais rápido no início e mais devagar conforme se aproxima de 90%
                    if (currentProgress < 30) {
                        return currentProgress + 2;
                    } else if (currentProgress < 60) {
                        return currentProgress + 1;
                    } else if (currentProgress < 90) {
                        return currentProgress + 0.5;
                    }
                    return currentProgress;
                });
            }, 300); // Atualiza a cada 300ms
        } else {
            setProgress(100); // Completa a barra quando terminar
        }

        return () => {
            if (progressInterval) {
                clearInterval(progressInterval);
            }
        };
    }, [isLoading]);

    const handleAnalyze = async () => {
        if (!open) return;

        setIsLoading(true);
        setError(null);

        try {
            const result = await aiAnalysisService.analyzeCampaign({
                brandId,
                campaignId,
                since: period.since,
                until: period.until,
            });

            setAnalysis(result);
        } catch (err) {
            console.error('Erro ao analisar campanha:', err);
            setError(err instanceof Error ? err.message : 'Erro ao analisar campanha');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            handleAnalyze();
        } else {
            setAnalysis(null);
            setError(null);
            setProgress(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, brandId, campaignId, period.since, period.until]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        Análise de Campanha
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                    {isLoading && (
                        <div className="space-y-2">
                            <Progress value={progress} className="w-full" />
                            <p className="text-sm text-muted-foreground text-center">
                                {progress < 30 && "Coletando dados da campanha..."}
                                {progress >= 30 && progress < 60 && "Analisando métricas..."}
                                {progress >= 60 && progress < 90 && "Gerando insights..."}
                                {progress >= 90 && "Finalizando análise..."}
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
                            {error}
                        </div>
                    )}

                    {analysis && !isLoading && (
                        <div className="space-y-6">
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown>
                                    {analysis.analysis}
                                </ReactMarkdown>
                            </div>

                            <div className="mt-6 text-sm text-muted-foreground border-t pt-4">
                                <p>Período analisado: {period.since} até {period.until}</p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}