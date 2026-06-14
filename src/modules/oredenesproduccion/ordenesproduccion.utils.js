import { consultarCantidadUnidadesBatchService, consultarCantidadUnidadesService } from "../OrdenesProdConfig/ordenesprodconfig.service.js";


const calcularUnidadesTotales = (cantidadBase, cantidadBandejas) => {
    return cantidadBase * cantidadBandejas;
};
  

export const procesarDetallesOrden = async (detalles) => {
  return Promise.all(
    detalles.map(async (detalle) => {
      // Solo procesamos bandejas
      if (detalle.tipoProduccion === "bandejas") {
        const cantidadBase = await consultarCantidadUnidadesService(detalle.idProducto);
        return {
          ...detalle,
          cantidadUnidades: detalle.idCategoria === 1 ?
            calcularUnidadesTotales(cantidadBase, detalle.cantidadBandejas)
            : detalle.cantidadUnidades
        };
      }
      
      // Para otros tipos de producción, devolver el detalle sin cambios
      return detalle;
    })
  );
};

// ------------------------------------------------------
// ------------- SERVICIOS OPTIMIZADOS  -----------------
//-------------------------------------------------------
export const procesarDetallesOrdenBatch = async (detalles) => {
    const detallesBandejas = detalles.filter(d => d.tipoProduccion === 'bandejas');

    const cantidadesMap = detallesBandejas.length > 0
        ? await consultarCantidadUnidadesBatchService(detallesBandejas.map(d => d.idProducto))
        : new Map();

    return detalles.map((detalle) => {
        if (detalle.tipoProduccion !== 'bandejas') return detalle;

        const cantidadBase = cantidadesMap.get(detalle.idProducto);

        return {
            ...detalle,
            cantidadUnidades: detalle.idCategoria === 1 || detalle.tipoProduccion === 'bandejas'
                ? calcularUnidadesTotales(cantidadBase, detalle.cantidadBandejas)
                : detalle.cantidadUnidades
        };
    });
};