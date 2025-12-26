/**
 * Middleware for handling photo uploads using multer.
 * Configures storage destination and filename format.
 */

import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Specify the directory where files will be stored
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); 
    if(!['.jpg', '.jpeg', '.png',].includes(ext.toLowerCase())) {
      return cb(new Error('Only images are allowed'));
    }
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName); 
  }
});

export const uploadImage = multer({ storage }).array("image", 10); //export a array image into req.files; max 10 image
