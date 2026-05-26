import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { registrarIngresosDiariosPorTurnoDao } from "./ingresos.dao.js";
import { calcularDiferencia, calcularVentaNeta } from "./ingresos.utils.js";


export const registrarIngresoDiarioPorTurnoService = async (detalleingreso) =>{
    try{

        const diferencia =  calcularDiferencia(detalleingreso.montoEsperado, detalleingreso.montoTotalIngresado, detalleingreso.montoTotalGasto);
        const ventaNeta = calcularVentaNeta(detalleingreso.montoTotalIngresado, detalleingreso.montoTotalGasto);
        const detalleIngresoConDiferencia = {
            ...detalleingreso, // Copiar todas las propiedades existentes
            ventaNeta: ventaNeta,
            diferencia: diferencia, // Agregar la diferencia calculada
            montoTotalGastos: detalleingreso.montoTotalGasto,
        };

        const idIngreso = await registrarIngresosDiariosPorTurnoDao(detalleIngresoConDiferencia);
        if (idIngreso === 0) {
            throw new CustomError(getError(2));
        }

        return idIngreso;

    }catch(error){
        throw error;
    }
}