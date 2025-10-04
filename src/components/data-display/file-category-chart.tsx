'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { formatBytes } from '@/lib/utils';
import type { StudyFile } from '@/lib/types';

interface FileCategoryChartProps {
  files: StudyFile[];
}

export function FileCategoryChart({ files }: FileCategoryChartProps) {
  const processedData = React.useMemo(() => {
    const categoryMap: { [key: string]: { size: number; count: number } } = {};
    files.forEach((file) => {
      const category = file.category || 'Uncategorized';
      if (!categoryMap[category]) {
        categoryMap[category] = { size: 0, count: 0 };
      }
      categoryMap[category].size += file.file_size;
      categoryMap[category].count += 1;
    });

    return Object.entries(categoryMap).map(([name, data]) => ({
      name: name.length > 25 ? `${name.substring(0, 22)}...` : name,
      full_name: name,
      ...data,
    })).sort((a, b) => b.size - a.size);
  }, [files]);

  const chartConfig = {
    size: {
      label: "Total Size",
      color: "hsl(var(--accent))",
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
          <XAxis type="number" tickFormatter={(value) => formatBytes(value as number)} />
          <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
          <Tooltip
            cursor={{ fill: 'hsl(var(--muted))' }}
            content={<ChartTooltipContent 
                formatter={(value, name, item) => {
                    const payload = item.payload;
                    return (
                        <div className="text-sm">
                            <div className="font-bold">{payload.full_name}</div>
                            <div>Total Size: {formatBytes(payload.size)}</div>
                            <div>File Count: {payload.count}</div>
                        </div>
                    )
                }}
            />}
          />
          <Bar dataKey="size" fill="var(--color-size)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
