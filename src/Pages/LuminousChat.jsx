import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Brain, Target, TrendingUp, Send, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AIAdvisor() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("analysis");
  const [mindsetType, setMindsetType] = useState("conservative_investor");
  const [txCount, setTxCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 初期データの取得（分析用）
  useEffect(() => {
    async function fetchStats() {
      const { count } = await supabase.from("transactions").select('*', { count: 'exact', head: true });
      setTxCount(count || 0);
    }
    fetchStats();
  }, []);

  // AIアドバイス生成（チャットモードへ移行）
  const startAdvice = () => {
    setMessages([
      {
        role: "assistant",
        content: "演算完了。現在のデータを分析しました。あなたの資産を最大化するための論理的戦略を提示します。何から確認しますか？"
      }
    ]);
    setMode("chat");
  };

  if (mode === "analysis") {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-500/30">
            <Brain className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gold-gradient-text">AIファイナンシャルアドバイザー</h1>
            <p className="text-slate-400">あなたの家計データを分析し、資産形成のための戦略を提供します</p>
          </div>
        </div>

        {/* 理想の富豪タイプ設定 */}
        <Card className="premium-card border-amber-500/20">
          <CardHeader>
            <CardTitle className="text-amber-100 flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-500" /> 理想の富豪タイプ設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-xs text-amber-400/80 font-bold uppercase tracking-widest">あなたが目指す富豪像を選択</p>
            <select 
              value={mindsetType}
              onChange={(e) => setMindsetType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-amber-500 outline-none appearance-none cursor-pointer"
            >
              <option value="conservative_investor">堅実投資家（バフェット型）</option>
              <option value="aggressive_tech">攻めIT長者（マスク型）</option>
              <option value="balanced_growth">バランス成長型</option>
            </select>
            <Button 
              className="w-full py-6 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-black rounded-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all"
            >
              <Sparkles className="w-5 h-5 mr-2" /> 富豪適合度を分析
            </Button>
          </CardContent>
        </Card>

        {/* パーソナライズされた投資アドバイス */}
        <Card className="premium-card bg-slate-900/40">
          <CardHeader>
            <CardTitle className="text-amber-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> パーソナライズされた投資アドバイス
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-slate-400">取引履歴: <span className="text-amber-400 font-bold">{txCount}件</span></p>
              <p className="text-xs text-slate-500">最新のデータに基づいて、AIが個人向けの資産形成アドバイスを生成します</p>
            </div>
            <Button 
              onClick={startAdvice}
              className="bg-amber-600/20 hover:bg-amber-600/40 text-amber-400 border border-amber-500/30 px-8 py-6 rounded-xl group"
            >
              <TrendingUp className="w-5 h-5 mr-2 group-hover:animate-bounce" /> アドバイスを生成
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 以下、チャットモードの表示
  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-in slide-in-from-bottom-4 duration-500">
      <Button variant="ghost" onClick={() => setMode("analysis")} className="text-slate-400">
        <ArrowLeft className="w-4 h-4 mr-2" /> 分析ページに戻る
      </Button>
      
      <Card className="premium-card h-[600px] flex flex-col">
        <CardHeader className="border-b border-white/5">
          <div className="flex items-center gap-3">
            <Sparkles className="text-amber-500" />
            <CardTitle className="gold-gradient-text text-xl">ルミナス・プロトコル</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                m.role === "user" ? "bg-amber-500 text-slate-900 font-bold" : "bg-slate-800/50 text-slate-200 border border-white/5"
              }`}>
                {m.content}
              </div>
            </div>
          ))}
        </CardContent>
        <div className="p-4 border-t border-white/5 bg-slate-950/50">
          <div className="flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ルミナスに問いかける..."
              className="flex-1 bg-transparent border border-white/10 rounded-xl px-4 outline-none focus:border-amber-500 transition-all"
            />
            <Button className="bg-amber-500 text-slate-900 rounded-xl px-6">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}