import React from 'react';
import Card from '@/components/common/Card';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { SpendHistory, SpendDistribution } from '../types/dashboard.types';

interface AnalyticsChartsProps {
  spendHistory?: SpendHistory[];
  spendDistribution?: SpendDistribution[];
  loading: boolean;
}

export default function AnalyticsCharts({
  spendHistory = [],
  spendDistribution = [],
  loading,
}: AnalyticsChartsProps) {
  const COLORS = ['#714B67', '#A87D9F', '#583b51', '#DC2626', '#F59E0B'];

  const formatCurrency = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${value.toLocaleString('en-IN')}`;
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Monthly Spend */}
      <Card
        title="Monthly Procurement Spend"
        subtitle="Trend analysis of total contract values over the last 6 months."
        loading={loading}
        hoverLift={false}
      >
        <div className="w-full mt-2">
          {/* Use fixed height for ResponsiveContainer to avoid flexbox height computation bugs */}
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart
              data={spendHistory}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#714B67" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#714B67" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCurrency}
              />
              <Tooltip
                formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Spend']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: '600',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="spend"
                stroke="#714B67"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorSpend)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Spend Distribution */}
      <Card
        title="Spend Distribution"
        subtitle="Proportional purchase breakdown by operational sectors."
        loading={loading}
        hoverLift={false}
      >
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
          <div className="w-full sm:w-1/2 flex justify-center">
            {/* Use fixed height for ResponsiveContainer to avoid flexbox height computation bugs */}
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie
                  data={spendDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {spendDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Share']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2.5 w-full sm:w-1/2 px-4">
            {spendDistribution.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-md flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-xs font-semibold text-slate-600">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
