'use client';

import { useActionState, useEffect, useState } from 'react';
import { Loader2, ImageIcon } from 'lucide-react';
import Image from 'next/image';

import type { ProductStatus } from '@/generated/client/enums';
import type { ProductFormState } from '@/features/items/shared/types';
import { uploadProductAction } from '@/features/items/upload/action';
import { updateProductAction } from '@/features/items/edit/action';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFormProps {
  categories: Category[];
  mode: 'create' | 'edit';
  initialData?: {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    location: string;
    categoryId: string;
    status: ProductStatus;
  };
}

type ImageMode = 'url' | 'file';

export default function ProductForm({ categories, mode, initialData }: ProductFormProps) {
  const action = mode === 'create' ? uploadProductAction : updateProductAction;

  const [state, formAction, isPending] = useActionState<
    ProductFormState | null,
    FormData
  >(action, null);

  // IMAGE STATE
  const [imageMode, setImageMode] = useState<ImageMode>('url');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [file, setFile] = useState<File | null>(null);

  // PREVIEW
  const preview = imageMode === 'url' ? imageUrl : file ? URL.createObjectURL(file) : '';

  // limpiar objectURL
  useEffect(() => {
    return () => {
      if (file) URL.revokeObjectURL(URL.createObjectURL(file));
    };
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
  };

  return (
    <form action={formAction} className="space-y-6">
      {state?.message && !state.success && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {state.message}
        </div>
      )}

      {mode === 'edit' && initialData && (
        <input type="hidden" name="productId" value={initialData.id} />
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          minLength={3}
          className="input"
          defaultValue={initialData?.title}
          disabled={isPending}
        />
        {state?.errors?.title && (
          <p className="mt-1 text-sm text-red-500">{state.errors.title[0]}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          minLength={10}
          rows={4}
          className="input resize-none"
          defaultValue={initialData?.description}
          disabled={isPending}
        />
        {state?.errors?.description && (
          <p className="mt-1 text-sm text-red-500">{state.errors.description[0]}</p>
        )}
      </div>

      {/* Price & Location */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="mb-1 block text-sm font-medium">
            Price (EUR)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            required
            min="0"
            step="0.01"
            className="input"
            defaultValue={initialData?.price}
            disabled={isPending}
          />
          {state?.errors?.price && (
            <p className="mt-1 text-sm text-red-500">{state.errors.price[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="mb-1 block text-sm font-medium">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            required
            minLength={2}
            className="input"
            defaultValue={initialData?.location}
            disabled={isPending}
          />
          {state?.errors?.location && (
            <p className="mt-1 text-sm text-red-500">{state.errors.location[0]}</p>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="categoryId" className="mb-1 block text-sm font-medium">
          Category
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          className="input"
          defaultValue={initialData?.categoryId}
          disabled={isPending}
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {state?.errors?.categoryId && (
          <p className="mt-1 text-sm text-red-500">{state.errors.categoryId[0]}</p>
        )}
      </div>

      {/* IMAGE FIELD */}
      <div>
        <label className="mb-1 block text-sm font-medium">Image</label>

        {/* Mode selector */}
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={() => setImageMode('url')}
            className={`px-3 py-1 rounded ${
              imageMode === 'url' ? 'bg-primary text-white' : 'bg-muted'
            }`}
          >
            URL
          </button>
          <button
            type="button"
            onClick={() => setImageMode('file')}
            className={`px-3 py-1 rounded ${
              imageMode === 'file' ? 'bg-primary text-white' : 'bg-muted'
            }`}
          >
            Upload
          </button>
        </div>

        {/* Hidden mode */}
        <input type="hidden" name="imageMode" value={imageMode} />

        {/* URL input */}
        {imageMode === 'url' && (
          <input
            name="imageUrl"
            type="url"
            className="input"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            disabled={isPending}
            placeholder="https://example.com/image.jpg"
          />
        )}

        {/* File input */}
        {imageMode === 'file' && (
          <input
            name="imageFile"
            type="file"
            accept="image/*"
            className="input"
            onChange={handleFileChange}
            disabled={isPending}
          />
        )}

        {state?.errors?.imageUrl && (
          <p className="mt-1 text-sm text-red-500">{state.errors.imageUrl[0]}</p>
        )}

        {/* Preview */}
        {preview ? (
          <div className="mt-3 relative aspect-video w-full max-w-xs overflow-hidden rounded-lg border border-border">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              onError={() => {
                if (imageMode === 'url') setImageUrl('');
              }}
            />
          </div>
        ) : (
          <div className="mt-3 flex aspect-video w-full max-w-xs items-center justify-center rounded-lg border border-dashed border-border bg-(--card-hover)">
            <div className="text-center text-muted">
              <ImageIcon className="mx-auto h-8 w-8" />
              <p className="mt-1 text-xs">Image preview</p>
            </div>
          </div>
        )}
      </div>

      {/* Status */}
      {mode === 'edit' && (
        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            required
            className="input"
            defaultValue={initialData?.status}
            disabled={isPending}
          >
            <option value="ACTIVE">Active</option>
            <option value="RESERVED">Reserved</option>
            <option value="SOLD">Sold</option>
          </select>
        </div>
      )}

      {/* Submit */}
      <button type="submit" disabled={isPending} className="btn btn-primary w-full py-3">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {mode === 'create' ? 'Publishing...' : 'Updating...'}
          </>
        ) : mode === 'create' ? (
          'Publish Product'
        ) : (
          'Update Product'
        )}
      </button>
    </form>
  );
}
