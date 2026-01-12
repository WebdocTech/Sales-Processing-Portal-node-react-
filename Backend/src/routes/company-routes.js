import { Router } from "express";
import {
  createCompanyController,
  getCompanies,
} from "../controller/company-controller.js";

const router = Router();

router.post("/", createCompanyController);
router.get("/", getCompanies);
export default router;
