"use client";

import { Video, Sparkles, Cpu, Layers } from "lucide-react";

export interface ProviderOption {
  id: string;
  name: string;
  desc: string;
  badge: string;
}

const PROVIDERS: ProviderOption[] = [
  { id: "fal", name: "fal.ai", desc: "Hunyuan & Minimax models", badge: "Fast" },
  { id: "replicate", name: "Replicate", desc: "Stable Video Diffusion", badge: "Open Source" },
  { id: "google", name: "Google Veo", desc: "Cinematic quality", badge: "Pro" },
  { id: "leonardo", name: "Leonardo.ai", desc: "Stylized motion & effects", badge: "Creative" },
  { id: "json2video", name: "JSON2Video", desc: "Render captions & templates", badge: "Utility" },
];

interface SidebarProps {
  activeProvider: string;
  onSelectProvider: (id: string) => void;
  autoFallback: boolean;
  setAutoFallback: (val: boolean) => void;
}

export default function Sidebar({
  activeProvider,
  onSelectProvider,
  autoFallback,
  setAutoFallback,
}: SidebarProps) {
  return (
    <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-5 flex flex-col justify-between shrink-0">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-indigo-600/20 rounded-xl text-indigo-400 border border-indigo-500/30">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">Johnny Tec AI</h1>
            <p className="text-[11px] text-slate-400">Video Studio Command</p>
          </div>
        </div>

        {/* API Engine Selection Header */}
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Select API Engine
        </div>

        {/* Engine List */}
        <nav className="flex flex-col gap-2">
          {PROVIDERS.map((p) => {
            const isActive = activeProvider === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProvider(p.id)}
                className={`w-full text-left p-3 rounded-xl transition flex flex-col gap-1 border ${
                  isActive
                    ? "bg-indigo-600/10 border-indigo-500/50 text-white shadow-lg shadow-indigo-500/5"
                    : "bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">{p.name}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {p.badge}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1">{p.desc}</p>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Auto-Fallback Switcher */}
      <div className="mt-6 pt-4 border-t border-slate-800">
        <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="text-xs text-slate-300 font-medium">Auto Fallback</span>
          </div>
          <input
            type="checkbox"
            checked={autoFallback}
            onChange={(e) => setAutoFallback(e.target.checked)}
            className="rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-0 w-4 h-4"
          />
        </label>
        <p className="text-[10px] text-slate-500 mt-1.5 px-1">
          Automatically tries next API if current fails or hits credit limits.
        </p>
      </div>
    </aside>
  );
}
