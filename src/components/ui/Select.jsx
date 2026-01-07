import React from "react";

export const Select = ({ children, onValueChange, value, placeholder }) => (
  <div className="relative w-full">
    <select 
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="w-full bg-slate-900/50 border border-slate-800 text-white p-3 rounded-xl appearance-none focus:outline-none focus:border-amber-500/50"
    >
      {/* プレースホルダーを最初の選択肢として表示 */}
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {children}
    </select>
    {/* 下矢印の装飾用（クリックを透過させる） */}
    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500">
      <span className="text-[10px]">▼</span>
    </div>
  </div>
);

// React RouterやUIの警告を避けるため、不要なネストを排除したSelectItemのみ残す
export const SelectItem = ({ value, children }) => (
  <option value={value} className="bg-slate-900 text-white">
    {children}
  </option>
);

// これらはシンプルな select タグを使う場合は不要になるので、
// もし他で読み込んでいるなら空のパーツとして残すか、削除してください。
export const SelectTrigger = ({ children }) => <>{children}</>;
export const SelectValue = () => null; // Select本体で処理するため不要に
export const SelectContent = ({ children }) => <>{children}</>;