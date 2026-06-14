import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { uploadCSV } from "../../middlewares/upload.middleware.js";
import { ingresarOrdenProduccionBatchController } from "./ordenesprodbatch.controller.js";

export const ordenesBatchRoutes = Router();

ordenesBatchRoutes.post("/ingresar-orden-batch", authMiddleware, uploadCSV, ingresarOrdenProduccionBatchController);