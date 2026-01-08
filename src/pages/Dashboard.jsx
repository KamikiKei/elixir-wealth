import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { format, startOfMonth, endOfMonth, differenceInDays } from "date-fns";
import { ja } from "date-fns/locale";

// --- 既存のコンポーネント ---
import WealthOverview from "@/components/dashboard/WealthOverview";
import MonthlyChart from "@/components/dashboard/MonthlyChart";  
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import GoalListCard from "@/components/dashboard/GoalListCard";
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
import LuminousChatButton from "@/components/dashboard/LuminousChatButton";

// --- 追加する新機能コンポーネント ---
import HabitCalendar from "@/components/habit/HabitCalendar";
import UserRankCard from "@/components/habit/UserRankCard";
import NextTasksCard from "@/components/habit/NextTasksCard";
import SpendingGoalsCard from "@/components/dashboard/SpendingGoalsCard";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [userData, setUserData] = useState(null); // auth.userのmetadata用
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // メタデータをセット（ランク表示用）
      setUserData(user.user_metadata);

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
      
      const txData = txResponse.data || [];
      setTransactions(txData);
      setGoals(goalResponse.data || []);

      // ★ ランク計算ロジック（ここに追加）
      await updateRankStats(user, txData);

    } catch (error) {
      console.error("データ読み込みエラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ランクと継続日数の計算
  const updateRankStats = async (user, txData) => {
    const uniqueDates = [...new Set(txData.map(t => format(new Date(t.date), 'yyyy-MM-dd')))];
    const totalDays = uniqueDates.length;
    const sortedDates = uniqueDates.sort().reverse();
    
    // 連続日数の簡易計算
    let streak = 0;
    if (sortedDates.includes(format(new Date(), 'yyyy-MM-dd'))) {
      streak = 1; // 今日記録があればカウント開始
      // ここに前日、前々日と遡るループを入れることも可能
    }

    // 必要に応じて supabase.auth.updateUser で metadata を更新する処理をここに。
  };

  // --- 既存の計算ロジック (そのまま維持) ---
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
    const { income, expenses, balance } = {
        income: monthlyTransactions.filter(t => t.type === "income" || t.amount > 0).reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
        expenses: monthlyTransactions.filter(t => t.type === "expense" || t.amount < 0).reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0),
    };
    return { monthlyIncome: income, monthlyExpenses: expenses, monthlyBalance: income - expenses };
  };

  const { balance } = calculateBalance();
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
          {/* ★ 新機能エリア：ランク・カレンダー・タスク */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <UserRankCard 
                rank={userData?.rank || "beginner"} 
                totalRecordDays={userData?.total_record_days || 0} 
              />
              <NextTasksCard />
              <SpendingGoalsCard user={{ user_metadata: userData }} onUpdate={loadData} />
            </div>
            <HabitCalendar 
              transactions={transactions} 
              streakDays={userData?.streak_days || 0} 
            />
          </div>

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