import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { TrendingUp, PlusCircle, Brain, BarChart3, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/Button.jsx";

export default function Layout({ children }) {
  const location = useLocation();
  const [stats, setStats] = useState({ balance: 0, ratio: 0 });
  const [userEmail, setUserEmail] = useState("USER");

  useEffect(() => {
    async function getInitialData() {
      // 1. ユーザー情報の取得
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      }

      // 2. 今月の統計データの取得
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      
      const { data } = await supabase
        .from("transactions")
        .select("amount")
        .gte("date", firstDay);

      if (data) {
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
    { title: "AIアドバイザー", url: "/advisor", icon: Brain },
  ];

  return (
    <div className="min-h-screen flex w-full bg-[#0f1419] text-slate-200 font-sans">
      <style>
        {`
          :root { --wealth-gold: #c9a961; }
          ::-webkit-scrollbar { width: 5px; }
          ::-webkit-scrollbar-track { background: #0f172a; }
          ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
          .premium-bg {
            background: radial-gradient(circle at 0% 0%, #1e293b 0%, #0f172a 100%);
          }
        `}
      </style>

      {/* サイドバー */}
      <aside className="w-64 border-r border-amber-900/20 backdrop-blur-xl bg-slate-900/80 flex flex-col fixed h-full z-50">
        <div className="border-b border-amber-900/20 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <TrendingUp className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h2 className="font-bold text-xl bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 bg-clip-text text-transparent tracking-tight">
                WealthTracker
              </h2>
              <p className="text-[10px] text-amber-500 font-bold tracking-[0.2em] uppercase opacity-80">PREMIUM</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          <div>
            <p className="text-[10px] font-bold text-amber-500/40 uppercase tracking-[0.2em] px-4 mb-4">MENU</p>
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <Link
                    key={item.title}
                    to={item.url}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isActive
                        ? "bg-amber-500/10 text-amber-100 border-l-2 border-amber-500"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? "text-amber-500" : "group-hover:text-amber-500"}`} />
                    <span className="font-medium text-sm">{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* クイック統計 */}
          <div className="px-4">
            <p className="text-[10px] font-bold text-amber-500/40 uppercase tracking-[0.2em] mb-4">QUICK STATS</p>
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

        {/* ユーザーセクション & ログアウト */}
        <div className="border-t border-amber-900/20 p-4 bg-slate-900/40 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
              <span className="text-slate-900 font-black text-xs">
                {userEmail[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-amber-100 text-xs truncate uppercase tracking-tighter">
                {userEmail.split('@')[0]}
              </p>
              <p className="text-[9px] text-slate-500 truncate font-medium">PREMIUM MEMBER</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 h-9 px-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-bold">ログアウト</span>
          </Button>
        </div>
      </aside>

      {/* メインエリア */}
      <main className="flex-1 ml-64 min-h-screen premium-bg">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}