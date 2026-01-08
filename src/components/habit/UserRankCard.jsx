import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Trophy, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/Progress";

const rankConfig = {
  beginner: { label: "初心者", color: "slate", next: "bronze", threshold: 0, nextThreshold: 7 },
  bronze: { label: "ブロンズ", color: "orange", next: "silver", threshold: 7, nextThreshold: 30 },
  silver: { label: "シルバー", color: "gray", next: "gold", threshold: 30, nextThreshold: 100 },
  gold: { label: "ゴールド", color: "yellow", next: "platinum", threshold: 100, nextThreshold: 365 },
  platinum: { label: "プラチナ", color: "cyan", next: "diamond", threshold: 365, nextThreshold: 1000 },
  diamond: { label: "ダイヤモンド", color: "purple", next: null, threshold: 1000, nextThreshold: null }
};

export default function UserRankCard({ rank = "beginner", totalRecordDays = 0 }) {
  const currentRank = rankConfig[rank];
  const progress = currentRank.nextThreshold 
    ? ((totalRecordDays - currentRank.threshold) / (currentRank.nextThreshold - currentRank.threshold)) * 100
    : 100;

  const colorClasses = {
    slate: "from-slate-500 to-slate-600",
    orange: "from-orange-500 to-orange-600",
    gray: "from-gray-400 to-gray-500",
    yellow: "from-yellow-500 to-yellow-600",
    cyan: "from-cyan-500 to-cyan-600",
    purple: "from-purple-500 to-purple-600"
  };

  return (
    <Card className="shadow-2xl border border-amber-900/20 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-100">
          <Trophy className="w-5 h-5 text-amber-400" />
          あなたのランク
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-4 bg-gradient-to-br ${colorClasses[currentRank.color]} rounded-2xl shadow-lg`}>
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-amber-100">{currentRank.label}</h3>
            <p className="text-sm text-slate-400">累計 {totalRecordDays}日 記録</p>
          </div>
        </div>

        {currentRank.next && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">次のランクまで</span>
              <span className="text-amber-300 font-medium">
                あと{currentRank.nextThreshold - totalRecordDays}日
              </span>
            </div>
            <Progress value={Math.min(progress, 100)} className="h-2" />
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <TrendingUp className="w-3 h-3" />
              <span>次: {rankConfig[currentRank.next].label}</span>
            </div>
          </div>
        )}

        {rank === "diamond" && (
          <div className="text-center py-2">
            <p className="text-amber-400 font-bold">🎉 最高ランク達成！</p>
            <p className="text-sm text-slate-400 mt-1">記録を続けましょう</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}