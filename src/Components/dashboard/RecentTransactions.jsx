import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { ArrowUp, ArrowDown, Receipt, Plus } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton.jsx";

const categoryLabels = {
  salary: "給与", investment: "投資", business: "事業", other_income: "その他収入",
  food: "食費", transportation: "交通", housing: "住居", utilities: "光熱費", entertainment: "娯楽", 
  shopping: "買い物", healthcare: "医療", education: "教育", insurance: "保険", other_expense: "その他支出"
};

export default function RecentTransactions({ transactions = [], isLoading, onRefresh }) {
  return (
    <Card className="bg-slate-900/50 border-amber-900/20 backdrop-blur-md shadow-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-amber-900/10 pb-4">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-amber-500" />
          <CardTitle className="text-xl text-amber-100">最近の取引</CardTitle>
        </div>
        <Link to="/add">
          <Button variant="outline" className="h-8 border-amber-500/50 text-amber-500 hover:bg-amber-500/10 rounded-lg text-xs">
            <Plus className="w-4 h-4 mr-1" /> 追加
          </Button>
        </Link>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="divide-y divide-amber-900/10">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              取引データがまだありません。
            </div>
          ) : (
            transactions.map((t) => (
              <div key={t.id} className="p-4 flex items-center justify-between hover:bg-amber-500/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${t.amount > 0 ? "bg-emerald-500/10" : "bg-amber-500/10"}`}>
                    {t.amount > 0 ? (
                      <ArrowUp className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <ArrowDown className="w-5 h-5 text-amber-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-200">{t.title || t.category || "未分類"}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-slate-500">
                        {t.date ? format(new Date(t.date), "M月d日", { locale: ja }) : "-"}
                      </p>
                      <Badge variant={t.amount > 0 ? "success" : "warning"} className="text-[10px] py-0 px-1.5 opacity-80">
                        {categoryLabels[t.category] || t.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold tracking-tighter ${t.amount > 0 ? "text-emerald-400" : "text-amber-100"}`}>
                    {t.amount > 0 ? "+" : ""}{t.amount?.toLocaleString()}円
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}