import multer from "multer";
import path from "path";
import fs from "fs";

const dir = "uploads";
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, dir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeBase = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "");
    cb(null, `${Date.now()}_${safeBase}${ext}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }
});
