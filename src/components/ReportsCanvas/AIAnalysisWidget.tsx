import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { aiAnalysisService, type AnalysisResponse } from '@/services/ai-analysis';
import { Loader2 } from 'lucide-react';

interface AIAnalysisWidgetProps {
    brandId: number;
    campaignId: string;
    period: {
        since: string;
        until: string;
    };
}

export function AIAnalysisWidget({ brandId, campaignId, period }: AIAnalysisWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);

    const handleAnalyzeClick = async () => {
        setIsLoading(true);
        setError(null);
        setIsOpen(true);

        try {
            const result = await aiAnalysisService.analyzeCampaign({
                brandId,
                campaignId,
                since: period.since,
                until: period.until,
            });

            setAnalysis(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao analisar campanha');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button
                variant="secondary"
                onClick={handleAnalyzeClick}
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analisando...
                    </>
                ) : (
                    'Analisar com IA'
                )}
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            Análise de Campanha
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-4 space-y-4">
                        {isLoading && (
                            <div className="space-y-2">
                                <Progress value={33} className="w-full" />
                                <p className="text-sm text-muted-foreground text-center">
                                    Analisando dados da campanha...
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-red-50 text-red-700 rounded-md">
                                {error}
                            </div>
                        )}

                        {analysis && !isLoading && (
                            <div className="space-y-4">
                                <div className="prose prose-sm max-w-none">
                                    {analysis.analysis.split('\n').map((paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                                </div>

                                <div className="mt-6 text-sm text-muted-foreground">
                                    <p>Período analisado: {period.since} até {period.until}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}