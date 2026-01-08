import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // supabaseに切り替え
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PiggyBank, Plus, X, Check, Pencil } from "lucide-react";

export default function SpendingGoalsCard({ user, onUpdate }) {
  // ユーザーメタデータから取得（メタデータ構造に合わせて調整）
  const [goals, setGoals] = useState(user?.user_metadata?.spending_goals || []);
  const [newGoal, setNewGoal] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const saveGoals = async (updatedGoals) => {
    setGoals(updatedGoals);
    
    // Supabaseのユーザーメタデータに直接保存
    const { error } = await supabase.auth.updateUser({
      data: { spending_goals: updatedGoals }
    });

    if (error) {
      console.error("目標の保存に失敗:", error.message);
    } else if (onUpdate) {
      onUpdate();
    }
  };

  const addGoal = async () => {
    if (!newGoal.trim()) return;
    const updated = [...goals, { 
      id: Date.now().toString(), 
      text: newGoal.trim(), 
      completed: false 
    }];
    await saveGoals(updated);
    setNewGoal("");
    setIsAdding(false);
  };

  const toggleGoal = async (id) => {
    const updated = goals.map(g => 
      g.id === id ? { ...g, completed: !g.completed } : g
    );
    await saveGoals(updated);
  };

  const deleteGoal = async (id) => {
    const updated = goals.filter(g => g.id !== id);
    await saveGoals(updated);
  };

  const startEdit = (goal) => {
    setEditingId(goal.id);
    setEditText(goal.text);
  };

  const saveEdit = async () => {
    if (!editText.trim()) return;
    const updated = goals.map(g => 
      g.id === editingId ? { ...g, text: editText.trim() } : g
    );
    await saveGoals(updated);
    setEditingId(null);
    setEditText("");
  };

  return (
    <Card className="shadow-2xl border border-amber-900/20 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-3 border-b border-amber-900/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-amber-100 text-lg">
            <PiggyBank className="w-5 h-5 text-amber-400" />
            ためる（支出目標）
          </CardTitle>
          {!isAdding && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsAdding(true)}
              className="text-amber-400 hover:text-amber-300 hover:bg-amber-950/40 h-8 w-8 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 px-4 pb-4">
        <div className="space-y-3">
          {isAdding && (
            <div className="flex gap-2 animate-in slide-in-from-top-2 duration-200">
              <Input
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="例: 外食を週2回にする..."
                className="bg-slate-800/50 border-amber-900/30 text-amber-100 placeholder:text-slate-500 flex-1 h-9 text-sm"
                onKeyPress={(e) => e.key === "Enter" && addGoal()}
                autoFocus
              />
              <Button size="sm" onClick={addGoal} className="bg-amber-600 hover:bg-amber-700 text-slate-900 h-9">
                <Check className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)} className="text-slate-400 h-9">
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="max-h-[250px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {goals.length === 0 && !isAdding ? (
              <div className="text-center py-8">
                <PiggyBank className="w-12 h-12 text-slate-700 mx-auto mb-3 opacity-20" />
                <p className="text-slate-500 text-sm italic">目標を追加して資産を守りましょう</p>
              </div>
            ) : (
              goals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl group border border-transparent hover:border-amber-900/20 transition-all duration-200"
                >
                  {editingId === goal.id ? (
                    <div className="flex gap-2 flex-1">
                      <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="bg-slate-700/50 border-amber-900/30 text-amber-100 flex-1 h-8 text-sm"
                        onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                        autoFocus
                      />
                      <Button size="sm" onClick={saveEdit} className="bg-amber-600 h-8">
                        <Check className="w-3 h-3 text-slate-900" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleGoal(goal.id)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          goal.completed 
                            ? "bg-amber-500 border-amber-500" 
                            : "border-slate-600 hover:border-amber-500/50"
                        }`}
                      >
                        {goal.completed && <Check className="w-3 h-3 text-slate-900 stroke-[3px]" />}
                      </button>
                      <span className={`flex-1 text-sm transition-colors ${goal.completed ? "line-through text-slate-500" : "text-amber-50"}`}>
                        {goal.text}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button
                          onClick={() => startEdit(goal)}
                          className="p-1.5 text-slate-500 hover:text-amber-400 hover:bg-amber-400/10 rounded-md transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}