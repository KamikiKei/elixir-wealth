import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { GoalService } from "@/services/GoalService"; // 新しい名前のサービスを読み込み
import { Target, Plus } from "lucide-react";

export default function GoalCreateModal({ trigger, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    target_amount: "",
    current_amount: "0",
    target_date: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔥 保存リクエスト送信:", formData);
    setIsSubmitting(true);

    try {
      await GoalService.create({
        title: formData.title,
        target_amount: parseFloat(formData.target_amount),
        current_amount: parseFloat(formData.current_amount),
        target_date: formData.target_date,
        status: "active",
      });

      console.log("✅ 目標の保存に成功しました");
      
      // フォームをリセット
      setFormData({
        title: "",
        target_amount: "",
        current_amount: "0",
        target_date: "",
      });
      
      setOpen(false); // モーダルを閉じる
      if (onSuccess) onSuccess(); // 親コンポーネント（Dashboard）のデータを更新
    } catch (error) {
      console.error("保存エラー:", error);
      alert("保存中にエラーが発生しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            type="button"
            size="sm" 
            className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-slate-900 shadow-lg shadow-amber-900/50"
          >
            <Plus className="w-4 h-4 mr-1" />
            目標を追加
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-amber-900/30 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-100">
            <Target className="w-5 h-5 text-amber-400" />
            新しい貯蓄目標を設定
          </DialogTitle>
          <DialogDescription className="sr-only">
            貯蓄目標を作成します
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-amber-200">目標の名前</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="例: 夏休み旅行、新車購入"
              required
              className="bg-slate-800 border-amber-900/30 text-amber-100 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target_amount" className="text-amber-200">目標金額 (¥)</Label>
              <Input
                id="target_amount"
                type="number"
                value={formData.target_amount}
                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                placeholder="100000"
                required
                min="0"
                className="bg-slate-800 border-amber-900/30 text-amber-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_amount" className="text-amber-200">現在の貯蓄額 (¥)</Label>
              <Input
                id="current_amount"
                type="number"
                value={formData.current_amount}
                onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
                placeholder="0"
                min="0"
                className="bg-slate-800 border-amber-900/30 text-amber-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_date" className="text-amber-200">いつまでに達成しますか？</Label>
            <Input
              id="target_date"
              type="date"
              value={formData.target_date}
              onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
              required
              className="bg-slate-800 border-amber-900/30 text-amber-100"
            />
          </div>

          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-slate-900 font-bold"
            >
              {isSubmitting ? "保存中..." : "目標を保存する"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}