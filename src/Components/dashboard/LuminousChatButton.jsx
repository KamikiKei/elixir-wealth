import React from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card.jsx";

export default function LuminousChatButton() {
  return (
    <Link to="/advisor" className="block transition-transform hover:scale-[1.01] active:scale-[0.99]">
      <Card className="bg-gradient-to-r from-amber-600/20 via-amber-500/10 to-transparent border-amber-500/30 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <Sparkles className="w-24 h-24 text-amber-500" />
        </div>
        
        <CardContent className="p-6 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-900/40">
              <MessageCircle className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-100 flex items-center gap-2">
                ルミナスと対話する
                <span className="text-[10px] bg-amber-500 text-slate-900 px-2 py-0.5 rounded-full uppercase tracking-tighter">AI Online</span>
              </h3>
              <p className="text-slate-400 text-sm">現在の財務状況を演算し、最適な生存戦略を提案します。</p>
            </div>
          </div>
          
          <div className="hidden md:block px-6 py-2 bg-amber-500 text-slate-900 font-bold rounded-xl shadow-lg shadow-amber-500/20">
            アドバイスを受ける
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}