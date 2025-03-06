import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const registrarIngresosDiariosPorTurnoDao = async (dataIngesos) =>{
    try{
        const insertIngreso = `INSERT INTO INGRESOSDIARIOS (idVenta, montoTotalIngresado, montoEsperado, diferencia, fechaIngreso)
                            VALUES (?, ?, ?, ?, ?);`

       const resInsert = await Connection.execute(insertIngreso, [
        dataIngesos.idVenta,
        dataIngesos.montoTotalIngresado,
        dataIngesos.montoEsperado,
        dataIngesos.diferencia,
        dataIngesos.fechaIngreso,
       ])

       const idIngreso = resInsert.toJSON().lastInsertRowid;

       return idIngreso;
    }catch(error){
        console.log(error)
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}

