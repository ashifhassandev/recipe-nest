const fs = require("fs");
const path = require("path");

const multer = require("multer");

// Multer configuration to store image files
const uploadDirRecipes = path.join(
  __dirname,
  "..",
  "public",
  "images",
  "recipes",
);
if (!fs.existsSync(uploadDirRecipes)) {
  fs.mkdirSync(uploadDirRecipes, { recursive: true });
}

const uploadDirCategories = path.join(
  __dirname,
  "..",
  "public",
  "images",
  "categories",
);
if (!fs.existsSync(uploadDirCategories)) {
  fs.mkdirSync(uploadDirCategories, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.body.categoryName) {
      cb(null, uploadDirCategories);
    } else if (req.body.recipeName) {
      cb(null, uploadDirRecipes);
    } else {
      cb(new Error("Invalid request. Missing category or recipe data."), false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
}).single("image");

module.exports = upload;