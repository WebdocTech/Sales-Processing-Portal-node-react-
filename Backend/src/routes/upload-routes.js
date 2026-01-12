import { Router } from "express";
import upload from "../middlewares/upload-middleware.js";
import {
  uploadAndProcess,
  getUploadsByCenter,
} from "../controller/upload-controller.js";

const router = Router();

router.post("/", upload.single("file"), uploadAndProcess);
router.get("/", getUploadsByCenter);
export default router;
