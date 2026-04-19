import { useEffect } from 'react';
import Image from 'next/image';
import { FieldError } from '@/components/FieldError';

interface ImageProps {
  error?: string[];
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export const ImageUploadField = ({ error, file, onFileChange }: ImageProps) => {
  const preview = file ? URL.createObjectURL(file) : null;

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(event.target.files?.[0] ?? null);
  };

  return (
    <div className="space-y-1">
      <label htmlFor="imageUrl" className="text-sm font-medium">
        Sube la imagen de tu bici
      </label>

      <input
        id="imageUrl"
        name="imageUrl"
        type="file"
        placeholder="Sube una fotografía de tu bici.."
        accept="image/*"
        onChange={handleFileChange}
        className={[
          'w-full bg-background rounded-lg border px-3 py-2 text-sm',
          'focus:outline-none focus:ring-2',
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-border focus:ring-primary/20',
        ].join(' ')}
      />

      <FieldError error={error} />

      {preview && (
        <Image
          src={preview}
          alt="Preview"
          width={50}
          height={50}
          className="w-full h-auto rounded-lg border border-border mt-2 object-cover"
        />
      )}
    </div>
  );
};
