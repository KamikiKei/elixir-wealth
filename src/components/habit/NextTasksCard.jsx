import React, { useState, useEffect } from "react";
// ★ 修正: supabase をインポート
import { supabase } from "@/lib/supabaseClient"; 
// ★ 修正: インポートパスをあなたの環境に合わせる
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CheckCircle2, Circle, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NextTasksCard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      // ★ 修正: Supabase から「未完了」のタスクを5件取得
      const { data, error } = await supabase
        .from("workflow_tasks")
        .select("*")
        .eq("status", "pending")
        .order("order", { ascending: true })
        .limit(5);

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error("タスク読み込みエラー:", error);
    }
    setIsLoading(false);
  };

  const toggleTask = async (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    
    // ★ 修正: Supabase のステータスを更新
    const { error } = await supabase
      .from("workflow_tasks")
      .update({ status: newStatus })
      .eq("id", task.id);

    if (!error) loadTasks();
  };

  if (isLoading || tasks.length === 0) return null;

  return (
    <Card className="shadow-2xl border border-amber-900/20 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-100">
          <Target className="w-5 h-5 text-amber-400" />
          今やるべきこと
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* 上位2件だけを表示してスッキリさせる設計 */}
          {tasks.slice(0, 2).map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-all group"
              onClick={() => toggleTask(task)}
            >
              {task.status === "completed" ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-5 h-5 text-slate-500 group-hover:text-amber-400 flex-shrink-0 mt-0.5 transition-colors" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${task.status === "completed" ? "line-through text-slate-500" : "text-amber-100"}`}>
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{task.description}</p>
                )}
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] flex-shrink-0 font-bold uppercase ${
                task.priority === "high" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                task.priority === "medium" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" :
                "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              }`}>
                {task.priority === "high" ? "高" : task.priority === "medium" ? "中" : "低"}
              </span>
            </div>
          ))}
        </div>
        
        {tasks.length > 2 && (
          <button
            onClick={() => navigate("/projects")}
            className="w-full mt-4 text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium"
          >
            他のタスクを見る ({tasks.length - 2}件) →
          </button>
        )}
      </CardContent>
    </Card>
  );
}