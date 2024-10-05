const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/apiError');
const httpStatus = require('http-status');
const { admin } = require('../configs/firebase.config');

const uploadFiles = catchAsync(async (req, res, next) => {

  const bucket = admin.storage().bucket();
  const uploadPromises = req.files.map((file) => {
    const folder = file.mimetype.startsWith('image') ? 'images' : 'videos';
    const blob = bucket.file(`QuanLyKhoHang/${folder}/${Date.now()}_${file.originalname}`);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (error) => {
        reject(error);
      });

      blobStream.on('finish', () => {
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucket.name)}/o/${encodeURIComponent(blob.name)}?alt=media`;
        resolve(publicUrl);
      })

      blobStream.end(file.buffer);
    });
  });

  const fileUrls = await Promise.all(uploadPromises);

  try {
    req.body.fileUrls = fileUrls;
    next();
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }

  // return res.status(httpStatus.CREATED).json({
  //   message: 'Files uploaded successfully',
  //   code: httpStatus.CREATED,
  //   data: {
  //     fileUrls,
  //   },
  // });

});

module.exports = uploadFiles;
