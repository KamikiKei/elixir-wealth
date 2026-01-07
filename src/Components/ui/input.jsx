import React from "react";

export const Input = ({ className = "", ...props }) => (
  <input 
    className={`bg-slate-900/50 border border-slate-800 text-white p-3 rounded-xl w-full focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all ${className}`} 
    {...props} 
  />
);