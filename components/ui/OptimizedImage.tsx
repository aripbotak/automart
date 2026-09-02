'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

export type CdnProvider = 'cloudinary' | 's3' | 'imgix' | 'auto';

export interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string;
  provider?: CdnProvider;
  quality?: number;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '21/9' | 'auto';
  fallbackSrc?: string;
  containerClassName?: string;
}

/**
 * Generate a shimmering SVG placeholder for smooth loading state
 */
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f1f5f9" offset="20%" />
      <stop stop-color="#e2e8f0" offset="50%" />
      <stop stop-color="#f1f5f9" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f1f5f9" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.2s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);

/**
 * Builds dynamic CDN query parameters for WebP/AVIF auto-format, quality, and sizing
 */
export function buildCdnUrl(
  url: string,
  width?: number,
  quality = 80,
  provider: CdnProvider = 'auto'
): string {
  if (!url) return '';

  const detectedProvider =
    provider === 'auto'
      ? url.includes('cloudinary.com')
        ? 'cloudinary'
        : url.includes('amazonaws.com') || url.includes('cloudfront.net')
        ? 's3'
        : url.includes('imgix.net')
        ? 'imgix'
        : 'auto'
      : provider;

  if (detectedProvider === 'cloudinary') {
    // Inject Cloudinary transformations e.g., /upload/f_auto,q_auto,w_800/
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex !== -1) {
      const transform = `f_auto,q_${quality}${width ? `,w_${width},c_limit` : ''}`;
      return `${url.slice(0, uploadIndex + 8)}${transform}/${url.slice(uploadIndex + 8)}`;
    }
  }

  if (detectedProvider === 's3' || detectedProvider === 'imgix') {
    const separator = url.includes('?') ? '&' : '?';
    const params = new URLSearchParams();
    params.set('auto', 'format,compress');
    params.set('q', quality.toString());
    if (width) params.set('w', width.toString());
    return `${url}${separator}${params.toString()}`;
  }

  return url;
}

/**
 * Modern Next.js Optimized Image with CDN pipeline, blur placeholder & fallback recovery
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  quality = 85,
  priority = false,
  aspectRatio = 'auto',
  className,
  containerClassName,
  fallbackSrc = '/images/vehicle-placeholder.png',
  provider = 'auto',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(() =>
    buildCdnUrl(src, typeof width === 'number' ? width : undefined, quality, provider)
  );
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const aspectRatioClass = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    '21/9': 'aspect-[21/9]',
    auto: '',
  }[aspectRatio];

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-slate-100 dark:bg-slate-800',
        aspectRatioClass,
        containerClassName
      )}
    >
      <Image
        src={hasError ? fallbackSrc : imgSrc}
        alt={alt}
        width={!fill ? width || 800 : undefined}
        height={!fill ? height || 600 : undefined}
        fill={fill}
        priority={priority}
        sizes={sizes}
        placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
        onError={() => {
          setHasError(true);
          setImgSrc(fallbackSrc);
        }}
        onLoad={() => setIsLoading(false)}
        className={cn(
          'duration-500 ease-in-out object-cover',
          isLoading ? 'scale-105 blur-sm grayscale' : 'scale-100 blur-0 grayscale-0',
          className
        )}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
