'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

interface PersonnelChartProps {
  personnel: {
    firstName: string;
    lastName: string;
    roles: string[];
  }[];
}

export function PersonnelChart({ personnel }: PersonnelChartProps) {
  const processedData = React.useMemo(() => {
    const roleCounts: { [key: string]: number } = {};
    personnel.forEach(person => {
        person.roles.forEach(role => {
            roleCounts[role] = (roleCounts[role] || 0) + 1;
        })
    });

    const roleData = Object.entries(roleCounts).map(([name, count]) => ({
      name,
      count,
    })).sort((a,b) => b.count - a.count);

    return roleData.slice(0, 5);

  }, [personnel]);

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  return (
     <ChartContainer config={chartConfig} className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={processedData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" allowDecimals={false} />
          <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
          <Tooltip
            cursor={{ fill: 'hsl(var(--muted))' }}
            content={<ChartTooltipContent 
                formatter={(value, name, item) => {
                    const payload = item.payload;
                    return (
                        <div className="text-sm">
                            <div className="font-bold">{payload.name}</div>
                            <div>Count: {payload.count}</div>
                        </div>
                    )
                }}
            />}
          />
          <Bar dataKey="count" fill="var(--color-count)" radius={4} >
            <LabelList dataKey="count" position="right" offset={8} className="fill-foreground text-sm" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
