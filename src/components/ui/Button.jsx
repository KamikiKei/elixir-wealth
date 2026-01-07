import React from "react";

export const Button = ({ children, className = "", ...props }) => (
  <button 
    className={`bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2 px-4 rounded-xl transition-all shadow-lg shadow-amber-900/20 disabled:opacity-50 ${className}`} 
    {...props}
  >
    {children}
  </button>
);