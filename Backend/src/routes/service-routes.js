import { Router } from "express";
import { createServiceController } from "../controller/service-controller.js";

const router = Router();

router.post("/", createServiceController);

export default router;
