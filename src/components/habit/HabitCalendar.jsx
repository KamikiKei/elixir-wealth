import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Calendar, Flame } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, subMonths } from "date-fns";
import { ja } from "date-fns/locale";

export default function HabitCalendar({ transactions, streakDays }) {
  const currentMonth = useMemo(() => new Date(), []);
  
  const recordedDates = useMemo(() => {
    return transactions.map(t => format(new Date(t.date), 'yyyy-MM-dd'));
  }, [transactions]);

  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const hasRecord = (day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return recordedDates.includes(dateStr);
  };

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];
  const firstDayOfWeek = monthDays[0].getDay();

  return (
    <Card className="shadow-2xl border border-amber-900/20 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-amber-100">
            <Calendar className="w-5 h-5 text-amber-400" />
            記録カレンダー
          </CardTitle>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
            <Flame className="w-4 h-4 text-white" />
            <span className="text-white font-bold text-sm">{streakDays}日連続</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-center text-lg font-semibold text-amber-200">
            {format(currentMonth, 'yyyy年M月', { locale: ja })}
          </p>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, i) => (
            <div key={i} className="text-center text-xs font-medium text-slate-500 pb-2">
              {day}
            </div>
          ))}
          
          {Array(firstDayOfWeek).fill(null).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          
          {monthDays.map((day, i) => {
            const recorded = hasRecord(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div
                key={i}
                className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                  recorded
                    ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-900 shadow-lg shadow-amber-900/30'
                    : isToday
                    ? 'bg-slate-700 text-amber-100 ring-2 ring-amber-500'
                    : 'bg-slate-800/50 text-slate-500'
                }`}
              >
                {format(day, 'd')}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded" />
            <span>記録あり</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-700 ring-2 ring-amber-500 rounded" />
            <span>今日</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}