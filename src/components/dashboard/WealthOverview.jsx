import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function WealthOverview({ 
  totalBalance, 
  monthlyIncome, 
  monthlyExpenses, 
  monthlyBalance, 
  isLoading 
}) {
  const savingsRate = monthlyIncome > 0 ? (monthlyBalance / monthlyIncome) * 100 : 0;

  const cards = [
    {
      title: "総資産",
      value: `¥${totalBalance.toLocaleString()}`,
      icon: DollarSign,
      color: totalBalance >= 0 ? "emerald" : "red",
      bgGradient: "from-emerald-500 to-emerald-600"
    },
    {
      title: "今月の収入",
      value: `¥${monthlyIncome.toLocaleString()}`,
      icon: TrendingUp,
      color: "blue",
      bgGradient: "from-blue-500 to-blue-600"
    },
    {
      title: "今月の支出",
      value: `¥${monthlyExpenses.toLocaleString()}`,
      icon: TrendingDown,
      color: "red",
      bgGradient: "from-red-500 to-red-600"
    },
    {
      title: "今月の収支",
      value: `¥${monthlyBalance.toLocaleString()}`,
      icon: PiggyBank,
      color: monthlyBalance >= 0 ? "amber" : "red",
      bgGradient: monthlyBalance >= 0 ? "from-amber-500 to-amber-600" : "from-red-500 to-red-600"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="shadow-2xl border border-amber-900/20 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="relative overflow-hidden shadow-2xl border border-amber-900/20 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-sm hover:shadow-amber-900/20 hover:border-amber-800/40 transition-all duration-300 group">
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.bgGradient} rounded-full opacity-5 transform translate-x-12 -translate-y-12 group-hover:scale-110 transition-transform duration-300`} />
          
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center justify-between">
              {card.title}
              <div className={`p-2 rounded-lg bg-gradient-to-br ${card.bgGradient} bg-opacity-20`}>
                <card.icon className={`w-4 h-4 text-amber-400`} />
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="text-2xl font-bold text-amber-100 mb-1">
              {card.value}
            </div>
            {index === 3 && (
              <div className={`text-xs font-medium ${savingsRate >= 0 ? 'text-amber-400' : 'text-red-400'}`}>
                貯蓄率: {savingsRate.toFixed(1)}%
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}