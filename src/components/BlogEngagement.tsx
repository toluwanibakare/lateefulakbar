"use client";

import { useEffect, useState } from "react";
import { Heart, Eye } from "lucide-react";

export default function BlogEngagement({ slug }: { slug: string }) {
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    // 1. Increment view count on mount
    fetch(`/api/blog/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "view" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLikes(data.likes || 0);
          setViews(data.views || 0);
        }
      })
      .catch((err) => console.error("Error updating blog view:", err));
  }, [slug]);

  const handleLike = async () => {
    if (hasLiked) return;
    setHasLiked(true);
    setLikes((l) => l + 1);

    try {
      const res = await fetch(`/api/blog/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like" }),
      });
      const data = await res.json();
      if (data.success) {
        setLikes(data.likes);
        setViews(data.views);
      }
    } catch (err) {
      console.error("Error posting like:", err);
    }
  };

  return (
    <div className="flex items-center gap-4 border-y border-ink/10 py-4 my-6">
      <button
        onClick={handleLike}
        disabled={hasLiked}
        className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
          hasLiked
            ? "bg-rose-500 text-white border-rose-500"
            : "border-rose-300 text-rose-600 hover:bg-rose-50"
        }`}
      >
        <Heart className={`h-4 w-4 ${hasLiked ? "fill-white" : "fill-rose-500"}`} />
        <span>{likes} Likes</span>
      </button>

      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <Eye className="h-4 w-4 text-slate-400" />
        <span>{views} Views</span>
      </span>
    </div>
  );
}
