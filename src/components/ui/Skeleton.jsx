import React from "react";

export const Skeleton = ({ className = "", variant = "rect" }) => {
  const baseClass = "bg-slate-800/60 animate-pulse";
  
  const variants = {
    circle: "rounded-full",
    text: "rounded h-3 w-full",
    rect: "rounded-xl",
  };

  return (
    <div className={`${baseClass} ${variants[variant]} ${className}`} />
  );
};
export default Skeleton;
