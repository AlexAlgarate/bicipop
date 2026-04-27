'use client';

import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type ImageMode = 'url' | 'file';

export const useImagePreview = (initialUrl = '') => {
  const [imageMode, setImageMode] = useState<ImageMode>('url');
  const [imageUrl, setImageUrl] = useState(initialUrl);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;

    if (!selected) {
      setFilePreviewUrl(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = event => setFilePreviewUrl(event.target?.result as string);
    reader.readAsDataURL(selected);
  };

  return {
    imageMode,
    setImageMode,
    imageUrl,
    setImageUrl,
    preview: imageMode === 'url' ? imageUrl : (filePreviewUrl ?? ''),
    handleFileChange,
  };
};

interface ImageFieldProps {
  initialUrl?: string;
  error?: string[];
  disabled?: boolean;
}

export const ImageField = ({ initialUrl, error, disabled }: ImageFieldProps) => {
  const { imageMode, setImageMode, setImageUrl, preview, handleFileChange } =
    useImagePreview(initialUrl);

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">Image</label>

      <ModeSelector active={imageMode} onChange={setImageMode} />

      <input type="hidden" name="imageMode" value={imageMode} />

      {imageMode === 'url' ? (
        <input
          name="imageUrl"
          type="url"
          className="input"
          defaultValue={initialUrl}
          onChange={e => setImageUrl(e.target.value)}
          disabled={disabled}
          placeholder="https://example.com/image.jpg"
        />
      ) : (
        <input
          name="imageFile"
          type="file"
          accept="image/*"
          className="input"
          onChange={handleFileChange}
          disabled={disabled}
        />
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      <ImagePreview
        src={preview}
        onError={imageMode === 'url' ? () => setImageUrl('') : undefined}
      />
    </div>
  );
};

const ModeSelector = ({
  active,
  onChange,
}: {
  active: 'url' | 'file';
  onChange: (mode: 'url' | 'file') => void;
}) => (
  <div className="flex gap-2 mb-2">
    {(['url', 'file'] as const).map(mode => (
      <button
        key={mode}
        type="button"
        onClick={() => onChange(mode)}
        className={`px-3 py-1 rounded capitalize cursor-pointer ${
          active === mode ? 'bg-primary text-white' : 'bg-muted'
        }`}
      >
        {mode === 'url' ? 'URL' : 'Upload File'}
      </button>
    ))}
  </div>
);

const ImagePreview = ({ src, onError }: { src: string; onError?: () => void }) => {
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
      <Image src={src} alt="Preview" fill className="object-cover" onError={onError} />
    </div>
  );
};
