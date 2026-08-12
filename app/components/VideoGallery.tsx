"use client";

import { CheckCircle2, Download, ExternalLink, Trash2 } from "lucide-react";

export interface VideoItem {
  id: string;
  url: string;
  provider: string;
  prompt: string;
  timestamp: string;
}

interface VideoGalleryProps {
  videos: VideoItem[];
  onClear: () => void;
}

export default function VideoGallery({ videos, onClear }: VideoGalleryProps) {
  if (videos.length === 0) return null;

  return (
    <section className="mt-8 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Render Output Gallery
        </h2>
        <button
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {videos.map((item) => (
          <div key={item.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[10px] bg-indigo-950 border border-indigo-800/50 text-indigo-300 px-2.5 py-0.5 rounded-full uppercase font-medium">
                Engine: {item.provider}
              </span>
              <span className="text-[10px] text-slate-500">{item.timestamp}</span>
            </div>

            <p className="text-xs text-slate-300 line-clamp-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 italic">
              "{item.prompt}"
            </p>

            <video src={item.url} controls autoPlay loop className="w-full rounded-xl bg-black border border-slate-800 shadow-inner" />

            <div className="flex items-center justify-between px-1">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Direct Video Link
              </a>
              <a
                href={item.url}
                download
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
              >
                <Download className="w-3.5 h-3.5" /> Download MP4
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
