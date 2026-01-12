import { Router } from "express";
import {
  createServiceController,
  getServiceByCompanyController,
} from "../controller/service-controller.js";

const router = Router();

router.post("/", createServiceController);
router.get("/", getServiceByCompanyController);

export default router;
