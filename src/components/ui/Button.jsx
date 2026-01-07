import React from "react";

// forwardRef で囲むことで、外部（Dialogなど）から ref を受け取れるようになります
export const Button = React.forwardRef(({ children, className = "", ...props }, ref) => (
  <button 
    ref={ref} // 受け取った ref をここに関連付けます
    className={`bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2 px-4 rounded-xl transition-all shadow-lg shadow-amber-900/20 disabled:opacity-50 ${className}`} 
    {...props}
  >
    {children}
  </button>
));

// コンポーネントに名前を付ける（デバッグしやすくなります）
Button.displayName = "Button";