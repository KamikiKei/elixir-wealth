import React, { useState, useEffect, useRef } from "react";
import { getGeminiResponse } from "@/lib/gemini";
import { supabase } from "@/lib/supabaseClient"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
// スクロールエリアは標準のdivでも代用可能ですが、パスを合わせています
import { ScrollArea } from "@/components/ui/Scroll-area"; 
import { ArrowLeft, Sparkles, Send, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ProjectDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("id");
  const scrollRef = useRef(null);
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  // メッセージ追加時に最下部へスクロール
  useEffect(() => {
    const scrollContainer = document.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const loadProjectData = async () => {
    setIsLoading(true);
    try {
      // ★ 修正: Supabase からプロジェクトとタスクを並列取得
      const [{ data: projectData }, { data: taskData }] = await Promise.all([
        supabase.from("projects").select("*").eq("id", projectId).single(),
        supabase.from("workflow_tasks").select("*").eq("project_id", projectId).order("order", { ascending: true })
      ]);
      
      if (projectData) {
        setProject(projectData);
        setTasks(taskData || []);
        
        if (messages.length === 0) {
          setMessages([{
            role: "assistant",
            content: `プロジェクト「${projectData.title}」の戦略立案を開始します。\n\n概要:\n${projectData.description}\n\n具体的な戦略や行動計画について相談しましょう。`
          }]);
        }
      }
    } catch (error) {
      console.error("データ読み込みエラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ★ 修正: AIワークフロー生成ロジック (Edge Functions や API 経由を想定)
  const generateWorkflow = async () => {
    setIsLoading(true);
  try {
    const prompt = `${project.title}（${project.description}）を成功させるタスクを5つ、JSON形式で提案して。`;
    const responseText = await getGeminiResponse(prompt);
    
    // Geminiが返したテキストをJSONとして読み込む
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    const dummyTasks = JSON.parse(cleanJson);

      const tasksToCreate = dummyTasks.map(task => ({
        ...task,
        project_id: projectId,
        status: "pending"
      }));

      const { error: insertError } = await supabase.from("workflow_tasks").insert(tasksToCreate);
      if (insertError) throw insertError;

      await supabase.from("projects").update({ workflow_generated: true }).eq("id", projectId);
      
      loadProjectData();
    } catch (error) {
      console.error("ワークフロー生成エラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // sendMessageの中身をこれに差し替え
const sendMessage = async () => {
  if (!input.trim() || isLoading) return;

  const userMessage = input.trim();
  setMessages(prev => [...prev, { role: "user", content: userMessage }]);
  setInput("");
  setIsLoading(true);

  try {
    // ★ ここでGeminiを呼び出す
    const prompt = `プロジェクト「${project.title}」について相談です：${userMessage}`;
    const aiText = await getGeminiResponse(prompt); 
    
    setMessages(prev => [...prev, { role: "assistant", content: aiText }]);
  } catch (error) {
    console.error("AI Error:", error);
    setMessages(prev => [...prev, { role: "assistant", content: "エラーが発生しました。" }]);
  }
  setIsLoading(false);
};

  const toggleTaskStatus = async (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    const { error } = await supabase
      .from("workflow_tasks")
      .update({ status: newStatus })
      .eq("id", task.id);
    
    if (!error) loadProjectData();
  };

  if (!project) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/projects")}
          className="mb-6 text-amber-400 hover:text-amber-300 hover:bg-amber-950/40"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          プロジェクト一覧に戻る
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="shadow-2xl border border-amber-900/20 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-amber-100">{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 mb-2 uppercase tracking-widest font-bold">概要</p>
                  <p className="text-slate-300 leading-relaxed">{project.description}</p>
                </div>
                {project.target_income > 0 && (
                  <div>
                    <p className="text-sm text-slate-500 mb-2 uppercase tracking-widest font-bold">目標収入</p>
                    <p className="text-3xl font-bold text-amber-400">¥{Number(project.target_income).toLocaleString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-2xl border border-amber-900/20 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-amber-100">ワークフロー</CardTitle>
                  {!project.workflow_generated && (
                    <Button
                      onClick={generateWorkflow}
                      disabled={isLoading}
                      size="sm"
                      className="bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-bold"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI生成
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-500 mb-6">ワークフローが未作成です</p>
                    <Button onClick={generateWorkflow} disabled={isLoading} variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
                      {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                      戦略ワークフローを構築
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-xl cursor-pointer hover:bg-slate-800/60 transition-all border border-transparent hover:border-amber-900/20"
                        onClick={() => toggleTaskStatus(task)}
                      >
                        {task.status === "completed" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className={`font-semibold ${task.status === "completed" ? "line-through text-slate-600" : "text-amber-50"}`}>
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{task.description}</p>
                          )}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          task.priority === "high" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                          task.priority === "medium" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                          "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}>
                          {task.priority === "high" ? "高" : task.priority === "medium" ? "中" : "低"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AIチャットセクション */}
          <Card className="shadow-2xl border border-amber-900/20 bg-slate-900/50 backdrop-blur-sm flex flex-col h-[700px]">
            <CardHeader className="border-b border-amber-900/10">
              <CardTitle className="flex items-center gap-2 text-amber-100 text-lg">
                <Sparkles className="w-5 h-5 text-amber-400" />
                AI戦略アドバイザー
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          message.role === "user"
                            ? "bg-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-900/20"
                            : "bg-slate-800/80 text-slate-100 border border-amber-900/10"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-800/80 rounded-2xl px-4 py-3">
                        <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-amber-900/20 bg-slate-900/80">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="このプロジェクトの進め方を相談..."
                    disabled={isLoading}
                    className="bg-slate-800/50 border-amber-900/30 text-amber-100 focus:border-amber-500/50 h-11"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 h-11 w-11 p-0"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}