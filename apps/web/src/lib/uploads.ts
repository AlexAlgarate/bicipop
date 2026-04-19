import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { supabase } from './supabase';

export const saveImageInPublic_ = async (file: File): Promise<string> => {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
  const filename = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const uploadPath = path.join(uploadDir, filename);

  await mkdir(uploadDir, { recursive: true });
  const bytes = await file.arrayBuffer();
  await writeFile(uploadPath, Buffer.from(bytes));

  return `/uploads/${filename}`;
};

export const saveImageInPublic = async (file: File): Promise<string> => {
  const BUCKET_NAME = 'products';

  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
  const filename = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(BUCKET_NAME).upload(filename, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) throw new Error(`Error al subir la imagen a Supabase: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filename);

  return data.publicUrl;
};
