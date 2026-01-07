import React from "react";

export const ScrollArea = ({ children, className = "" }) => (
  <div className={`overflow-y-auto pr-2 custom-scrollbar ${className}`}>
    {children}
  </div>
);