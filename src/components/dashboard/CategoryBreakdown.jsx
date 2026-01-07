import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

const categoryLabels = {
  food: "食費",
  transportation: "交通費",
  housing: "住居費",
  utilities: "光熱費",
  entertainment: "娯楽費", 
  shopping: "買い物",
  healthcare: "医療費",
  education: "教育費",
  insurance: "保険",
  other_expense: "その他支出"
};

const COLORS = [
  '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6b7280'
];

export default function CategoryBreakdown({ transactions, isLoading }) {
  const getCategoryData = () => {
    const expenses = transactions.filter(t => t.type === "expense");
    const categoryTotals = {};
    
    expenses.forEach(transaction => {
      const category = transaction.category;
      categoryTotals[category] = (categoryTotals[category] || 0) + (transaction.amount || 0);
    });

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        name: categoryLabels[category] || category,
        value: amount,
        percentage: 0
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  };

  if (isLoading) {
    return (
      <Card className="shadow-2xl border border-amber-900/20 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-sm">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  const data = getCategoryData();
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  data.forEach(item => {
    item.percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
  });

  return (
    <Card className="shadow-2xl border border-amber-900/20 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-100">
          <Tag className="w-5 h-5 text-amber-400" />
          支出内訳
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8">
            <Tag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">支出データがありません</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-2 mt-4">
              {data.slice(0, 5).map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-slate-400">{item.name}</span>
                  </div>
                  <span className="font-medium text-amber-200">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}