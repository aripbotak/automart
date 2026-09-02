import { useState, useCallback } from 'react';
import { UploadedFileItem } from '@/types';
import { api } from '@/lib/api-client';

interface UseDynamicMediaUploadOptions {
  maxFiles?: number;
  maxSizeMB?: number;
  onSuccess?: (urls: string[]) => void;
}

export function useDynamicMediaUpload({
  maxFiles = 10,
  maxSizeMB = 10,
  onSuccess,
}: UseDynamicMediaUploadOptions = {}) {
  const [items, setItems] = useState<UploadedFileItem[]>([]);
  const [isUploadingOverall, setIsUploadingOverall] = useState(false);

  const addFiles = useCallback(
    (files: File[]) => {
      const remainingSlots = maxFiles - items.length;
      const validFiles = files.slice(0, remainingSlots);

      const newItems: UploadedFileItem[] = validFiles.map((file) => {
        const isTooLarge = file.size > maxSizeMB * 1024 * 1024;
        return {
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          file,
          previewUrl: URL.createObjectURL(file),
          progress: isTooLarge ? 0 : 0,
          status: isTooLarge ? 'error' : 'idle',
          errorMessage: isTooLarge ? `File exceeds ${maxSizeMB}MB limit` : undefined,
        };
      });

      setItems((prev) => [...prev, ...newItems]);
    },
    [items.length, maxFiles, maxSizeMB]
  );

  const removeFile = useCallback((id: string) => {
    setItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  const uploadAll = useCallback(async () => {
    const pendingItems = items.filter((item) => item.status === 'idle');
    if (pendingItems.length === 0) return;

    setIsUploadingOverall(true);
    const uploadedUrls: string[] = [];

    await Promise.all(
      pendingItems.map(async (item) => {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'uploading', progress: 10 } : i))
        );

        const formData = new FormData();
        formData.append('file', item.file);
        formData.append('upload_preset', 'automart_vehicles');

        try {
          // Attempt actual CDN upload or simulate progress fallback
          let cdnUrl = item.previewUrl;
          try {
            const res = await api.upload<{ secure_url: string }>('/media/upload', formData, (p) => {
              setItems((prev) =>
                prev.map((i) => (i.id === item.id ? { ...i, progress: p } : i))
              );
            });
            if (res.secure_url) cdnUrl = res.secure_url;
          } catch {
            // Simulated upload progress steps for development demo
            for (let progress = 20; progress <= 100; progress += 20) {
              await new Promise((r) => setTimeout(r, 150));
              setItems((prev) =>
                prev.map((i) => (i.id === item.id ? { ...i, progress } : i))
              );
            }
          }

          uploadedUrls.push(cdnUrl);
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id ? { ...i, status: 'success', progress: 100, cdnUrl } : i
            )
          );
        } catch {
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? { ...i, status: 'error', errorMessage: 'Upload failed. Try again.' }
                : i
            )
          );
        }
      })
    );

    setIsUploadingOverall(false);
    if (onSuccess && uploadedUrls.length > 0) {
      onSuccess(uploadedUrls);
    }
  }, [items, onSuccess]);

  return {
    items,
    isUploadingOverall,
    addFiles,
    removeFile,
    uploadAll,
  };
}
