import { Router } from "express";
import {
  createUserController,
  getUserController,
} from "../controller/user-controller.js";

const router = Router();
router.post("/create", createUserController);
router.post("/login", getUserController);

export default router;
