import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { registrarBatchConsumoOrdenProduccionServices } from "../consumosordenesproduccion/consumosordenes.service.js";
import { CalcularCantidadIngredientes } from "../consumosordenesproduccion/cosumoordenesproduccion.utils.js";
import { elminarStockDiarioService, procesarStockPorOrdenProduccionServices } from "../StockProductos/stockProductos.service.js";
import { actualizarEstadoOrdenProduccionDao, consultarDetalleOrdenPorCriteriosDao, consultarDetalleOrdenProduccionDao, consultarOrdenProduccionDao, consultarUnidadesDeProductoPorOrdenDao, eliminarOrdenProduccionDao, ingresarOrdenProduccionDao } from "./ordenesproduccion.dao.js";
import { procesarDetallesOrden } from "./ordenesproduccion.utils.js";

export const consultarOrdenProduccionService = async (idRol, idSucursal) => {
    try {
      const ordenesProduccion = await consultarOrdenProduccionDao(idRol, idSucursal);

      if (ordenesProduccion.length === 0) {
        const error = getError(1);
        throw new CustomError(error);
      }

      return ordenesProduccion;
    } catch (error) {
      throw error;
    }
};

export const consultarDetalleOrdenProduccionService = async (idOrdenProduccion) => {
  try {
    const detalleOrden = await consultarDetalleOrdenProduccionDao(idOrdenProduccion);

    if (detalleOrden.length === 0) {
      const error = getError(1);
      throw new CustomError(error);
    }

    return detalleOrden;
  } catch (error) {
    throw error;
  }
};

export const eliminarOrdenProduccionService = async (idOrdenProduccion) => {
  try {

    await elminarStockDiarioService(idOrdenProduccion);

    const result = await eliminarOrdenProduccionDao(idOrdenProduccion);
    if (result === 0) {
      const error = getError(4);
      throw new CustomError(error);
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const ingresarOrdenProduccionService = async (ordenProduccion) => {
  try {
  
    const { encabezadoOrden, detalleOrden } = ordenProduccion;
    const ordenExist = await consultarDetalleOrdenPorCriteriosService(encabezadoOrden.ordenTurno, encabezadoOrden.fechaAProducir, encabezadoOrden.idSucursal );

    if(ordenExist.encabezadoOrden !== null){
      const errorInfo = getError(19);
      throw new CustomError(errorInfo);
    }
    
    // Detalles de la orden de producción con cantidad de unidades por bandeja
    const detallesActualizados = await procesarDetallesOrden(detalleOrden);
    
    const ordenParaDAO = {
      orden: encabezadoOrden,
      detallesOrden: detallesActualizados
    };

    // Ingresar la orden de produccion
    const resultado = await ingresarOrdenProduccionDao(ordenParaDAO);
    
    if(resultado !== 0){
      ordenParaDAO.orden.idOrden = resultado.idOrdenGenerada;
      await procesarStockPorOrdenProduccionServices(ordenParaDAO);
    }

    // Generar payload para consumo de ingredientes
    const OrdenProdNew = {
      detallesOrden: resultado.idDetalleOrdenProduccion.map((idDetalle, index) => ({
        idDetalleOrdenProduccion: idDetalle,
        ...detallesActualizados[index]
      }))
    };

    const consumoOrdenProduccion = await CalcularCantidadIngredientes(OrdenProdNew); // Obtener ingredientes y cantidades a consumir
    if (consumoOrdenProduccion && consumoOrdenProduccion.length > 0) {
      await registrarBatchConsumoOrdenProduccionServices(consumoOrdenProduccion);
    }

    if (resultado.idOrdenGenerada === 0) {
      const errorInfo = getError(2);
      throw new CustomError(errorInfo);
    }

    return resultado;
  } catch (error) {
    throw error;
  }
};

export const consultarUnidadesDeProductoPorOrdenService = async (idOrdenProduccion, idProducto) => {
  try {
    const detalleOrden = await consultarUnidadesDeProductoPorOrdenDao(idOrdenProduccion, idProducto);

    if (detalleOrden.length === 0) {
      throw new CustomError(getError(1));
    }

    return detalleOrden;
  } catch (error) {
    throw error;
  }
};

export const actualizarEstadoOrdenProduccionServices = async (idOrdenProduccion) => {
  try {

    const ordenActualizada = await actualizarEstadoOrdenProduccionDao(idOrdenProduccion);

    if (ordenActualizada === 0) {
       throw new CustomError(getError(3));
    }

    return ordenActualizada;
  } catch (error) {
    throw error;
  }
};

export const consultarDetalleOrdenPorCriteriosService = async (ordenTurno, fechaAproducir, idSucursal) => {
  try {
    const detalleOrden = await consultarDetalleOrdenPorCriteriosDao(ordenTurno, fechaAproducir, idSucursal);

    if (detalleOrden === 0) {
      const error = getError(1);
      throw new CustomError(error);
    }

    return detalleOrden;
  } catch (error) {
    throw error;
  }
};