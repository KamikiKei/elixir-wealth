import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { TrendingUp, PlusCircle, Brain, BarChart3, LogOut, ChevronLeft, Menu, Rocket, Target } from "lucide-react"; 
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/Button.jsx";
import UserRankCard from "@/components/habit/UserRankCard";
import HabitCalendar from "@/components/habit/HabitCalendar";

export default function Layout({ children }) {
  const location = useLocation();
  const [stats, setStats] = useState({ balance: 0, ratio: 0 });
  const [userEmail, setUserEmail] = useState("USER");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function getInitialData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
        setUserData(user.user_metadata); // ランク情報などを含むメタデータを取得
      }

      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      
      const { data } = await supabase
        .from("transactions")
        .select("*") // カレンダー用に全件取得（必要に応じて調整）
        .gte("date", firstDay);

      if (data) {
        setTransactions(data);
        const income = data.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
        const expense = data.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
        const balance = income - expense;
        const ratio = income > 0 ? Math.min(Math.round((balance / income) * 100), 100) : 0;
        setStats({ balance, ratio: Math.max(ratio, 0) });
      }
    }
    getInitialData();
  }, [location.pathname]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout error:", error.message);
  };

  const navigationItems = [
    { title: "ダッシュボード", url: "/", icon: BarChart3 },
    { title: "取引記録", url: "/add", icon: PlusCircle },
    { title: "プロジェクト", url: "/projects", icon: Rocket }, // ★追加
    { title: "AIアドバイザー", url: "/advisor", icon: Brain },
  ];

  return (
    <div className="min-h-screen flex w-full bg-[#0f1419] text-slate-200 font-sans transition-all duration-500">
      <style>
        {`
          :root { --wealth-gold: #c9a961; }
          ::-webkit-scrollbar { width: 5px; }
          ::-webkit-scrollbar-track { background: #0f172a; }
          ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
          .premium-bg {
            background: radial-gradient(circle at 0% 0%, #1e293b 0%, #0f172a 100%);
          }
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        `}
      </style>

      <aside className={`${isCollapsed ? "w-20" : "w-80"} border-r border-amber-900/20 backdrop-blur-xl bg-slate-900/80 flex flex-col fixed h-full z-50 transition-all duration-300 ease-in-out`}>
        
        <div className="border-b border-amber-900/20 p-4 relative">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-slate-900" />
            </div>
            {!isCollapsed && (
              <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                <h2 className="font-bold text-lg bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 bg-clip-text text-transparent tracking-tight whitespace-nowrap">
                  WealthTracker
                </h2>
                <p className="text-[9px] text-amber-500 font-bold tracking-[0.2em] uppercase opacity-80">PREMIUM</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 hover:bg-amber-400 transition-colors shadow-lg z-50"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-6 mt-4 custom-scrollbar">
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative ${
                    isActive
                      ? "bg-amber-500/10 text-amber-100 border-l-2 border-amber-500"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <item.icon className={`w-6 h-6 flex-shrink-0 ${isActive ? "text-amber-500" : "group-hover:text-amber-500"}`} />
                  {!isCollapsed && (
                    <span className="font-medium text-sm animate-in fade-in duration-300">{item.title}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ★追加: 通常時のみ表示する成長セクション */}
          {!isCollapsed && (
            <div className="space-y-6 px-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="scale-90 origin-top">
                <UserRankCard 
                  rank={userData?.rank || "beginner"} 
                  totalRecordDays={userData?.total_record_days || 0} 
                />
              </div>
              <div className="scale-[0.85] origin-top">
                <HabitCalendar 
                  transactions={transactions} 
                  streakDays={userData?.streak_days || 0} 
                />
              </div>

              {/* クイック統計 */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-amber-500/40 uppercase tracking-[0.2em]">QUICK STATS</p>
                <div className="p-4 bg-slate-950/40 rounded-2xl border border-amber-900/10 space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">今月の収支</span>
                      <span className={`font-bold ${stats.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {stats.balance.toLocaleString()}円
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">貯蓄率</span>
                      <span className="font-bold text-amber-400">{stats.ratio}%</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 rounded-full transition-all duration-1000"
                      style={{ width: `${stats.ratio}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={`border-t border-amber-900/20 bg-slate-900/40 transition-all ${isCollapsed ? "p-2" : "p-4"}`}>
          <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center mb-2" : "px-1 mb-4"}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
              <span className="text-slate-900 font-black text-xs">
                {userEmail[0].toUpperCase()}
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 animate-in fade-in duration-300">
                <p className="font-bold text-amber-100 text-xs truncate uppercase tracking-tighter">
                  {userEmail.split('@')[0]}
                </p>
                <p className="text-[9px] text-slate-500 truncate font-medium">PREMIUM MEMBER</p>
              </div>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className={`w-full ${isCollapsed ? "justify-center px-0" : "justify-start px-2"} gap-3 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 h-10 transition-all`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="text-xs font-bold">ログアウト</span>}
          </Button>
        </div>
      </aside>

      <main className={`flex-1 ${isCollapsed ? "ml-20" : "ml-80"} min-h-screen premium-bg transition-all duration-300 ease-in-out`}>
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}