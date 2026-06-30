import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "../store/toastSlice";
import { Button } from "./ui/Button";
import { InputField } from "./ui/InputField";
import { Avatar } from "./ui/Avatar";
import { Modal } from "./ui/Modal";
import { Skeleton } from "./ui/Skeleton";
import { 
  Palette, 
  Type, 
  Layers, 
  Sliders, 
  Bell, 
  FileText, 
  Play 
} from "lucide-react";

export const StyleGuidePage = () => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);

  const triggerToast = (type) => {
    dispatch(showToast(`Successfully spawned a system ${type} alert toast!`, type));
  };

  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-12 animate-fade-in text-slate-200">
      <h1 className="text-3xl font-extrabold text-slate-100 mb-1 tracking-tight">Streamify Design Tokens & Style Guide</h1>
      <p className="text-xs text-slate-400 mb-8">Specification playground for UI primitives (inspired by Linear, Vercel, and GitHub).</p>

      {/* Grid container */}
      <div className="flex flex-col gap-10">
        
        {/* Colors section */}
        <section className="rounded-2xl glassmorphism p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4 text-brand-cyan">
            <Palette size={20} />
            <h2 className="text-lg font-semibold text-slate-100">Color Spectrum</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <div className="flex flex-col gap-2">
              <div className="h-16 bg-slate-950 rounded-lg border border-slate-800" />
              <span className="text-2xs font-mono">Canvas (#0b0f19)</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-16 bg-slate-900 rounded-lg border border-slate-800" />
              <span className="text-2xs font-mono">Elevation 1 (#151d30)</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-16 bg-slate-800 rounded-lg border border-slate-700" />
              <span className="text-2xs font-mono">Elevation 2 (#1e293b)</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-16 bg-gradient-to-r from-brand-cyan to-brand-indigo rounded-lg" />
              <span className="text-2xs font-mono">Brand Gradient</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-16 bg-emerald-500 rounded-lg" />
              <span className="text-2xs font-mono">Success Green</span>
            </div>
          </div>
        </section>

        {/* Buttons section */}
        <section className="rounded-2xl glassmorphism p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4 text-brand-cyan">
            <Sliders size={20} />
            <h2 className="text-lg font-semibold text-slate-100">Interactive Buttons</h2>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="solid">Solid Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="danger">Danger Button</Button>
            <Button variant="solid" isLoading={true}>Loading</Button>
            <Button variant="solid" disabled={true}>Disabled</Button>
          </div>
        </section>

        {/* Inputs section */}
        <section className="rounded-2xl glassmorphism p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4 text-brand-cyan">
            <FileText size={20} />
            <h2 className="text-lg font-semibold text-slate-100">Form Inputs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField label="Default Text Input" type="text" placeholder="Standard text here..." />
            <InputField label="Input With Errors" type="text" value="Incorrect value" error="Invalid parameters schema input" readOnly />
            <InputField label="Disabled Input" type="text" placeholder="Disallowed fields" disabled />
          </div>
        </section>

        {/* Overlays / Triggers section */}
        <section className="rounded-2xl glassmorphism p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4 text-brand-cyan">
            <Bell size={20} />
            <h2 className="text-lg font-semibold text-slate-100">Banners & Overlays</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" onClick={() => triggerToast("success")}>Trigger Success Toast</Button>
            <Button variant="outline" onClick={() => triggerToast("error")}>Trigger Error Toast</Button>
            <Button variant="outline" onClick={() => triggerToast("info")}>Trigger Info Toast</Button>
            <Button variant="solid" onClick={() => setModalOpen(true)}>Open Accessible Modal</Button>
          </div>
        </section>

        {/* Skeletons & Avatars */}
        <section className="rounded-2xl glassmorphism p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4 text-brand-cyan">
            <Type size={20} />
            <h2 className="text-lg font-semibold text-slate-100">Loaders & Avatars</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold text-slate-400">Skeleton placeholders:</span>
              <div className="flex items-center gap-4">
                <Skeleton variant="circle" className="w-12 h-12" />
                <div className="flex flex-col gap-2 flex-grow">
                  <Skeleton variant="text" className="w-[80%]" />
                  <Skeleton variant="text" className="w-[50%]" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold text-slate-400">Avatar initials vs images:</span>
              <div className="flex items-center gap-4">
                <Avatar name="Alex Johnson" size="lg" />
                <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150" name="Jane Doe" size="lg" />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Accessible Modal Demo */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Theme Customizations System">
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          This overlay modal has full keyboard focus traps enabled. Tab indices will loop inside the controls below.
        </p>
        <div className="flex justify-end gap-3 border-t border-slate-800 pt-4 mt-6">
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="solid" onClick={() => { setModalOpen(false); dispatch(showToast("Customizations applied successfully!", "success")); }}>Confirm changes</Button>
        </div>
      </Modal>
    </div>
  );
};
export default StyleGuidePage;
