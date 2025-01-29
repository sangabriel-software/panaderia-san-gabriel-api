import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

let db = Connection;

export const consultarSucursalesDao = async () => {
  try {
    // Consulta SQL
    const query = `select idSucursal, nombreSucursal, direccionSucursal, municipioSucursal, departamentoSucursal,
                    latitudSucursal, longitudSucursal, telefonoSucursal, correoSucursal, fechaCreacion, 
                    estado from SUCURSALES
                    where estado = 'A';`;

    // Ejecutar la consulta
    const result = await db.execute(query);

    // Devolver los registros encontrados
    return result.rows;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
};

export const ingresarSucursalDao = async (sucursal) => {
  try {
    const insertQuery = `INSERT INTO SUCURSALES (nombreSucursal, direccionSucursal, municipioSucursal, 
    departamentoSucursal, latitudSucursal, longitudSucursal, telefonoSucursal, correoSucursal, 
    fechaCreacion)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;

    const result = await db.execute(insertQuery, [
      sucursal.nombreSucursal,
      sucursal.direccionSucursal,
      sucursal.municipioSucursal,
      sucursal.departamentoSucursal,
      sucursal.latitudSucursal,
      sucursal.longitudSucursal,
      sucursal.telefonoSucursal,
      sucursal.correoSucursal,
      sucursal.fechaCreacion,
    ]);

    return result.toJSON().lastInsertRowid;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
};

export const actualizarSucursalDao = async (sucursal) => {
  try {
    const updateQuery = `UPDATE SUCURSALES SET nombreSucursal = ?, direccionSucursal = ?, municipioSucursal = ?, 
    departamentoSucursal = ?, latitudSucursal = ?, longitudSucursal = ?, telefonoSucursal = ?, correoSucursal = ?, 
    fechaCreacion = ? WHERE idSucursal = ?;`;

    const result = await db.execute(updateQuery, [
      sucursal.nombreSucursal,
      sucursal.direccionSucursal,
      sucursal.municipioSucursal,
      sucursal.departamentoSucursal,
      sucursal.latitudSucursal,
      sucursal.longitudSucursal,
      sucursal.telefonoSucursal,
      sucursal.correoSucursal,
      sucursal.fechaCreacion,
      sucursal.idSucursal,
    ]);

    return result.toJSON().rowsAffected;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
};

export const eliminarSucursalDao = async (idSucursal) => {
  try {
    const deleteQuery = `DELETE FROM SUCURSALES WHERE idSucursal = ?;`;

    const result = await db.execute(deleteQuery, [idSucursal]);

    return result.toJSON().rowsAffected;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
};
