"use client";

import { useState } from "react";
import { Play, Loader2, Upload, Sparkles, Image as ImageIcon } from "lucide-react";

interface GeneratorFormProps {
  activeProvider: string;
  autoFallback: boolean;
  onSuccess: (videoUrl: string, provider: string) => void;
  onError: (msg: string) => void;
}

const BACKEND_URL = "https://ai-video-forge-backend.onrender.com/api/generate-video";

export default function GeneratorForm({
  activeProvider,
  autoFallback,
  onSuccess,
  onError,
}: GeneratorFormProps) {
  const [prompt, setPrompt] = useState("");
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
        setStatus("Processing image input...");
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
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.details?.[0]?.error || data.error || "Generation failed.");
      }

      onSuccess(data.videoUrl, data.provider);
    } catch (err: any) {
      onError(err.message || "Failed to generate video.");
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-5 shadow-xl">
      {/* Upload Image Section */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Source Photo <span className="text-slate-500 font-normal lowercase">(Optional for image-to-video)</span>
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
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Animation Description
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe motion (e.g. Cinematic wide shot of a rainy neon street, 4k detail)..."
          rows={3}
          required
          className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition resize-none"
        />
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
      
