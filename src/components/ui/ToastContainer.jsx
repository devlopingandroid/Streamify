import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeToast } from "../../store/toastSlice";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export const ToastContainer = () => {
  const toasts = useSelector((state) => state.toast.toasts);
  const dispatch = useDispatch();

  if (toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={18} className="text-emerald-400" />;
      case "error":
        return <AlertCircle size={18} className="text-red-400" />;
      default:
        return <Info size={18} className="text-brand-cyan" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-[9999] max-w-[360px] w-[calc(100vw-3rem)]" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <div key={toast.id} className="flex items-center justify-between p-4 rounded-lg glassmorphism shadow-2xl gap-4 animate-fade-in">
          <div className="flex items-center gap-3 flex-grow">
            {getIcon(toast.type)}
            <span className="text-xs text-slate-100 leading-relaxed">{toast.message}</span>
          </div>
          <button
            onClick={() => dispatch(removeToast(toast.id))}
            className="text-slate-500 hover:bg-slate-800 hover:text-slate-100 rounded-full w-6 h-6 flex items-center justify-center transition-colors duration-150 cursor-pointer"
            aria-label="Dismiss toast"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
export default ToastContainer;
