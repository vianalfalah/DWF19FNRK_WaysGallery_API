const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

exports.uploadImage = (field) => {
  // const storage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "uploads");
  //   },
  //   filename: function (req, file, cb) {
  //     cb(null, Date.now() + "-" + file.originalname);
  //   },
  // });
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
  const storage = new CloudinaryStorage({
    // cloudinary: cloudinary,
    // folder: "waysbeans",
    // allowedFormats: ["jpg", "png"],
    cloudinary: cloudinary,
    params: async (req, file) => {
      // async code using `req` and `file`
      // ...
      return {
        folder: "waysgallery",
        public_id: `${Date.now()} - ${file.originalname}`,
      };
    },
  });
  const imageFilter = function (req, file, cb) {
    if (
      !file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|webp|GIF)$/)
    ) {
      req.fileValidationError = {
        message: "Only image files are allowed!",
      };
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  };

  const maxSize = 10 * 1000 * 1000;

  const upload = multer({
    storage,
    fileFilter: imageFilter,
    limits: {
      fileSize: maxSize,
    },
  }).array(field);

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError)
        return res.status(400).send(req.fileValidationError);

      if (!req.files && !err)
        return res.status(400).send({
          message: "Please select an image to upload",
        });

      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "Max file sized 2MB",
          });
        }
        return res.status(400).send(err);
      }

      return next();
    });
  };
};
