"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CloseIcon, SearchIcon } from "@/components/icons";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;

    setQuery("");
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const submit = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) return;

    onClose();
    router.push(`/products?q=${encodeURIComponent(trimmed)}`);
  }, [onClose, query, router]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        className="absolute inset-0 bg-forest/40 backdrop-blur-sm"
        aria-label="Close search"
        onClick={onClose}
      />

      <div className="relative mx-auto mt-20 max-w-2xl px-4 sm:px-6">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
          className="rounded-2xl border border-border bg-white shadow-2xl overflow-hidden"
          role="search"
        >
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <SearchIcon className="w-5 h-5 text-muted shrink-0" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search furniture, materials, categories..."
              className="flex-1 bg-transparent text-forest placeholder:text-muted/70 text-sm sm:text-base outline-none"
              aria-label="Search products"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted hover:text-forest hover:bg-cream transition-colors"
              aria-label="Close search"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-cream/40">
            <p className="text-xs text-muted">
              Press Enter to search products
            </p>
            <button
              type="submit"
              disabled={!query.trim()}
              className="px-4 py-2 rounded-lg bg-forest text-white text-sm font-medium hover:bg-forest-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
