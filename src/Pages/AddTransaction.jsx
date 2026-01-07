import React, { useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient"; // Supabaseクライアント
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { ArrowUp, ArrowDown, Save, RefreshCw, Camera, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// カテゴリラベル定義
const categoryLabels = {
  salary: "給与・賞与", investment: "投資収益", business: "事業収入", other_income: "その他収入",
  food: "食費", transportation: "交通費", housing: "住居費", utilities: "光熱費", entertainment: "娯楽費", 
  shopping: "買い物", healthcare: "医療費", education: "教育費", insurance: "保険", other_expense: "その他支出"
};

export default function AddTransaction() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("expense"); // 初期値を支出に
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingReceipt, setIsProcessingReceipt] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });
  
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    title: "", // descriptionの代わりにDBのカラム名に合わせる
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

  const incomeCategories = ["salary", "investment", "business", "other_income"];
  const expenseCategories = ["food", "transportation", "housing", "utilities", "entertainment", "shopping", "healthcare", "education", "insurance", "other_expense"];

  // フォーム送信（Supabaseへ保存）
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const { error } = await supabase
        .from("transactions")
        .insert([
          {
            type: formData.type,
            amount: formData.type === "expense" ? -Math.abs(parseFloat(formData.amount)) : Math.abs(parseFloat(formData.amount)),
            category: formData.category,
            title: formData.title || formData.description,
            date: formData.date
          }
        ]);

      if (error) throw error;

      setStatusMessage({ type: "success", text: "取引を正常に保存しました。ダッシュボードに戻ります..." });
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("保存失敗:", error);
      setStatusMessage({ type: "error", text: "保存に失敗しました。入力内容を確認してください。" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 画像をBase64に変換
  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  // レシート解析処理
  const handleReceiptCapture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingReceipt(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const base64Image = await toBase64(file);
      const prompt = `このレシート画像を解析し、JSON形式で抽出してください: amount (数値), date (YYYY-MM-DD), store_name (店舗名), category (food, shopping, entertainment, other_expenseから選択), items (商品名の要約)`;

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt, 
          image: base64Image.split(',')[1] 
        }),
      });

      const result = await response.json();
      const data = typeof result === 'string' ? JSON.parse(result) : result;

      if (data) {
        setFormData({
          ...formData,
          type: "expense",
          amount: data.amount?.toString() || "",
          category: data.category || "other_expense",
          title: data.store_name || data.items || "",
          date: data.date || new Date().toISOString().split('T')[0]
        });
        setActiveTab("expense");
      }
    } catch (error) {
      console.error("レシート解析失敗:", error);
      setStatusMessage({ type: "error", text: "AI解析に失敗しました。手動で入力してください。" });
    } finally {
      setIsProcessingReceipt(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate("/")} className="mb-6 flex items-center text-slate-400 hover:text-amber-400 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> ダッシュボードへ戻る
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-amber-100 bg-clip-text text-transparent mb-2">取引を記録</h1>
          <p className="text-slate-500 text-sm">ルミナスの監視下で、全ての支出を正当化してください</p>
        </div>

        {statusMessage.text && (
          <div className={`mb-6 p-4 rounded-xl border ${statusMessage.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
            {statusMessage.text}
          </div>
        )}

        {/* レシート撮影カード */}
        <Card className="mb-6 border-amber-900/20 bg-slate-900/50 backdrop-blur-md shadow-2xl">
          <CardHeader><CardTitle className="text-amber-100 flex items-center gap-2 text-lg"><Camera className="w-5 h-5 text-amber-500" /> AIレシート解析</CardTitle></CardHeader>
          <CardContent>
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleReceiptCapture} className="hidden" />
            <Button onClick={() => fileInputRef.current?.click()} disabled={isProcessingReceipt} className="w-full h-14 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-bold text-lg">
              {isProcessingReceipt ? <RefreshCw className="mr-2 animate-spin" /> : <Camera className="mr-2" />}
              {isProcessingReceipt ? "演算中..." : "レシートを撮影"}
            </Button>
          </CardContent>
        </Card>

        {/* 入力フォームカード */}
        <Card className="border-amber-900/20 bg-slate-900/50 backdrop-blur-md shadow-2xl overflow-hidden">
          {/* タブの代替実装 */}
          <div className="flex border-b border-slate-800">
            <button onClick={() => {setActiveTab("income"); setFormData(p => ({...p, type: "income"}))}} className={`flex-1 py-4 font-bold transition-all ${activeTab === "income" ? "text-amber-400 border-b-2 border-amber-500 bg-amber-500/5" : "text-slate-500 hover:text-slate-300"}`}>収入</button>
            <button onClick={() => {setActiveTab("expense"); setFormData(p => ({...p, type: "expense"}))}} className={`flex-1 py-4 font-bold transition-all ${activeTab === "expense" ? "text-amber-400 border-b-2 border-amber-500 bg-amber-500/5" : "text-slate-500 hover:text-slate-300"}`}>支出</button>
          </div>

          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>金額 (円)</Label>
                  <Input type="number" placeholder="0" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>日付</Label>
                  <Input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>カテゴリ</Label>
                <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                  <SelectTrigger><SelectValue placeholder="カテゴリを選択" /></SelectTrigger>
                  <SelectContent>
                    {(activeTab === "income" ? incomeCategories : expenseCategories).map(cat => (
                      <SelectItem key={cat} value={cat}>{categoryLabels[cat]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>内容 / 店舗名</Label>
                <Input placeholder="例: スーパー、給与" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>

              <div className="space-y-2">
                <Label>詳細メモ（任意）</Label>
                <Textarea placeholder="ルミナスへの言い訳を入力..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-16 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xl shadow-lg shadow-amber-500/10">
                {isSubmitting ? <RefreshCw className="animate-spin mr-2" /> : <Save className="mr-2" />}
                データを保存
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}