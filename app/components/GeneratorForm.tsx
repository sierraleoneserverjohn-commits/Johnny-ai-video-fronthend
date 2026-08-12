"use client";

import { useState } from "react";
import { Play, Loader2, Upload, Sparkles, Wand2, SlidersHorizontal } from "lucide-react";

interface GeneratorFormProps {
  activeProvider: string;
  autoFallback: boolean;
  onSuccess: (videoUrl: string, provider: string, prompt: string) => void;
  onError: (msg: string) => void;
}

const BACKEND_URL = "https://ai-video-forge-backend.onrender.com/api/generate-video";

const PRESET_PROMPTS = [
  "Cinematic wide shot of a futuristic cybernetic city in heavy rain, 4k cinematic lighting",
  "Camera slowly zooms into an ancient magical glowing portal inside an overgrown forest",
  "An underwater coral reef teeming with bioluminescent alien creatures, smooth camera pan",
];

export default function GeneratorForm({
  activeProvider,
  autoFallback,
  onSuccess,
  onError,
}: GeneratorFormProps) {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [resolution, setResolution] = useState("720p");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setStatus("Connecting to backend cluster...");

    try {
      let base64Image: string | null = null;
      if (imageFile) {
        setStatus("Encoding source photo...");
        base64Image = await convertFileToBase64(imageFile);
      }

      setStatus("Rendering video frames (30–60s)...");

      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          provider: activeProvider,
          autoFallback,
          imageUrl: base64Image,
          aspectRatio,
          resolution,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.details?.[0]?.error || data.error || "Generation failed.");
      }

      onSuccess(data.videoUrl, data.provider, prompt);
    } catch (err: any) {
      onError(err.message || "Failed to generate video.");
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl flex flex-col gap-5 shadow-2xl backdrop-blur-md">
      
      {/* Aspect Ratio & Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Aspect Ratio
          </label>
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="16:9">16:9 (Landscape)</option>
            <option value="9:16">9:16 (Portrait / Reels)</option>
            <option value="1:1">1:1 (Square)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Resolution
          </label>
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="720p">720p (Fast)</option>
            <option value="1080p">1080p (HD)</option>
          </select>
        </div>
      </div>

      {/* Source Image Upload */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Source Photo <span className="text-slate-600 font-normal lowercase">(Optional for Image-To-Video)</span>
        </label>
        <div className="relative border-2 border-dashed border-slate-800 hover:border-indigo-500/60 rounded-xl p-4 transition text-center cursor-pointer bg-slate-950/60">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          {imagePreview ? (
            <div className="flex flex-col items-center gap-2">
              <img src={imagePreview} alt="Preview" className="max-h-32 rounded-lg object-cover" />
              <span className="text-[11px] text-indigo-400">Click or drag to change image</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-3 text-slate-400">
              <Upload className="w-5 h-5 text-slate-500" />
              <p className="text-xs">Drag & drop or tap to attach image</p>
            </div>
          )}
        </div>
      </div>

      {/* Prompt Area */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Video Description
          </label>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe motion or action..."
          rows={3}
          required
          className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition resize-none"
        />

        {/* Preset Prompt Ideas */}
        <div className="mt-3">
          <span className="text-[10px] text-slate-500 flex items-center gap-1 mb-2 font-medium">
            <Wand2 className="w-3 h-3 text-indigo-400" /> Quick Preset Ideas:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(p)}
                className="text-[10px] bg-slate-950 hover:bg-slate-800 border border-slate-800/80 text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-lg transition text-left line-clamp-1"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating Video...
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            Generate with {activeProvider.toUpperCase()}
          </>
        )}
      </button>

      {/* Status indicator */}
      {status && (
        <div className="flex items-center justify-center gap-2 text-slate-400 text-xs animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>{status}</span>
        </div>
      )}
    </form>
  );
}
