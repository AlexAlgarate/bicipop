import { supabase } from '@/infrastructure/db/supabase/supabase';

const BUCKET_NAME = 'products';
const MAX_SIZE_MB = 5;

export const uploadImgInSupabaseBucket = async (file: File): Promise<string> => {
  if (file.size > MAX_SIZE_MB * 1024 * 1024)
    throw new Error(`Image size cannot be greater than ${MAX_SIZE_MB}MB`);

  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
  const filename = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(BUCKET_NAME).upload(filename, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) throw new Error(`Error uploading image to Supabase: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filename);

  return data.publicUrl;
};
