import React from "react";

export const Textarea = ({ className = "", ...props }) => (
  <textarea 
    className={`bg-slate-900/50 border border-slate-800 text-white p-3 rounded-xl w-full min-h-[100px] focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-600 ${className}`} 
    {...props} 
  />
);