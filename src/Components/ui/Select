import React from "react";

export const Select = ({ children, onValueChange, value }) => (
  <div className="relative w-full">
    <select 
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="w-full bg-slate-900/50 border border-slate-800 text-white p-3 rounded-xl appearance-none focus:outline-none focus:border-amber-500/50"
    >
      {children}
    </select>
  </div>
);

export const SelectTrigger = ({ children, className = "" }) => <div className={`relative ${className}`}>{children}</div>;
export const SelectValue = ({ placeholder }) => <option value="" disabled selected>{placeholder}</option>;
export const SelectContent = ({ children }) => <>{children}</>;
export const SelectItem = ({ value, children }) => <option value={value} className="bg-slate-900 text-white">{children}</option>;