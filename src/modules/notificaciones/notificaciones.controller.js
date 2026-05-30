import { consultarActivacionesNotificacionesService } from "./notificaciones.service.js";

export const consultarActivacionesNotificacionesController = async (req, res, next) => {
  try {
    const usuariosNoti = await consultarActivacionesNotificacionesService();
    const responseData = {
      status: 200,
      usuariosNoti,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
}