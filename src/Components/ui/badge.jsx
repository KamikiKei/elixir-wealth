import React from "react";

export const Badge = ({ children, variant = "default", className = "", ...props }) => {
  const variants = {
    default: "bg-slate-800 text-slate-100 border-slate-700",
    outline: "border-slate-700 text-slate-300 bg-transparent",
    // 収入用（緑）
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    // 支出用（アンバー/金）
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    // 警告用
    destructive: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  const activeVariant = variants[variant] || variants.default;

  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors ${activeVariant} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};