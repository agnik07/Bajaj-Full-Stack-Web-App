import { Router } from "express";
import { processHierarchy } from "../controllers/bfhlController.js";

const router = Router();

router.post("/", processHierarchy);

export default router;
