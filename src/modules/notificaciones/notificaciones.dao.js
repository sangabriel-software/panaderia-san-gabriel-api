import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const consultarActivacionesNotificacionesDao = async () => {
    try {
        const script = `SELECT 
                        u.idUsuario,
                        u.nombreUsuario,
                        u.apellidoUsuario,
                        u.correoUsuario,
                        u.aliasUsuario,
                        COALESCE(an.activo, 0) AS activo,        -- si no tiene registro devuelve 0
                        COALESCE(an.tipoEvento, '') AS tipoEvento
                    FROM USUARIOS u
                    LEFT JOIN activacion_notificaciones an 
                        ON an.idUsuario = u.idUsuario 
                        AND an.tipoEvento = 'orden_especial'
                    WHERE u.idRol = 1
                    AND u.estadoUsuario = 'A'
                    AND u.estado = 'A';`;
        const result = await Connection.execute(script);

        return result.rows;
    } catch (error) {
        console.log(error);
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}