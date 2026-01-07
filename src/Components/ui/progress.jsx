import React from "react";

export const Progress = ({ value = 0, className = "" }) => {
  // 値を0~100の間に収める
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-slate-800 ${className}`}>
      <div
        className="h-full w-full flex-1 bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-500 transition-all duration-500 ease-in-out"
        style={{ transform: `translateX(-${100 - safeValue}%)` }}
      />
    </div>
  );
};