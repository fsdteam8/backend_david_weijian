import multer from "multer";

const storage = multer.diskStorage({
  destination: function (_, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (_, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

export default upload;