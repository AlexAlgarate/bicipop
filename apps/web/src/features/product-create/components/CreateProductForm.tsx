'use client';

import { useActionState, useState } from 'react';
import { createAdAction } from '../actions';

import { CreateProductButton } from './CreateProductButton';
import { FormField } from './fields/FormField';
import { ImageUploadField } from './fields/ImageUploadField';
import { CategorySelectField } from './fields/CategoryField';
import { Category, ProductFormState } from '../types';

interface CreateAdFormProps {
  categories: Category[];
}

const initialState: ProductFormState = {
  success: false,
  message: '',
  requestId: 0,
};

export const CreateAdForm = ({ categories }: CreateAdFormProps) => {
  const [state, formAction, isPending] = useActionState(createAdAction, initialState);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleAction = (formData: FormData) => {
    if (imageFile) formData.set('imageUrl', imageFile);
    return formAction(formData);
  };

  return (
    <form
      key={state.requestId}
      action={handleAction}
      className="flex flex-col gap-4 border border-border rounded-xl p-4"
    >
      {state.errors?.general && (
        <p className="text-red-500 text-sm">{state.errors.general}</p>
      )}

      <FormField label="Título" htmlFor="title" error={state.errors?.title}>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Ej: Bicicleta de montaña"
          defaultValue={state.values?.title}
        />
      </FormField>

      <FormField
        label="Descripción"
        htmlFor="description"
        error={state.errors?.description}
      >
        <textarea
          id="description"
          name="description"
          rows={4}
          placeholder="Describe tu anuncio..."
          className="resize-none"
          defaultValue={state.values?.description}
        />
      </FormField>

      <FormField label="Precio" htmlFor="price" error={state.errors?.price}>
        <input
          id="price"
          name="price"
          type="number"
          placeholder="0"
          step="0.01"
          defaultValue={state.values?.price}
        />
      </FormField>

      <CategorySelectField
        categories={categories}
        error={state.errors?.categories}
        defaultValue={state.values?.categories}
      />

      <FormField label="Localización" htmlFor="location" error={state.errors?.location}>
        <input
          id="location"
          name="location"
          type="text"
          placeholder="Ej: Madrid"
          defaultValue={state.values?.location}
        />
      </FormField>

      <ImageUploadField
        error={state.errors?.imageUrl}
        onFileChange={setImageFile}
        file={imageFile}
      />

      <CreateProductButton isPending={isPending} />
      {state.message && (
        <p
          className={`text-sm ${
            state.success
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
};
