import React from "react";

export const AppLogo = ({ className = "", showText = true }) => {
  return (
    <div className={`flex items-center gap-2 font-bold text-xl tracking-wider text-slate-100 select-none ${className}`}>
      <span className="gradient-text">▲</span>
      {showText && <span>VIEWSTREAM</span>}
    </div>
  );
};
export default AppLogo;
