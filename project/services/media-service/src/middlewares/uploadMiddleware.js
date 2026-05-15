import multer from 'multer';

/**
 * Configure memory storage for Multer
 * 
 * In a microservices architecture, we often use memory storage to avoid 
 * writing temporary files to ephemeral worker containers (Kubernetes Pods). 
 * This ensures high availability and avoids hitting local storage limits.
 */
const storage = multer.memoryStorage();

// File Type Filter for Security
// Ensure only images or common documents are uploaded to prevent malicious files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type! Only image/pdf allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Max 5MB
});

export default upload;
