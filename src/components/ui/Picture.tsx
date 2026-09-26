import type { ImgHTMLAttributes, Ref } from 'react';
import type { ResponsiveImage } from '@/types';

interface PictureProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height' | 'alt'> {
  image: ResponsiveImage;
  alt: string;
  /** Rendered width hint for the browser, e.g. "(min-width: 1024px) 50vw, 100vw". */
  sizes?: string;
  /** Above-the-fold images load eagerly with high fetch priority. */
  priority?: boolean;
  imgRef?: Ref<HTMLImageElement>;
}

export function Picture({ image, alt, sizes = '100vw', priority = false, imgRef, ...rest }: PictureProps) {
  // React 18 does not know the camelCase prop yet; the lowercase attribute passes straight through.
  const fetchPriority: Record<string, string> = priority ? { fetchpriority: 'high' } : {};

  return (
    <picture className="contents">
      {Object.entries(image.sources).map(([format, srcSet]) => (
        <source key={format} type={`image/${format}`} srcSet={srcSet} sizes={sizes} />
      ))}
      <img
        ref={imgRef}
        src={image.img.src}
        width={image.img.w}
        height={image.img.h}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        draggable={false}
        {...fetchPriority}
        {...rest}
      />
    </picture>
  );
}
