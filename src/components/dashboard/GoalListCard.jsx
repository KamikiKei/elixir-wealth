import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Target } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Skeleton } from "@/components/ui/Skeleton";
// ここで新しく作る「入力モーダル」を読み込みます
import GoalCreateModal from "./GoalCreateModal.jsx";

export default function GoalListCard({ goals, isLoading, onRefresh }) {
  if (isLoading) {
    return (
      <Card className="shadow-2xl border border-amber-900/20 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-sm">
        <CardHeader>
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
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
          {/* 追加ボタンをダイアログコンポーネントに置き換え */}
          <GoalCreateModal onSuccess={onRefresh} />
        </div>
      </CardHeader>
      <CardContent>
        {(!goals || goals.length === 0) ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">貯蓄目標がありません</p>
            <div className="mt-4">
               {/* データがない時用のボタンもモーダルを呼び出すように */}
               <GoalCreateModal onSuccess={onRefresh} />
            </div>
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
                        目標日: {goal.target_date ? format(new Date(goal.target_date), "yyyy年M月d日", { locale: ja }) : '未設定'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-amber-200">
                        ¥{Number(goal.current_amount).toLocaleString()} / ¥{Number(goal.target_amount).toLocaleString()}
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