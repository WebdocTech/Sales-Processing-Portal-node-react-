import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const cleanName = file.originalname
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_.-]/g, "");
    const unique = `${Date.now()}-${cleanName}`;
    cb(null, unique);
  },
});

export default multer({
  storage,
  fileFilter: (_, file, cb) => {
    if (!file.originalname.endsWith(".xlsx")) {
      return cb(new Error("Only XLSX files allowed"));
    }
    cb(null, true);
  },
});
