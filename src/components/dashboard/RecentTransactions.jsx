import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowUp, ArrowDown, Receipt, Plus, Utensils, Trash2 } from "lucide-react"; // Trash2を追加
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/Skeleton";
import { supabase } from "@/lib/supabaseClient";

const categoryLabels = {
  salary: "給与・賞与",
  investment: "投資収益",
  business: "事業収入",
  other_income: "その他収入",
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

const getTransactionIcon = (type, category, title) => {
  if (type === "income") return <ArrowUp className="w-4 h-4" />;
  
  const cat = (category || "").toLowerCase();
  const name = (title || "").toLowerCase();
  
  if (cat === "food" || cat === "食費" || name.includes("食") || name.includes("飯")) {
    return <Utensils className="w-4 h-4" />;
  }
  
  return <ArrowDown className="w-4 h-4" />;
};

// ★ onRefresh を受け取るように追加
export default function RecentTransactions({ transactions = [], isLoading, onRefresh }) {
  
  // ★ 削除処理の関数を追加
  const handleDelete = async (id) => {
    if (!window.confirm("この取引を削除しますか？")) return;

    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      // 削除成功したら親コンポーネントのデータを再読み込み
      if (onRefresh) onRefresh();
      
    } catch (error) {
      console.error("削除エラー:", error.message);
      alert("削除に失敗しました。");
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-900/50 border-amber-900/20 backdrop-blur-md shadow-xl">
        <CardHeader className="border-b border-amber-900/10 pb-4">
          <Skeleton className="h-6 w-32 bg-slate-800" />
        </CardHeader>
        <CardContent className="p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between mb-4">
              <div className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full bg-slate-800" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-slate-800" />
                  <Skeleton className="h-3 w-16 bg-slate-800" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 bg-slate-800" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-2xl border border-amber-900/20 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-amber-900/10 pb-4">
        <CardTitle className="flex items-center gap-2 text-amber-100">
          <Receipt className="w-5 h-5 text-amber-400" />
          最近の取引
        </CardTitle>
        <Link to="/add">
          <Button size="sm" className="bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 hover:from-amber-500 hover:to-amber-400 font-bold border-none transition-all duration-300">
            <Plus className="w-4 h-4 mr-1" />
            追加
          </Button>
        </Link>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="divide-y divide-amber-900/10">
          {transactions.length === 0 ? (
            <div className="p-12 text-center">
              <Receipt className="w-12 h-12 text-slate-700 mx-auto mb-3 opacity-20" />
              <p className="text-slate-500">取引データがまだありません</p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-amber-500/5 transition-all duration-200 group">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl transition-transform group-hover:scale-110 ${
                    transaction.type === "income" 
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                      : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                  }`}>
                    {getTransactionIcon(transaction.type, transaction.category, transaction.title)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-200 group-hover:text-amber-100 transition-colors">
                      {transaction.title || categoryLabels[transaction.category] || transaction.category || "未分類"}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-slate-500">
                        {transaction.date ? format(new Date(transaction.date), "M月d日", { locale: ja }) : "-"}
                      </p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded border border-slate-800 text-slate-500 bg-slate-900/50">
                        {categoryLabels[transaction.category] || transaction.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-bold font-mono tracking-tight text-lg ${
                      transaction.type === "income" ? "text-emerald-400" : "text-amber-100"
                    }`}>
                      {transaction.type === "income" ? "+" : "-"}
                      {Math.abs(Number(transaction.amount || 0)).toLocaleString()}
                      <span className="text-xs ml-1 font-sans">円</span>
                    </p>
                  </div>
                  
                  {/* ★ 削除ボタン本体：ホバー時のみ表示 */}
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="削除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}