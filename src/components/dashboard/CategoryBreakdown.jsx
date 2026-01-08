import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

// カテゴリラベル（日本語・英語どちらのキーが来ても対応できるように強化）
const categoryLabels = {
  salary: "給与・賞与",
  investment: "投資収益",
  business: "事業収入",
  other_income: "その他収入",
  food: "食費", "食費": "食費",
  transportation: "交通費", "交通費": "交通費",
  housing: "住居費", "住居費": "住居費",
  utilities: "光熱費", "光熱費": "光熱費",
  entertainment: "娯楽費", "娯楽費": "娯楽費",
  shopping: "買い物", "買い物": "買い物",
  healthcare: "医療費", "医療費": "医療費",
  education: "教育費", "教育費": "教育費",
  insurance: "保険", "保険": "保険",
  other_expense: "その他支出", "その他支出": "その他支出"
};

const COLORS = [
  '#fbbf24', // アンバー（金）
  '#10b981', // エメラルド
  '#3b82f6', // ブルー
  '#f87171', // レッド
  '#8b5cf6', // バイオレット
  '#06b6d4', // シアン
  '#fb7185', // ローズ
  '#94a3b8'  // スレート
];

// --- src/components/dashboard/CategoryBreakdown.jsx ---
export default function CategoryBreakdown({ transactions = [], isLoading }) {
  const getCategoryData = () => {
    // 支出のみ抽出
    const expenses = transactions.filter(t => t.type === "expense" || Number(t.amount) < 0);
    const categoryTotals = {};
    
    expenses.forEach(transaction => {
      let key = transaction.category || "other_expense";
      
      // 【重要】名寄せロジック：日本語で保存されている場合に英語キーへ統一
      if (key === "食費") key = "food";
      if (key === "交通費") key = "transportation";
      if (key === "住居費") key = "housing";
      if (key === "光熱費") key = "utilities";
      if (key === "娯楽費") key = "entertainment";
      if (key === "買い物") key = "shopping";
      
      const amount = Math.abs(Number(transaction.amount || 0));
      categoryTotals[key] = (categoryTotals[key] || 0) + amount;
    });

    return Object.entries(categoryTotals)
      .map(([key, amount]) => ({
        // 表示用のラベルを取得。マッピングになければキーをそのまま表示
        name: categoryLabels[key] || key,
        value: amount,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  };

  // --- 描画部分は、Pieコンポーネントに nameKey="name" を必ず追加してください ---
  // <Pie data={data} dataKey="value" nameKey="name" ... />


  if (isLoading) {
    return (
      <Card className="bg-slate-900/50 border-amber-900/20 backdrop-blur-md">
        <CardHeader><Skeleton className="h-6 w-32 bg-slate-800" /></CardHeader>
        <CardContent><Skeleton className="h-48 w-full bg-slate-800" /></CardContent>
      </Card>
    );
  }

  const chartData = getCategoryData();
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="shadow-2xl border border-amber-900/20 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-100">
          <Tag className="w-5 h-5 text-amber-400" />
          支出内訳
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-slate-700 mx-auto mb-3 opacity-20" />
            <p className="text-slate-500">支出データがありません</p>
          </div>
        ) : (
          <>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name" // 【重要】これでツールチップにカテゴリ名が出るようになります
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #451a03', borderRadius: '8px' }}
                    itemStyle={{ color: '#fbbf24' }}
                    formatter={(value) => `¥${Number(value).toLocaleString()}`} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2.5 mt-6">
              {chartData.map((item, index) => {
                const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
                return (
                  <div key={item.key} className="flex items-center justify-between text-sm group">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-slate-400 group-hover:text-slate-200 transition-colors">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-xs font-mono">¥{item.value.toLocaleString()}</span>
                      <span className="font-mono text-amber-200 min-w-[45px] text-right">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}