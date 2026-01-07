import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Sparkles, TrendingUp, AlertCircle, RefreshCw, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton.jsx";

export default function AIAdvisor() {
  const [transactions, setTransactions] = useState([]);
  const [advice, setAdvice] = useState(null);
  const [mindsetType, setMindsetType] = useState("conservative_investor");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });
    setTransactions(data || []);
  };

  const generateAdvice = async () => {
    if (transactions.length === 0) {
      setError("分析するための取引データがありません。まず収入と支出を記録してください。");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAdvice(null); // 前のアドバイスをクリア

    try {
      const totalIncome = transactions
        .filter(t => t.type === "income" || t.amount > 0)
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
      
      const totalExpenses = transactions
        .filter(t => t.type === "expense" || t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);

      const categoryBreakdown = transactions
        .filter(t => t.type === "expense" || t.amount < 0)
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
          return acc;
        }, {});

      const prompt = `家計データを分析し、資産形成アドバイスを生成してください。
      収入: ${totalIncome}円, 支出: ${totalExpenses}円, 
      カテゴリ: ${JSON.stringify(categoryBreakdown)}`;

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/luminous-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ message: prompt, isAnalysis: true })
      });

      const result = await response.json();
      setAdvice(result.reply);
      
    } catch (err) {
      setError("AIアドバイスの生成中にエラーが発生しました。");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* ヘッダー */}
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <Brain className="w-8 h-8 text-amber-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold gold-gradient-text tracking-tight">AIファイナンシャルアドバイザー</h1>
          <p className="text-slate-400">あなたの家計データを分析し、資産形成のための個人向けアドバイスを提供します</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* 富豪タイプ設定カード */}
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="text-amber-100 flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-amber-500" /> 理想の富豪タイプ設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-400/60 uppercase tracking-widest px-1">あなたが目指す富豪像を選択</label>
              <select 
                value={mindsetType} 
                onChange={(e) => setMindsetType(e.target.value)}
                className="w-full bg-slate-950/50 border border-amber-900/20 text-amber-100 rounded-xl p-3 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
              >
                <option value="conservative_investor">堅実投資家（バフェット型）</option>
                <option value="aggressive_tech">攻めIT長者（マスク型）</option>
                <option value="balanced_growth">バランス成長型</option>
              </select>
              <p className="text-sm text-slate-500">選択したタイプに基づいて、AIがあなたの支出パターンを評価します</p>
            </div>
            <Button className="w-full py-6 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-bold rounded-xl shadow-lg shadow-amber-900/20 hover:scale-[1.01] transition-transform">
              <Brain className="w-4 h-4 mr-2" /> 富豪適合度を分析
            </Button>
          </CardContent>
        </Card>

        {/* アドバイス生成カード */}
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="text-amber-100 flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-amber-500" /> パーソナライズされた投資アドバイス
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="space-y-1">
                <p className="text-slate-300">取引履歴: <span className="font-bold text-amber-400">{transactions.length}件</span></p>
                <p className="text-sm text-slate-500">最新のデータに基づいて、AIが個人向けの資産形成アドバイスを生成します</p>
              </div>
              <Button 
                onClick={generateAdvice}
                disabled={isLoading}
                className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-8 py-6 rounded-xl transition-all group"
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 group-hover:translate-y-[-2px] transition-transform" />
                    <span>アドバイスを生成</span>
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* エラー表示 */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-400">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* スケルトン（読み込み中） */}
        {isLoading && (
          <Card className="premium-card animate-pulse">
            <CardHeader><Skeleton className="h-6 w-1/3 bg-slate-800" /></CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full bg-slate-800" />
              <Skeleton className="h-4 w-5/6 bg-slate-800" />
              <Skeleton className="h-32 w-full bg-slate-800" />
            </CardContent>
          </Card>
        )}

        {/* 生成されたアドバイス内容 */}
        {advice && !isLoading && (
          <Card className="premium-card border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.05)] animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="border-b border-amber-900/10">
              <CardTitle className="flex items-center gap-2 text-amber-100">
                <Brain className="w-5 h-5 text-amber-500" /> あなた専用の資産形成アドバイス
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-slate-300 leading-relaxed font-medium">
                  {advice}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}