'use client';

import React, { useRef } from 'react';
import { UploadCloud, X, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useDynamicMediaUpload } from '@/hooks/useDynamicMediaUpload';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

export interface DynamicImageUploaderProps {
  onUploadComplete?: (urls: string[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

export const DynamicImageUploader: React.FC<DynamicImageUploaderProps> = ({
  onUploadComplete,
  maxFiles = 8,
  maxSizeMB = 10,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { items, isUploadingOverall, addFiles, removeFile, uploadAll } = useDynamicMediaUpload({
    maxFiles,
    maxSizeMB,
    onSuccess: onUploadComplete,
  });

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Drag & Drop Container */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="group relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-8 text-center transition hover:border-brand-500 hover:bg-brand-50/20 cursor-pointer"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,image/avif"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md text-brand-600 group-hover:scale-110 transition duration-200">
          <UploadCloud className="h-7 w-7" />
        </div>

        <h4 className="mt-4 text-base font-bold text-slate-900">
          Drag & drop vehicle photos here, or <span className="text-brand-600">browse</span>
        </h4>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          Supports high-res WebP, JPEG, PNG, AVIF up to {maxSizeMB}MB each. Maximum {maxFiles} images.
        </p>
      </div>

      {/* File Preview & Progress Grid */}
      {items.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Selected Photos ({items.length} / {maxFiles})</span>
            <Button
              size="sm"
              variant="primary"
              onClick={uploadAll}
              isLoading={isUploadingOverall}
              disabled={items.every((i) => i.status === 'success')}
            >
              Upload to CDN
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="h-full w-full object-cover"
                  />

                  {/* Status Overlay */}
                  {item.status === 'uploading' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 p-2 text-white">
                      <span className="text-xs font-bold">{item.progress}%</span>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-slate-700 overflow-hidden">
                        <div
                          className="h-full bg-brand-500 transition-all duration-150"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {item.status === 'success' && (
                    <div className="absolute top-1.5 right-1.5 rounded-full bg-emerald-500 p-1 text-white shadow">
                      <CheckCircle className="h-3.5 w-3.5" />
                    </div>
                  )}

                  {item.status === 'error' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-900/70 p-2 text-center text-white">
                      <AlertCircle className="h-5 w-5 text-red-300" />
                    </div>
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <p className="text-[11px] font-medium text-slate-700 truncate max-w-[120px]">
                    {item.file.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeFile(item.id)}
                    className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition"
                    aria-label="Remove photo"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicImageUploader;
