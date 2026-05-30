import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { consultarActivacionesNotificacionesController } from "./notificaciones.controller.js";

export const activacionNotificaciones = Router();

activacionNotificaciones.get("/consultar-activaciones-notificaciones", authMiddleware, consultarActivacionesNotificacionesController);