import { supabase } from './supabase';

const BUCKET_NAME = 'products';

export const uploadImgInSupabaseBucket = async (file: File): Promise<string> => {
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
