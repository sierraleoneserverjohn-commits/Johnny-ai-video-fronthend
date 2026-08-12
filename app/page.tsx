"use client";

import { useState } from "react";
import { Loader2, Video, Play, Upload, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

// REPLACE THIS WITH YOUR LIVE RENDER BACKEND URL
const BACKEND_URL = "https://ai-video-forge-backend.onrender.com/api/generate-video";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState("fal");
  const [autoFallback, setAutoFallback] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [usedProvider, setUsedProvider] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Preview uploaded local image
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Convert image to Base64 so Render backend can process it
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setStatus("Connecting to Render backend server...");
    setVideoUrl(null);
    setUsedProvider(null);
    setErrorMsg(null);

    try {
      let base64Image: string | null = null;
      if (imageFile) {
        setStatus("Processing input image...");
        base64Image = await convertFileToBase64(imageFile);
      }

      setStatus("Generating video frames... (this may take 30–60 seconds)");

      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          provider,
          autoFallback,
          imageUrl: base64Image,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.details?.[0]?.error || data.error || "Generation request failed.");
      }

      setVideoUrl(data.videoUrl);
      setUsedProvider(data.provider);
    } catch (err: any) {
      console.error("Frontend Request Error:", err);
      setErrorMsg(err.message || "Failed to contact video engine backend.");
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4 sm:p-8">
      <div className="max-w-2xl w-full my-6">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 rounded-lg text-indigo-400">
              <Video className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">AI Video Studio</h1>
              <p className="text-xs text-slate-400">Powered by 5 AI Provider Engines</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Backend
          </span>
        </header>

        {/* Generator Form */}
        <form onSubmit={handleGenerate} className="flex flex-col gap-5 bg-slate-900/80 backdrop-blur p-6 rounded-2xl border border-slate-800 shadow-xl">
          
          {/* Provider Selection & Fallback */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-2 text-slate-300 uppercase tracking-wider">
                Primary API Engine
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="fal">fal.ai (Hunyuan / Minimax)</option>
                <option value="replicate">Replicate (SVD / Open Models)</option>
                <option value="google">Google Veo (AI Studio)</option>
                <option value="leonardo">Leonardo.ai API</option>
                <option value="json2video">JSON2Video Engine</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer bg-slate-950 border border-slate-800 p-3 rounded-xl hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  checked={autoFallback}
                  onChange={(e) => setAutoFallback(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-0 w-4 h-4"
                />
                <span className="text-xs text-slate-300 font-medium">Auto-fallback on API fail</span>
              </label>
            </div>
          </div>

          {/* Source Image Upload */}
          <div>
            <label className="block text-xs font-semibold mb-2 text-slate-300 uppercase tracking-wider">
              Source Photo <span className="text-slate-500 font-normal lowercase">(optional for image-to-video)</span>
            </label>
            <div className="relative border-2 border-dashed border-slate-800 hover:border-indigo-500 rounded-xl p-4 transition text-center cursor-pointer bg-slate-950/60">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {imagePreview ? (
                <div className="flex flex-col items-center gap-2">
                  <img src={imagePreview} alt="Preview" className="max-h-36 rounded-lg object-cover shadow-md" />
                  <span className="text-xs text-indigo-400">Click to swap image</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-3 text-slate-400">
                  <Upload className="w-6 h-6 text-slate-500" />
                  <p className="text-xs">Drag & drop or click to upload a photo</p>
                </div>
              )}
            </div>
          </div>

          {/* Prompt Input */}
          <div>
            <label className="block text-xs font-semibold mb-2 text-slate-300 uppercase tracking-wider">
              Video Description
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic cybernetic city under heavy rain, camera zooms forward..."
              rows={3}
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Rendering Video...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Generate Video
              </>
            )}
          </button>
        </form>

        {/* Live Status Text */}
        {status && (
          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs mt-4 animate-pulse">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>{status}</span>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="mt-6 p-4 bg-red-950/40 border border-red-800/60 rounded-xl flex items-start gap-3 text-red-300 text-xs">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-200">Generation Failed</p>
              <p className="mt-1">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Rendered Output Video */}
        {videoUrl && (
          <div className="mt-8 bg-slate-900/80 backdrop-blur p-5 rounded-2xl border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Generated Result
              </h2>
              {usedProvider && (
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md uppercase tracking-wider font-mono">
                  Engine: {usedProvider}
                </span>
              )}
            </div>

            <video
              src={videoUrl}
              controls
              autoPlay
              loop
              className="w-full rounded-xl bg-black border border-slate-800 shadow-inner"
            />

            <a
              href={videoUrl}
              target="_blank"
              rel="noreferrer"
              className="block text-center text-xs font-medium text-indigo-400 mt-4 hover:text-indigo-300 transition"
            >
              Open Direct MP4 Link ↗
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
  
