
import CustomError from "../../utils/CustomError.js";
import { extraerFechaDeFechaYHora, obtenerSoloFecha } from "../../utils/date.utils.js";
import { getError } from "../../utils/generalErrors.js";
import { actualizarStockProductoDao, actualizarStockProductoDiarioDao, actualizarStockProductoDiariosBatchDao, actualizarStockProductosBatchDao, consultarStockProductoDao, consultarStockProductoDiarioDao, IngresarHistorialStockBatchDao, IngresarHistorialStockDao } from "../StockProductos/stockProductos.dao.js";
import { consultarStockProductoDiarioOptimizadoService, consultarStockProductosOptimizadoService } from "../StockProductos/stockProductos.service.js";
import { cancelarDescuentoDeStockDao, consultarDescuentoStockPorSucursalDato, consultarDetalleDescuentosDao, ingresarDescuentoDao } from "./descontarStock.dao.js";
import { crearPayloadDescontarStockDiario, crearPayloadDescontarStockGeneral, crearPayloadHistorialStock } from "./descontarStock.utils.js";


export const consultarDescuentoStockPorSucursalService = async (idSucursal) => {
    try {
        const descuentos = await consultarDescuentoStockPorSucursalDato(idSucursal);
        return descuentos;
    } catch (error) {
        throw error;
    }
}

export const IngresarDescuentoServices = async (stockADescontarData) => {
    try {

        await descontarStockServicesOptimizado(stockADescontarData);

        const res = await ingresarDescuentoDao(stockADescontarData);
        if (res === 0) {
            throw new CustomError(getError(2));
        }

        return res;
    } catch (error) {
        throw error;
    }
}

export const descontarStockServices = async (stockADescontarData) => {
    try{
        const {descuentoInfo, detalleDescuento} = stockADescontarData;
        
        return Promise.all(
            detalleDescuento.map(async (producto) => {
                try{

                    if(producto.controlarStock === 0 && producto.controlarStockDiario === 1){
                        const productoDiarioExist = await consultarStockProductoDiarioDao( producto.idProducto, descuentoInfo.idSucursal, descuentoInfo.fechaCreacion );
                        
                        if(productoDiarioExist.idStock !== 0 ){

                            const payloadDescont = crearPayloadDescontarStockDiario(descuentoInfo, producto, productoDiarioExist);

                            await actualizarStockProductoDiarioDao(payloadDescont);
                        }
                    }else{

                        const produtoExist = await consultarStockProductoDao(producto.idProducto, descuentoInfo.idSucursal);
                        if(produtoExist.idStock !== 0){

                            const payloadDescuentoG = crearPayloadDescontarStockGeneral(descuentoInfo, producto, produtoExist);

                            const payloadHistorial = crearPayloadHistorialStock(descuentoInfo, producto, produtoExist);

                            await actualizarStockProductoDao(payloadDescuentoG);
                            await IngresarHistorialStockDao(payloadHistorial);
                        }
                    }

                }catch(error){
                    throw error;
                }
            })
        );

    }catch(error){
        throw error;
    }
}

export const consultarDetalleDescuentosService = async (idDescuento) => {
    try{
        const res = await consultarDetalleDescuentosDao(idDescuento);
        return res;
    }catch(error){
        throw error;
    }
}

export const cancelarDescuentoStockService = async (idDescuento) => {
    try{

        await revertirDescuentoEnStockOptimizado(idDescuento);
        
        const res = await cancelarDescuentoDeStockDao(idDescuento);

        if(res === 0){
            throw new CustomError(getError(4));
        }

        return res;
    }catch(error){
        throw error;
    }   
}

export const revertirDescuentoEnStock = async (idDescuento) => {
    try{
        const detalleProductosEnDescuento = await consultarDetalleDescuentosDao(idDescuento); 
        const {encabezadoDescuento, detalleDescuento} = detalleProductosEnDescuento;
        return Promise.all(
            detalleDescuento.map( async (producto) => {
                try{
                    
                    if(producto.controlarStock === 1 && producto.controlarStockDiario === 0){
                        const productoEnStock = await consultarStockProductoDao(producto.idProducto, encabezadoDescuento.idSucursal);
                        
                        const payloadRevertir = {
                            idSucursal: encabezadoDescuento.idSucursal,
                            idProducto: producto.idProducto,
                            stock: productoEnStock.stock + producto.unidadesDescontadas,
                            fechaActualizacion: encabezadoDescuento.fechaDescuento
                        }

                        await actualizarStockProductoDao(payloadRevertir);

                        const payloadHistorial = {
                            idUsuario: encabezadoDescuento.idUsuario,
                            idProducto: producto.idProducto,
                            idSucursal: encabezadoDescuento.idSucursal,
                            tipoMovimiento: 'INGRESO',
                            stockAnterior: productoEnStock.stock,
                            cantidad: producto.unidadesDescontadas,
                            stockNuevo: productoEnStock.stock + producto.unidadesDescontadas,
                            fechaActualizacion: encabezadoDescuento.fechaDescuento,
                            observaciones: 'Revertir descuento por cancelacion',
                            tipoReferencia: 'DESCUENTO'
                        }

                        await IngresarHistorialStockDao(payloadHistorial);

                    }else{

                        const productoEnStockDiario = await consultarStockProductoDiarioDao(producto.idProducto, encabezadoDescuento.idSucursal, obtenerSoloFecha(encabezadoDescuento.fechaDescuento));
                        const payloadRevertir = {
                            idSucursal: encabezadoDescuento.idSucursal,
                            idProducto: producto.idProducto,
                            stock: productoEnStockDiario.stock + producto.unidadesDescontadas,
                            fechaActualizacion: encabezadoDescuento.fechaDescuento,
                            fechaValidez: obtenerSoloFecha(encabezadoDescuento.fechaDescuento)

                        }

                        await actualizarStockProductoDiarioDao(payloadRevertir);
                    }

                    
                }catch(error){
                    throw error;
                }
            })
            
        );
    }catch(error){
        throw error;
    }
}

// ------------------------------------------------------
// ------------- SERVICIOS OPTIMIZADOS  -----------------
//-------------------------------------------------------
export const descontarStockServicesOptimizado = async (stockADescontarData) => {
    try {
        const { descuentoInfo, detalleDescuento } = stockADescontarData;

        const idsProductos = detalleDescuento.map(d => d.idProducto);

        const productosDiario  = detalleDescuento.filter(p => p.controlarStock === 0 && p.controlarStockDiario === 1);
        const productosGeneral = detalleDescuento.filter(p => !(p.controlarStock === 0 && p.controlarStockDiario === 1));

        const [stockProductos, stockProductosDiarios] = await Promise.all([
            productosGeneral.length > 0
                ? consultarStockProductosOptimizadoService(idsProductos, descuentoInfo.idSucursal)
                : Promise.resolve({ getStock: () => ({ idStock: 0 }) }),
            productosDiario.length > 0
                ? consultarStockProductoDiarioOptimizadoService(idsProductos, descuentoInfo.idSucursal, descuentoInfo.fechaCreacion)
                : Promise.resolve({ getStockDiario: () => ({ idStockDiario: 0 }) }),
        ]);

        const payloadsStockGeneral  = [];
        const payloadsStockDiario   = [];
        const payloadsHistorial     = [];

        productosGeneral.forEach((producto) => {
            const productoExist = stockProductos.getStock(producto.idProducto);
            if (productoExist.idStock !== 0) {
                payloadsStockGeneral.push(crearPayloadDescontarStockGeneral(descuentoInfo, producto, productoExist));
                payloadsHistorial.push(crearPayloadHistorialStock(descuentoInfo, producto, productoExist));
            }
        });

        productosDiario.forEach((producto) => {
            const productoDiarioExist = stockProductosDiarios.getStockDiario(producto.idProducto);
            if (productoDiarioExist.idStockDiario !== 0) {
                payloadsStockDiario.push(crearPayloadDescontarStockDiario(descuentoInfo, producto, productoDiarioExist));
                payloadsHistorial.push(crearPayloadHistorialStock(descuentoInfo, producto, productoDiarioExist));
            }
        });

        await Promise.all([
            payloadsStockGeneral.length > 0 ? actualizarStockProductosBatchDao(payloadsStockGeneral)      : Promise.resolve(),
            payloadsStockDiario.length  > 0 ? actualizarStockProductoDiariosBatchDao(payloadsStockDiario) : Promise.resolve(),
            payloadsHistorial.length    > 0 ? IngresarHistorialStockBatchDao(payloadsHistorial)            : Promise.resolve(),
        ]);

    } catch (error) {
        throw error;
    }
};

export const revertirDescuentoEnStockOptimizado = async (idDescuento) => {
    try {
        const detalleProductosEnDescuento = await consultarDetalleDescuentosDao(idDescuento);
        const { encabezadoDescuento, detalleDescuento } = detalleProductosEnDescuento;

        const idsProductos = detalleDescuento.map(d => d.idProducto);

        const productosGeneral = detalleDescuento.filter(d => d.controlarStock === 1 && d.controlarStockDiario === 0);
        const productosDiario  = detalleDescuento.filter(d => !(d.controlarStock === 1 && d.controlarStockDiario === 0));

        const [stockProductos, stockProductosDiarios] = await Promise.all([
            productosGeneral.length > 0
                ? consultarStockProductosOptimizadoService(idsProductos, encabezadoDescuento.idSucursal)
                : Promise.resolve({ getStock: () => ({ idStock: 0 }) }),
            productosDiario.length > 0
                ? consultarStockProductoDiarioOptimizadoService(idsProductos, encabezadoDescuento.idSucursal, obtenerSoloFecha(encabezadoDescuento.fechaDescuento))
                : Promise.resolve({ getStockDiario: () => ({ idStockDiario: 0 }) }),
        ]);

        const payloadsStockGeneral  = [];
        const payloadsStockDiario   = [];
        const payloadsHistorial     = [];

        productosGeneral.forEach((producto) => {
            const productoEnStock = stockProductos.getStock(producto.idProducto);
            const stockNuevo = productoEnStock.stock + producto.unidadesDescontadas;

            payloadsStockGeneral.push({
                idSucursal:         encabezadoDescuento.idSucursal,
                idProducto:         producto.idProducto,
                stock:              stockNuevo,
                fechaActualizacion: encabezadoDescuento.fechaDescuento,
            });

            payloadsHistorial.push({
                idUsuario:          encabezadoDescuento.idUsuario,
                idProducto:         producto.idProducto,
                idSucursal:         encabezadoDescuento.idSucursal,
                tipoMovimiento:     'INGRESO',
                stockAnterior:      productoEnStock.stock,
                cantidad:           producto.unidadesDescontadas,
                stockNuevo:         stockNuevo,
                fechaActualizacion: encabezadoDescuento.fechaDescuento,
                observaciones:      'Revertir descuento por cancelacion',
                tipoReferencia:     'DESCUENTO',
            });
        });

        productosDiario.forEach((producto) => {
            const productoEnStockDiario = stockProductosDiarios.getStockDiario(producto.idProducto);
            const stockNuevo = productoEnStockDiario.stock + producto.unidadesDescontadas;

            payloadsStockDiario.push({
                idSucursal:         encabezadoDescuento.idSucursal,
                idProducto:         producto.idProducto,
                stock:              stockNuevo,
                fechaActualizacion: encabezadoDescuento.fechaDescuento,
                fechaValidez:       obtenerSoloFecha(encabezadoDescuento.fechaDescuento),
            });

            payloadsHistorial.push({
                idUsuario:          encabezadoDescuento.idUsuario,
                idProducto:         producto.idProducto,
                idSucursal:         encabezadoDescuento.idSucursal,
                tipoMovimiento:     'INGRESO',
                stockAnterior:      productoEnStockDiario.stock,
                cantidad:           producto.unidadesDescontadas,
                stockNuevo:         stockNuevo,
                fechaActualizacion: encabezadoDescuento.fechaDescuento,
                observaciones:      'Revertir descuento por cancelacion',
                tipoReferencia:     'DESCUENTO',
            });
        });

        await Promise.all([
            payloadsStockGeneral.length > 0 ? actualizarStockProductosBatchDao(payloadsStockGeneral)      : Promise.resolve(),
            payloadsStockDiario.length  > 0 ? actualizarStockProductoDiariosBatchDao(payloadsStockDiario) : Promise.resolve(),
            payloadsHistorial.length    > 0 ? IngresarHistorialStockBatchDao(payloadsHistorial)            : Promise.resolve(),
        ]);

    } catch (error) {
        throw error;
    }
};