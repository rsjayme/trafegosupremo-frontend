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

    const renderCustomLabel = ({ name, percent }: { name: string; percent: number }) => {
        return `${name}: ${(percent * 100).toFixed(1)}%`;
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
            <CardContent className="h-[500px] p-8">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        Carregando...
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 40, right: 80, bottom: 20, left: 80 }}>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={{
                                    stroke: 'rgba(156, 163, 175, 0.5)',
                                    strokeWidth: 1,
                                    strokeDasharray: '3',
                                }}
                                label={(props) => {
                                    const RADIAN = Math.PI / 180;
                                    const radius = 100 + 80;
                                    const x = props.cx + radius * Math.cos(-props.midAngle * RADIAN);
                                    const y = props.cy + radius * Math.sin(-props.midAngle * RADIAN);

                                    return (
                                        <text
                                            x={x}
                                            y={y}
                                            className="fill-muted-foreground text-sm font-medium"
                                            textAnchor={x > props.cx ? 'start' : 'end'}
                                            dominantBaseline="central"
                                        >
                                            {renderCustomLabel(props)}
                                        </text>
                                    );
                                }}
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                animationBegin={0}
                                animationDuration={1000}
                                animationEasing="ease-out"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                wrapperStyle={{ zIndex: 100 }}
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: 'calc(var(--radius) - 2px)',
                                    padding: '12px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    fontSize: '14px'
                                }}
                                formatter={(value: number) => [`${value.toLocaleString()}`, '']}
                            />
                            <Legend
                                layout="horizontal"
                                verticalAlign="bottom"
                                align="center"
                                wrapperStyle={{
                                    paddingTop: '30px'
                                }}
                                formatter={(value) => (
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {value}
                                    </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
};

export default PieChartWidget;