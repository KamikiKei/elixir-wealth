import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { ja } from "date-fns/locale";

import WealthOverview from "@/components/dashboard/WealthOverview";
import MonthlyChart from "@/components/dashboard/MonthlyChart";  
import RecentTransactions from "@/components/dashboard/RecentTransactions";
// 名前を GoalListCard に変更してインポート
import GoalListCard from "@/components/dashboard/GoalListCard";
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
import LuminousChatButton from "@/components/dashboard/LuminousChatButton";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [txResponse, goalResponse] = await Promise.all([
        supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false })
          .limit(100),
        supabase
          .from("savings_goals")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
      ]);

      if (txResponse.error) throw txResponse.error;
      if (goalResponse.error) throw goalResponse.error;
      
      console.log("📥 データ更新成功 - 目標数:", goalResponse.data?.length);
      setTransactions(txResponse.data || []);
      setGoals(goalResponse.data || []);
    } catch (error) {
      console.error("データ読み込みエラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 資産計算ロジック
  const calculateBalance = () => {
    const income = transactions
      .filter(t => t.type === "income" || t.amount > 0)
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const expenses = transactions
      .filter(t => t.type === "expense" || t.amount < 0) 
      .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);
    return { income, expenses, balance: income - expenses };
  };

  const getMonthlyData = () => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const monthlyTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });
    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === "income" || t.amount > 0)
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const monthlyExpenses = monthlyTransactions
      .filter(t => t.type === "expense" || t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);
    return { monthlyIncome, monthlyExpenses, monthlyBalance: monthlyIncome - monthlyExpenses };
  };

  const { income, expenses, balance } = calculateBalance();
  const { monthlyIncome, monthlyExpenses, monthlyBalance } = getMonthlyData();

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 bg-clip-text text-transparent mb-2">
            資産ダッシュボード
          </h1>
          <p className="text-slate-400 font-mono">
            {format(new Date(), "yyyy年M月d日 (E)", { locale: ja })}
          </p>
        </div>

        <div className="space-y-8">
          <LuminousChatButton />
          
          <WealthOverview 
            totalBalance={balance}
            monthlyIncome={monthlyIncome}
            monthlyExpenses={monthlyExpenses}
            monthlyBalance={monthlyBalance}
            isLoading={isLoading}
          />

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <MonthlyChart transactions={transactions} isLoading={isLoading} />
              <RecentTransactions 
                transactions={transactions.slice(0, 10)} 
                isLoading={isLoading}
                onRefresh={loadData}
              />
            </div>
            
            <div className="space-y-8">
              <CategoryBreakdown transactions={transactions} isLoading={isLoading} />
              {/* 新しい名前のコンポーネントを使用 */}
              <GoalListCard 
                goals={goals} 
                isLoading={isLoading}
                onRefresh={loadData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}