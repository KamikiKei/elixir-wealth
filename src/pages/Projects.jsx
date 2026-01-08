import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Plus, Briefcase, TrendingUp, CheckCircle2, Pause, Play, Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target_income: "",
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("読み込み失敗:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("projects").insert({
        title: formData.title,
        description: formData.description,
        target_income: parseFloat(formData.target_income) || 0,
        status: "planning",
        user_id: user.id
      });

      if (error) throw error;

      setFormData({ title: "", description: "", target_income: "" });
      setOpen(false);
      loadProjects();
    } catch (error) {
      console.error("作成失敗:", error.message);
      alert("プロジェクトの作成に失敗しました。");
    }
  };

  // ステータスごとの設定（Tailwindクラスを固定値で定義して確実に適用）
  const statusConfig = {
    planning: { label: "計画中", icon: Briefcase, text: "text-slate-400", bg: "bg-slate-500/20", border: "border-slate-500/30" },
    active: { label: "進行中", icon: Play, text: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/30" },
    paused: { label: "一時停止", icon: Pause, text: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/30" },
    completed: { label: "完了", icon: CheckCircle2, text: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/30" }
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 bg-clip-text text-transparent mb-3">
              収入プロジェクト
            </h1>
            <p className="text-slate-400 font-medium">稼ぐための戦略を管理・実行する</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-slate-900 font-bold px-6 shadow-lg shadow-amber-900/20 transition-all active:scale-95">
                <Plus className="w-5 h-5 mr-2" />
                新規プロジェクト
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-amber-900/30 text-slate-100 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle className="text-amber-100 text-xl">新しいプロジェクトを始動</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-5 mt-4">
                <div className="space-y-2">
                  <Label className="text-amber-200/80">プロジェクト名</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="例: 動画編集代行ビジネス"
                    required
                    className="bg-slate-800/50 border-amber-900/20 text-amber-100 focus:border-amber-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-amber-200/80">目標収入 (¥)</Label>
                  <Input
                    type="number"
                    value={formData.target_income}
                    onChange={(e) => setFormData({ ...formData, target_income: e.target.value })}
                    placeholder="200,000"
                    className="bg-slate-800/50 border-amber-900/20 text-amber-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-amber-200/80">戦略・概要</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="どのようにして収益を上げるかの概要を入力してください..."
                    required
                    rows={4}
                    className="bg-slate-800/50 border-amber-900/20 text-amber-100 resize-none"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-bold py-6 text-lg">
                  プロジェクトを承認
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
            <p className="text-slate-400 animate-pulse">プロジェクトを読み込み中...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
              const config = statusConfig[project.status] || statusConfig.planning;
              const Icon = config.icon;
              
              return (
                <Link 
                  key={project.id} 
                  to={`/projects/detail?id=${project.id}`}
                  className="block group transition-all duration-300 transform hover:-translate-y-2"
                >
                  <Card 
                    className="h-full shadow-2xl border border-amber-900/20 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-sm group-hover:border-amber-500/40 transition-colors"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-xl text-amber-100 group-hover:text-amber-400 transition-colors line-clamp-1">
                          {project.title}
                        </CardTitle>
                        <Icon className={`w-5 h-5 ${config.text}`} />
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className={`px-3 py-1 rounded-full ${config.bg} ${config.text} border ${config.border} text-[10px] font-bold uppercase tracking-wider`}>
                          {config.label}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-400 text-sm line-clamp-3 mb-6 min-h-[4.5rem]">
                        {project.description}
                      </p>
                      <div className="pt-4 border-t border-amber-900/10">
                        {project.target_income > 0 ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-amber-300/80">
                              <TrendingUp className="w-4 h-4" />
                              <span className="text-xs font-medium">目標収入</span>
                            </div>
                            <span className="text-amber-400 font-bold tracking-tight">
                              ¥{Number(project.target_income).toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">目標未設定</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {projects.length === 0 && !isLoading && (
          <div className="flex items-center justify-center py-20">
            <Card className="max-w-md w-full shadow-2xl border border-amber-900/10 bg-slate-900/40 backdrop-blur-md">
              <CardContent className="text-center py-16">
                <Briefcase className="w-20 h-20 text-slate-800 mx-auto mb-6 opacity-50" />
                <h3 className="text-amber-100 text-lg font-bold mb-2">プロジェクトがありません</h3>
                <p className="text-slate-500 text-sm mb-8 px-6">
                  新しいプロジェクトを作成して、複数の収入源を構築する旅を始めましょう。
                </p>
                <Button 
                  onClick={() => setOpen(true)}
                  variant="outline" 
                  className="border-amber-900/40 text-amber-200 hover:bg-amber-900/20"
                >
                  最初のプロジェクトを作成
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}