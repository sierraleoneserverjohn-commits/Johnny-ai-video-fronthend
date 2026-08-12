"use client";

import { CheckCircle2, Download, ExternalLink } from "lucide-react";

export interface VideoItem {
  id: string;
  url: string;
  provider: string;
  timestamp: string;
}

interface VideoGalleryProps {
  videos: VideoItem[];
}

export default function VideoGallery({ videos }: VideoGalleryProps) {
  if (videos.length === 0) return null;

  return (
    <section className="mt-8 flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Render Output Gallery
      </h2>

      <div className="grid grid-cols-1 gap-6">
        {videos.map((item) => (
          <div key={item.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-mono text-[10px] bg-slate-800 text-indigo-300 px-2 py-0.5 rounded-md uppercase">
                Engine: {item.provider}
              </span>
              <span className="text-[10px] text-slate-500">{item.timestamp}</span>
            </div>

            <video src={item.url} controls autoPlay loop className="w-full rounded-xl bg-black border border-slate-800" />

            <div className="flex items-center justify-between mt-3 px-1">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open Direct Video
              </a>
              <a
                href={item.url}
                download
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
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
