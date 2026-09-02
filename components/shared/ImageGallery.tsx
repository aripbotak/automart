'use client';

import React, { useState } from 'react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { VehicleImage } from '@/types';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ImageGalleryProps {
  images: VehicleImage[];
  title: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-80 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
        No images available
      </div>
    );
  }

  const activeImage = images[selectedIndex] || images[0];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col gap-3.5">
      {/* Main Showcase Image */}
      <div className="group relative w-full overflow-hidden rounded-3xl bg-slate-950 border border-slate-200/80 shadow-md">
        <OptimizedImage
          src={activeImage.url}
          alt={`${title} - Photo ${selectedIndex + 1}`}
          aspectRatio="16/9"
          priority={true}
          quality={90}
          containerClassName="w-full"
          className="transition-transform duration-500 group-hover:scale-105"
        />

        {/* Floating Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-900 shadow-md backdrop-blur-md hover:bg-white transition"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-900 shadow-md backdrop-blur-md hover:bg-white transition"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Counter & Fullscreen trigger */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="rounded-lg bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
            {selectedIndex + 1} / {images.length}
          </span>
          <button
            onClick={() => setIsFullscreen(true)}
            className="rounded-lg bg-slate-900/80 p-1.5 text-white backdrop-blur-md hover:bg-slate-900 transition"
            aria-label="View Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {activeImage.caption && (
          <div className="absolute bottom-3 left-3">
            <span className="rounded-lg bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur-md">
              {activeImage.caption}
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                'relative overflow-hidden rounded-xl border-2 transition-all',
                selectedIndex === idx
                  ? 'border-brand-600 ring-2 ring-brand-500/30'
                  : 'border-transparent opacity-70 hover:opacity-100'
              )}
            >
              <OptimizedImage
                src={img.url}
                alt={`Thumbnail ${idx + 1}`}
                aspectRatio="16/9"
                quality={60}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] w-full">
            <OptimizedImage
              src={activeImage.url}
              alt={`${title} fullscreen`}
              aspectRatio="16/9"
              quality={95}
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
