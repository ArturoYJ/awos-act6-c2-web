"use client";

import { useCallback, useState } from "react";
import api from "@/services/api";
import { useApi } from "@/hooks/useApi";
import { ImageData } from "@/types/images.types";
import ImageGeneratorView from "@/components/ImageGeneratorView";

export default function ImagesPage() {
  const [prompt, setPrompt] = useState("");

  const apiCall = useCallback((p: string) => api.post("/images/generate", { prompt: p }), []);
  const { data, loading, error, execute } = useApi<ImageData, [string]>(apiCall);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    await execute(prompt);
  };

  return (
    <ImageGeneratorView
      prompt={prompt}
      onPromptChange={setPrompt}
      onSubmit={handleSubmit}
      data={data}
      loading={loading}
      error={error}
    />
  );
}
