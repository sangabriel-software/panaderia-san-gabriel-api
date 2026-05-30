import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { consultarActivacionesNotificacionesDao } from "./notificaciones.dao.js";

export const consultarActivacionesNotificacionesService = async () => {
    try{
        const usuariosNoti = await consultarActivacionesNotificacionesDao();
        if(usuariosNoti.length === 0){
            const errorInfo = getError(1);
            throw new CustomError(errorInfo);
        }
        
        return usuariosNoti;
    }
    catch(error){
        throw error;
    }
};