import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface ChartWidgetProps {
  config?: {
    chartType?: 'bar' | 'line' | 'pie';
    dataSource?: string;
    timeRange?: string;
  };
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} as const;

const sampleBarData = [
  { month: "Jan", value: 186 },
  { month: "Fév", value: 305 },
  { month: "Mar", value: 237 },
  { month: "Avr", value: 73 },
  { month: "Mai", value: 209 },
  { month: "Jun", value: 214 },
];

const sampleLineData = [
  { month: "Jan", employés: 120, projets: 8 },
  { month: "Fév", employés: 125, projets: 12 },
  { month: "Mar", employés: 130, projets: 15 },
  { month: "Avr", employés: 128, projets: 10 },
  { month: "Mai", employés: 135, projets: 18 },
  { month: "Jun", employés: 147, projets: 22 },
];

const samplePieData = [
  { name: 'RH', value: 30, fill: 'hsl(var(--primary))' },
  { name: 'IT', value: 25, fill: 'hsl(var(--secondary))' },
  { name: 'Finance', value: 20, fill: 'hsl(var(--accent))' },
  { name: 'Commercial', value: 15, fill: 'hsl(var(--muted))' },
  { name: 'Autres', value: 10, fill: 'hsl(var(--border))' },
];

export const ChartWidget = ({ config = {} }: ChartWidgetProps) => {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>(config.chartType || 'bar');
  const [timeRange, setTimeRange] = useState(config.timeRange || '6m');

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sampleLineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="employés" stroke="hsl(var(--primary))" strokeWidth={2} />
              <Line type="monotone" dataKey="projets" stroke="hsl(var(--secondary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={samplePieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {samplePieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sampleBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Graphiques analytiques</CardTitle>
            <CardDescription>Visualisation des données de performance</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={chartType} onValueChange={(value: string) => setChartType(value as 'bar' | 'line' | 'pie')}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Barres</SelectItem>
                <SelectItem value="line">Lignes</SelectItem>
                <SelectItem value="pie">Secteurs</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1M</SelectItem>
                <SelectItem value="3m">3M</SelectItem>
                <SelectItem value="6m">6M</SelectItem>
                <SelectItem value="1y">1A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          {renderChart()}
        </ChartContainer>
      </CardContent>
    </Card>
  );
};