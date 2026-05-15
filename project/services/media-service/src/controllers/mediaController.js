/**
 * Media Controller: Handles File Uploads via Cloudinary
 * 
 * In a real production environment, this service:
 * 1. Validates the file type and size (via multer)
 * 2. Uploads to Cloudinary
 * 3. Returns the publicly accessible URL
 * 4. Could optionally emit a Kafka event if other services need to store the link
 */

import cloudinary from '../config/cloudinary.js';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
    }

    // Convert Buffer to Base64 to upload to Cloudinary directly from memory
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    // Upload to Cloudinary with options
    // folder: defines the target directory in Cloudinary
    // resource_type: auto (handles images, videos, raw files)
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "microservices_app/media",
      resource_type: "auto"
    });

    res.status(200).json({
      status: 'success',
      data: {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        bytes: result.bytes
      }
    });
  } catch (err) {
    console.error('Cloudinary Upload Error:', err);
    res.status(500).json({ status: 'error', message: 'File upload failed' });
  }
};

