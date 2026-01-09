import { Router } from "express";
import { createCompanyController } from "../controller/company-controller.js";

const router = Router();

router.post("/", createCompanyController);

export default router;
