import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ReceiptText, BrainCircuit, User } from "lucide-react";

const menuItems = [
  { id: "dashboard", label: "ダッシュボード", icon: LayoutDashboard, path: "/" },
  { id: "records", label: "取引記録", icon: ReceiptText, path: "/add" },
  { id: "advisor", label: "AIアドバイザー", icon: BrainCircuit, path: "/advisor" },
];

export default function sidebarLayout({ children }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-200">
      {/* サイドバー */}
      <aside className="w-64 bg-[#1e293b]/50 border-r border-slate-800 flex flex-col p-4 fixed h-full">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-black">W</div>
          <div>
            <h1 className="font-bold text-lg leading-tight">WealthTracker</h1>
            <p className="text-[10px] text-amber-500 font-bold tracking-widest uppercase">Premium</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-2 mb-4">メニュー</p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-gradient-to-r from-amber-600/20 to-transparent border-l-4 border-amber-500 text-amber-500" 
                    : "hover:bg-slate-800 text-slate-400"
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ユーザーセクション */}
        <div className="pt-4 border-t border-slate-800 flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">U</div>
          <div>
            <p className="text-sm font-bold">ユーザー</p>
            <p className="text-[10px] text-slate-500">資産を増やしましょう</p>
          </div>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 ml-64 p-8 bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}