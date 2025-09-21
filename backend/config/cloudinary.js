import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary with your credentials from .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer to use Cloudinary for storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'project_logos', // A folder name in your Cloudinary account
        allowed_formats: ['jpeg', 'png', 'jpg'],
        // transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optional transformations
    }
});

// Create the Multer upload middleware
const upload = multer({ storage: storage });

export default upload;