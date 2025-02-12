import { consultarCantidadUnidadesService } from "../OrdenesProdConfig/ordenesprodconfig.service.js";


const calcularUnidadesTotales = (cantidadBase, cantidadBandejas) => {
    return cantidadBase * cantidadBandejas;
  };
  

export const procesarDetallesOrden = async (detalles) => {
    return Promise.all(
      detalles.map(async (detalle) => {
        const cantidadBase = await consultarCantidadUnidadesService(detalle.idProducto);
        return {
          ...detalle,
          cantidadUnidades: calcularUnidadesTotales(cantidadBase, detalle.cantidadBandejas)
        };
      })
    );
  };