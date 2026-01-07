import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { Target, Plus } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Skeleton } from "@/components/ui/Skeleton";

export default function SavingsGoals({ goals, isLoading }) {
  if (isLoading) {
    return (
      <Card className="shadow-2xl border border-amber-900/20 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-sm">
        <CardHeader>
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-2xl border border-amber-900/20 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-amber-100">
            <Target className="w-5 h-5 text-amber-400" />
            貯蓄目標
          </CardTitle>
          <Button size="sm" className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-slate-900 shadow-lg shadow-amber-900/50">
            <Plus className="w-4 h-4 mr-1" />
            追加
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">貯蓄目標がありません</p>
            <p className="text-sm text-slate-500 mb-4">目標を設定して貯蓄を始めましょう</p>
            <Button size="sm" className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-slate-900 shadow-lg shadow-amber-900/50">
              <Plus className="w-4 h-4 mr-2" />
              初回目標を設定
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {goals.map((goal) => {
              const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
              const isCompleted = progress >= 100;
              
              return (
                <div key={goal.id} className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-amber-100">{goal.title}</h3>
                      <p className="text-sm text-slate-500">
                        目標日: {format(new Date(goal.target_date), "yyyy年M月d日", { locale: ja })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-amber-200">
                        ¥{goal.current_amount?.toLocaleString()} / ¥{goal.target_amount?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 rounded-full transition-all duration-700 shadow-lg shadow-amber-900/50"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className={`font-medium ${
                      isCompleted ? 'text-amber-400' : progress > 50 ? 'text-amber-500' : 'text-slate-500'
                    }`}>
                      {progress.toFixed(1)}% 達成
                    </span>
                    {isCompleted && (
                      <span className="text-amber-400 font-medium">🎉 達成!</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}