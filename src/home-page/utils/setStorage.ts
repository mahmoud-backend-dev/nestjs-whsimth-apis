import { Request } from "express";
import multer, { diskStorage } from "multer";
import { v4 } from "uuid";

export function setStorage(path: string): multer.StorageEngine{
  return diskStorage({
    destination: `src/home-page/uploads/${path}`,
    filename: (req: Request, file: Express.Multer.File, cb) => {
      const ext = file.mimetype.split('/')[1];
      const filename: string = `${path}-${v4()}.${ext}`;
      cb(null, filename);
    }
  })
}