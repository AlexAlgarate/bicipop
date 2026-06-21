'use client';

import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const useImagePreview = (initialUrl = '') => {
  const [preview, setPreview] = useState(initialUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;

    if (!selected) {
      setPreview(initialUrl);
      return;
    }

    const reader = new FileReader();
    reader.onload = event => setPreview(event.target?.result as string);
    reader.readAsDataURL(selected);
  };

  return {
    preview,
    handleFileChange,
  };
};

interface ImageFieldProps {
  initialUrl?: string;
  error?: string[];
  disabled?: boolean;
}

export const ImageField = ({ initialUrl, error, disabled }: ImageFieldProps) => {
  const { preview, handleFileChange } = useImagePreview(initialUrl);

  return (
    <div>
      <label htmlFor="imageFile" className="mb-1 block text-sm font-medium">
        Image
      </label>

      <input
        id="imageFile"
        name="imageFile"
        type="file"
        accept="image/*"
        className="input"
        onChange={handleFileChange}
        disabled={disabled}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      <ImagePreview src={preview} />
    </div>
  );
};

const ImagePreview = ({ src }: { src: string }) => {
  if (!src) {
    return (
      <div className="mt-3 flex aspect-video w-full max-w-xs items-center justify-center rounded-lg border border-dashed border-border bg-(--card-hover)">
        <div className="text-center text-muted">
          <ImageIcon className="mx-auto h-8 w-8" />
          <p className="mt-1 text-sm">Image preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 relative aspect-video w-full max-w-xs overflow-hidden rounded-lg border border-border">
      <Image src={src} alt="Preview" fill sizes="320px" className="object-cover" />
    </div>
  );
};
