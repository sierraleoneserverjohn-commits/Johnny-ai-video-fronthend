"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import GeneratorForm from "./components/GeneratorForm";
import VideoGallery, { VideoItem } from "./components/VideoGallery";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const [activeProvider, setActiveProvider] = useState("fal");
  const [autoFallback, setAutoFallback] = useState(true);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSuccess = (videoUrl: string, provider: string) => {
    setErrorMsg(null);
    const newVideo: VideoItem = {
      id: Date.now().toString(),
      url: videoUrl,
      provider: provider,
      timestamp: new Date().toLocaleTimeString(),
    };
    // Prepend new video to top of gallery
    setVideos((prev) => [newVideo, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <Sidebar
        activeProvider={activeProvider}
        onSelectProvider={setActiveProvider}
        autoFallback={autoFallback}
        setAutoFallback={setAutoFallback}
      />

      {/* Main Workspace */}
      <main className="flex-1 p-4 sm:p-8 max-w-4xl mx-auto w-full">
        <header className="mb-6">
          <h2 className="text-xl font-bold tracking-tight">Generate AI Video</h2>
          <p className="text-xs text-slate-400 mt-1">
            Current Active API: <span className="text-indigo-400 font-semibold uppercase">{activeProvider}</span>
          </p>
        </header>

        {/* Error Banner */}
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

        {/* Gallery Component */}
        <VideoGallery videos={videos} />
      </main>
    </div>
  );
}
