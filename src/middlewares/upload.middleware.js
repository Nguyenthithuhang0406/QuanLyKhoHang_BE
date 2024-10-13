const multer = require('multer');
const path = require('path');

//luu tru tam thoi tren server truoc khi upload len firebase
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // gioi han file size < 500MB
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|mp4|mkv|avi|svg|bmp|tiff|webp|heif|heic|raw|jfif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: File upload only supports the following filetypes - ' + filetypes);
    }
  },
});

module.exports = upload;