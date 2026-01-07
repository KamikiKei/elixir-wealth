import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, startOfMonth, subMonths } from "date-fns";
import { ja } from "date-fns/locale";
import { Skeleton } from "@/components/ui/Skeleton";
import { BarChart3 } from "lucide-react";

export default function MonthlyChart({ transactions, isLoading }) {
  const getChartData = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const month = subMonths(new Date(), i);
      months.push({
        month: format(month, "MM月", { locale: ja }),
        monthStart: startOfMonth(month),
        monthEnd: new Date(month.getFullYear(), month.getMonth() + 1, 0)
      });
    }

    return months.map(({ month, monthStart, monthEnd }) => {
      const monthTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date >= monthStart && date <= monthEnd;
      });

      const income = monthTransactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const expenses = monthTransactions
        .filter(t => t.type === "expense")  
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      return {
        month,
        収入: income,
        支出: expenses,
        純資産: income - expenses
      };
    });
  };

  if (isLoading) {
    return (
      <Card className="shadow-2xl border border-amber-900/20 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-sm">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  const data = getChartData();

  return (
    <Card className="shadow-2xl border border-amber-900/20 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-100">
          <BarChart3 className="w-5 h-5 text-amber-400" />
          月次推移
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="month" 
              stroke="#94a3b8"
              fontSize={12}
            />
            <YAxis 
              stroke="#94a3b8"
              fontSize={12}
              tickFormatter={(value) => `¥${(value / 10000).toFixed(0)}万`}
            />
            <Tooltip 
              formatter={(value, name) => [`¥${value.toLocaleString()}`, name]}
              labelStyle={{ color: '#f1f5f9' }}
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(201, 169, 97, 0.3)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                color: '#f1f5f9'
              }}
            />
            <Bar dataKey="収入" fill="#c9a961" radius={[4, 4, 0, 0]} />
            <Bar dataKey="支出" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}