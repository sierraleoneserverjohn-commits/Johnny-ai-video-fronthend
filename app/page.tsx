"use client";

import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import GeneratorForm from "./components/GeneratorForm";
import VideoGallery, { VideoItem } from "./components/VideoGallery";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const [activeProvider, setActiveProvider] = useState("fal");
  const [autoFallback, setAutoFallback] = useState(true);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load saved videos from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("johnny_ai_videos");
    if (saved) {
      try {
        setVideos(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load video history");
      }
    }
  }, []);

  // Save to localStorage when videos change
  const handleSuccess = (videoUrl: string, provider: string, prompt: string) => {
    setErrorMsg(null);
    const newVideo: VideoItem = {
      id: Date.now().toString(),
      url: videoUrl,
      provider: provider,
      prompt: prompt,
      timestamp: new Date().toLocaleTimeString(),
    };
    
    const updated = [newVideo, ...videos];
    setVideos(updated);
    localStorage.setItem("johnny_ai_videos", JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    setVideos([]);
    localStorage.removeItem("johnny_ai_videos");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeProvider={activeProvider}
        onSelectProvider={setActiveProvider}
        autoFallback={autoFallback}
        setAutoFallback={setAutoFallback}
        videoCount={videos.length}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 p-4 sm:p-8 max-w-4xl mx-auto w-full">
        <header className="mb-6 flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Generate AI Video</h2>
            <p className="text-xs text-slate-400 mt-1">
              Active Engine: <span className="text-indigo-400 font-semibold uppercase">{activeProvider}</span>
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Cluster Active
          </span>
        </header>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-800/60 rounded-xl flex items-start gap-3 text-red-300 text-xs">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-200">Execution Error</p>
              <p className="mt-1">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Form Component */}
        <GeneratorForm
          activeProvider={activeProvider}
          autoFallback={autoFallback}
          onSuccess={handleSuccess}
          onError={setErrorMsg}
        />

        {/* Video Gallery */}
        <VideoGallery videos={videos} onClear={handleClearHistory} />
      </main>
    </div>
  );
}
