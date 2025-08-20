// @ts-ignore - cloudinary module types not available
import { v2 as cloudinary } from 'cloudinary';
// @ts-ignore - cloudinary module types not available
import { UploadApiResponse } from 'cloudinary';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Debug logging (can be removed in production)
console.log('Cloudinary config status:', {
  cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
  api_key: !!process.env.CLOUDINARY_API_KEY,
  api_secret: !!process.env.CLOUDINARY_API_SECRET
});

// Helper function to upload file buffer to Cloudinary
function uploadToCloudinary(fileBuffer: Buffer): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error: any, result: any) => {
      if (error) return reject(error);
      resolve(result as UploadApiResponse);
    });
    (stream as any).end(fileBuffer);
  });
}

// Helper function to delete file from Cloudinary
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
}

// Helper function to get optimized URL
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  } = {}
): string {
  return cloudinary.url(publicId, {
    transformation: [
      {
        width: options.width,
        height: options.height,
        crop: 'fill',
        quality: options.quality || 'auto',
        fetch_format: options.format || 'auto',
      },
    ],
  });
}

// Export as default
export default uploadToCloudinary;