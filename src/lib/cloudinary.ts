import { v2 as cloudinary } from 'cloudinary';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const API_KEY = process.env.CLOUDINARY_API_KEY || '';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || '';

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

/** True only when all three Cloudinary credentials are present. */
export function isCloudinaryConfigured(): boolean {
  return Boolean(CLOUD_NAME && API_KEY && API_SECRET);
}

export default cloudinary;

export async function uploadImage(
  file: string,
  folder: string = 'dona-center'
): Promise<string> {
  // Fail with a clear message instead of Cloudinary's cryptic
  // "Invalid Signature" when the env vars are missing (e.g. stale dev
  // server or Vercel without the keys set).
  if (!isCloudinaryConfigured()) {
    throw new Error(
      'Cloudinary nuk është konfiguruar. Shtoni variablat e Cloudinary (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) në .env.local dhe rinisni serverin (npm run dev:lan), ose shtoni variablat në Vercel.'
    );
  }
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      quality: 'auto',
      fetch_format: 'auto',
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
}

/**
 * Extract the Cloudinary public_id (e.g. "dona-center/products/abc") from a
 * delivery URL like .../image/upload/v123456/dona-center/products/abc.jpg
 * Returns null for non-Cloudinary URLs (e.g. Unsplash demo images).
 */
export function publicIdFromUrl(url: string): string | null {
  // Strip any query params first (e.g. ?w=800 or ?q_auto) so the extension
  // match below still works.
  const clean = url.split('?')[0];
  const match = clean.match(/\/image\/upload\/v\d+\/(.+)\.(jpe?g|png|webp|gif)$/i);
  return match ? match[1] : null;
}
