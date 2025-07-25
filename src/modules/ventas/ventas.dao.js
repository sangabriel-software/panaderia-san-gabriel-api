import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const ingresarVentaDao = async (venta) => {
    const {encabezadoVenta, detallesVenta, detalleIngreso} = venta;
    try {
      // 1. Insertar encabezado
      const ventaInsert = `INSERT INTO VENTAS (idUsuario, idSucursal, ventaTurno, fechaVenta, totalVenta, fechaCreacion)
                                VALUES (?, ?, ?, ?, ?, ?);`;
  
      const resVenta = await Connection.execute(ventaInsert, [
        encabezadoVenta.idUsuario,
        encabezadoVenta.idSucursal,
        encabezadoVenta.ventaTurno,
        encabezadoVenta.fechaVenta, 
        detalleIngreso.montoTotalIngresado,
        encabezadoVenta.fechaCreacion
      ]);
      const idVenta = resVenta.toJSON().lastInsertRowid;

      if (!idVenta) {
        return 0;
      }
  
      // 2. Insertar detalles usando el ID generado     
      const ventaDetalleInsert = `INSERT INTO DETALLESVENTAS (idVenta, idProducto, cantidadVendida, precioUnitario, subtotal)
                                  VALUES (?, ?, ?, ?, ?);
                                 `;
  
      const batchDetalleVenta = detallesVenta.map((detalle) => ({
        sql: ventaDetalleInsert,
        args: [
            idVenta,
            detalle.idProducto,
            detalle.cantidadVendida,
            detalle.precioUnitario,
            detalle.subtotal
        ]
      }));
  
      const resBatch = await Connection.batch(batchDetalleVenta);
  
      // Extraer solo los lastInsertRowid de los resultados del batch
      const lastInsertRowids = resBatch.map(result => result.lastInsertRowid);
  
      return {idVenta, ...venta};
  
    } catch (error) {
      const dbError = getDatabaseError(error.message);
      throw new CustomError(dbError);
    }
};

export const consultarVentasPorUsuarioDao = async (idUsuario) => {
  try{

    const consulta = `select v.idVenta, v.ventaTurno, v.idUsuario, concat(u.nombreUsuario, ' ', u.apellidoUsuario)nombreUsuario, v.idSucursal, s.nombreSucursal, 
                      v.fechaVenta, v.totalVenta, v.estadoVenta from ventas v
                      INNER JOIN usuarios u ON v.idUsuario = u.idUsuario
                      INNER JOIN SUCURSALES s ON v.idSucursal = s.idSucursal
                      where 
                        (v.idUsuario = ? OR ? IS NULL OR ? = '')
                        order by v.idVenta desc;`
  
      // Ejecutar la consulta
      const ventasPorUsuario = await Connection.execute(consulta, [idUsuario, idUsuario, idUsuario]);

      // Devolver los registros encontrados
      return ventasPorUsuario.rows;

  }catch(error){
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }

}

export const eliminarVentaDao = async (idVenta) => {
  try{
    const scriptDelete = `DELETE FROM VENTAS WHERE idVenta = ?`;

    const resDelete = await Connection.execute(scriptDelete, [idVenta]);

    return resDelete.toJSON().rowsAffected;;
  }catch(error){
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const consultarDetalleVentaDao = async (idVenta) => {
  try{
    const scriptVenta = `select v.idVenta, v.idUsuario, v.idVenta, u.usuario, concat(u.nombreUsuario, ' ', u.apellidoUsuario)nombreUsuario, v.idSucursal, v.ventaTurno, s.nombreSucursal,
                          v.fechaVenta, v.totalVenta, v.estadoVenta 
                          from ventas v
                          INNER JOIN usuarios u on v.idUsuario = u.idUsuario
                          INNER JOIN sucursales s on v.idSucursal = s.idSucursal
                          where v.idVenta = ?;`;
                          
    const venta = await Connection.execute(scriptVenta, [idVenta]);

    if( venta.rows.length === 0){
      return 0;
    }

    const scriptDetalleVenta = `select dv.idDetalleVenta, dv.idVenta, dv.IdProducto, p.nombreProducto, p.controlarStock,
                                  p.controlarStockDiario, dv.cantidadVendida, dv.precioUnitario, dv.descuento,
                                  dv.subTotal from detallesventas dv
                                  INNER JOIN ventas v on dv.idVenta = v.idVenta
                                  INNER JOIN productos p on dv.idProducto = p.idProducto
                                  where dv.idVenta = ?;`;

    const detalleVenta = await Connection.execute(scriptDetalleVenta, [idVenta]);


    const scriptIngresos = `select i.idIngreso, i.idVenta, i.montoTotalIngresado, i.montoTotalGastos, i.montoEsperado, i.diferencia, i.fechaIngreso
                            from ingresosdiarios i
                            INNER JOIN ventas v on i.idVenta = v.idVenta
                            where i.idVenta = ?;`;
    
    const detalleIngresos = await Connection.execute(scriptIngresos, [idVenta]);

    const scriptGastos = `select dg.idGastoDiarioDetalle, dg.idGastoDiario, dg.DetalleGasto, dg.subtotal
                            from GASTOSDIARIOSDETALLES dg 
                            inner join GASTOSDIARIOS g on dg.idGastoDiario = g.idGastoDiario
                            where g.idVenta = ?;`;
    
    const detalleGastos = await Connection.execute(scriptGastos, [idVenta]);

    return {
      encabezadoVenta: venta.rows[0],
      detalleVenta: detalleVenta.rows,
      detalleIngresos: detalleIngresos.rows[0],
      detalleGastos: detalleGastos.rows
    }

  }catch(error){
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const consultarVentaporId = async (idVenta) => {
  try{

    const consulta = `select idVenta, idUsuario, idSucursal, ventaTurno,
                      fechaVenta, totalVenta, estadoVenta, fechaCreacion
                      from VENTAS
                      where idVenta = ?;`
  
      // Ejecutar la consulta
      const ventaPorId = await Connection.execute(consulta, [idVenta]);

      // Devolver los registros encontrados
      return ventaPorId.rows[0];

  }catch(error){
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }

}

export const consultarTopProductosMasVendiddosDao = async () => {
    try {
        const query = `SELECT 
                        p.idProducto,
                        p.nombreProducto,
                        SUM(dv.cantidadVendida) AS cantidad_total_vendida
                    FROM 
                        DETALLESVENTAS dv
                    JOIN 
                        VENTAS v ON dv.idVenta = v.idVenta
                    JOIN 
                        PRODUCTOS p ON dv.idProducto = p.idProducto
                    WHERE 
                        v.estadoVenta = 'C'  -- Solo ventas completadas
                        AND strftime('%Y', v.fechaVenta) = strftime('%Y', 'now')  -- Año actual
                    GROUP BY 
                        p.idProducto, p.nombreProducto
                    ORDER BY 
                        cantidad_total_vendida DESC
                    LIMIT 5;`;
        const result = await Connection.execute(query);
        return result.rows;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}