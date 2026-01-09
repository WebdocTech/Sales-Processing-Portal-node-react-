import { Router } from "express";
import upload from "../middlewares/upload-middleware.js";
import { uploadAndProcess } from "../controller/upload-controller.js";

const router = Router();

router.post("/", upload.single("file"), uploadAndProcess);

export default router;
