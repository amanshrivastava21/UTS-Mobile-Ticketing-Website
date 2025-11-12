const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Reusable function to create storage for a specific folder
const createStorage = (folder) => {
  const dir = `uploads/${folder}`;
  // Ensure folder exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Avoid conflicts
    },
  });
};

// Filter for image files only
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

// Export helper to create an upload middleware for a folder
const upload = (folder) =>
  multer({
    storage: createStorage(folder),
    fileFilter: imageFileFilter,
  });

module.exports = upload;
