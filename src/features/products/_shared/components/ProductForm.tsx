'use client';

import { useActionState } from 'react';

import { ProductStatus } from '@/generated/client/enums';
import type { ProductFormState } from '@/features/products/_shared/types';
import { uploadProductAction } from '@/features/products/upload/actions';
import { updateProductAction } from '@/features/products/edit/actions';
import { FormField } from '@/components/ui/FormField';
import type { CategoryDTO } from '@/domain/category/types';

import { ImageField } from './ProductForm/ImageField';
import { SubmitButton } from './ProductForm/SubmitButton';
import { SelectField } from './ProductForm/SelectField';

interface ProductFormProps {
  categories: CategoryDTO[];
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

const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: ProductStatus.ACTIVE, label: 'Active' },
  { value: ProductStatus.RESERVED, label: 'Reserved' },
  { value: ProductStatus.SOLD, label: 'Sold' },
];

const ACTIONS = {
  create: uploadProductAction,
  edit: updateProductAction,
} as const;

export const ProductForm = ({ categories, mode, initialData }: ProductFormProps) => {
  const [state, formAction, isPending] = useActionState<
    ProductFormState | null,
    FormData
  >(ACTIONS[mode], null);

  const errors = state?.errors;

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

      <FormField label="Title" htmlFor="title" error={errors?.title}>
        <input
          id="title"
          name="title"
          type="text"
          className="input"
          defaultValue={initialData?.title}
          disabled={isPending}
          placeholder="Title of the product..."
        />
      </FormField>

      <FormField label="Description" htmlFor="description" error={errors?.description}>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="input resize-none"
          defaultValue={initialData?.description}
          disabled={isPending}
          placeholder="Describe your product in detail..."
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Price (EUR)" htmlFor="price" error={errors?.price}>
          <input
            id="price"
            name="price"
            type="number"
            className="input"
            defaultValue={initialData?.price}
            disabled={isPending}
            placeholder="0.00 €"
          />
        </FormField>

        <FormField label="Location" htmlFor="location" error={errors?.location}>
          <input
            id="location"
            name="location"
            type="text"
            className="input"
            defaultValue={initialData?.location}
            disabled={isPending}
            placeholder="City, Country"
          />
        </FormField>
      </div>

      <SelectField
        label="category"
        htmlFor="categoryId"
        name="categoryId"
        error={errors?.categoryId}
        defaultValue={initialData?.categoryId}
        disabled={isPending}
        className="pr-9 appearance-none cursor-pointer"
      >
        <option value="">Select a category</option>
        {categories.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </SelectField>

      <ImageField
        initialUrl={initialData?.imageUrl}
        error={errors?.imageUrl}
        disabled={isPending}
      />

      {mode === 'edit' && (
        <SelectField
          label="Status"
          htmlFor="status"
          name="status"
          error={errors?.status}
          defaultValue={initialData?.status}
          disabled={isPending}
          className="pr-9 appearance-none cursor-pointer"
        >
          {STATUS_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </SelectField>
      )}

      <SubmitButton isPending={isPending} mode={mode} />
    </form>
  );
};

export default ProductForm;
