/**
 * Middleware for handling photo uploads using multer.
 * Configures storage destination and filename format.
 */

import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Specify the directory where files will be stored
  },
  filename: (req, file, cb) => {
    if(!file) {
      return cb(new Error('File is missing'));
    }
    const ext = path.extname(file.originalname); 
    if(!['.jpg', '.jpeg', '.png',].includes(ext.toLowerCase())) {
      return cb(new Error('Only images are allowed'));
    }
    const randomString = crypto.randomBytes(16).toString('hex'); 
    const uniqueName = `${Date.now()}-${randomString}${ext}`;
    cb(null, uniqueName); 
  }
});

export const uploadImage = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 
    },
}).array('images', 10);