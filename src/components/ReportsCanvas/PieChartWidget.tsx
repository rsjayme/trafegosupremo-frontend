import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { FacebookInsightsService } from '@/services/facebook-insights';
import { Widget } from "@/app/(authenticated)/relatorios/page";

const COLORS = [
    'rgba(147, 51, 234, 0.8)',  // Purple
    'rgba(59, 130, 246, 0.8)',  // Blue
    'rgba(16, 185, 129, 0.8)',  // Green
    'rgba(245, 158, 11, 0.8)',  // Amber
    'rgba(239, 68, 68, 0.8)',   // Red
    'rgba(236, 72, 153, 0.8)',  // Pink
];

interface ChartData {
    name: string;
    value: number;
}

interface PieChartProps {
    widget: Widget;
    data: {
        accounts: Array<{ id: string }>;
        since: string;
        until: string;
    };
}

const PieChartWidget = ({ widget, data }: PieChartProps) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [chartData, setChartData] = useState<ChartData[]>([]);

    const insightsService = new FacebookInsightsService();

    const fetchData = async () => {
        if (!data.accounts[0]?.id) return;

        try {
            setLoading(true);
            setError(null);

            let rawData;
            let processedData: Record<string, number>;

            const currentBreakdown = widget.config.breakdown || 'demographics';
            const currentMetric = widget.config.metric || 'impressions';

            switch (currentBreakdown) {
                case 'demographics':
                    rawData = await insightsService.getDemographics(data.accounts[0].id, data.since, data.until);
                    processedData = insightsService.groupByAge(rawData, currentMetric);
                    break;
                case 'devices':
                    rawData = await insightsService.getDevices(data.accounts[0].id, data.since, data.until);
                    processedData = insightsService.groupByDevice(rawData, currentMetric);
                    break;
                case 'locations':
                    rawData = await insightsService.getLocations(data.accounts[0].id, data.since, data.until);
                    processedData = insightsService.groupByRegion(rawData, currentMetric);
                    break;
                default:
                    rawData = await insightsService.getDemographics(data.accounts[0].id, data.since, data.until);
                    processedData = insightsService.groupByAge(rawData, currentMetric);
            }

            const formattedData = Object.entries(processedData).map(([name, value]) => ({
                name,
                value: Number(value)
            }));

            setChartData(formattedData);
        } catch (err) {
            console.error('Erro ao buscar dados:', err);
            setError('Erro ao carregar dados do gráfico');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [data.accounts[0]?.id, data.since, data.until, widget.config.breakdown, widget.config.metric]);

    interface PieLabel {
        cx: number;
        cy: number;
        percent: number;
        innerRadius: number;
        outerRadius: number;
        midAngle: number;
        name: string;
        value: number;
    }

    const renderOuterLabel = ({ value }: PieLabel) => {
        return value.toLocaleString();
    };

    const renderInnerLabel = ({ percent, cx, cy, innerRadius, outerRadius, midAngle }: PieLabel) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        const percentValue = (percent * 100);

        // Não mostrar porcentagem se o segmento for menor que 5%
        if (percentValue < 5) return null;

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontSize: '12px', fontWeight: 'bold' }}
            >
                {`${percentValue.toFixed(1)}%`}
            </text>
        );
    };

    if (error) {
        return (
            <Card>
                <CardContent className="h-[400px] flex items-center justify-center">
                    <div className="text-red-500">{error}</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="h-[500px] p-4">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        Carregando...
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                label={renderOuterLabel}
                                labelLine={true}
                                innerRadius={60}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                label={renderInnerLabel}
                                labelLine={false}
                                innerRadius={60}
                                outerRadius={120}
                                fill="transparent"
                                dataKey="value"
                                isAnimationActive={false}
                                activeIndex={[]}
                            />
                            <Tooltip
                                formatter={(value: number, name: string) => [value.toLocaleString(), name]}
                            />
                            <Legend
                                layout="horizontal"
                                verticalAlign="bottom"
                                align="center"
                                payload={chartData.map((entry, index) => ({
                                    value: entry.name,
                                    type: 'square',
                                    color: COLORS[index % COLORS.length]
                                }))}
                                wrapperStyle={{
                                    paddingTop: '20px',
                                    marginBottom: '-20px'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
};

export default PieChartWidget;