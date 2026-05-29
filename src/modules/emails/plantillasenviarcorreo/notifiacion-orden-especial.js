import dayjs from "dayjs";
import "dayjs/locale/es.js";

dayjs.locale("es");

const generarPlantillaNotificacionOrdenEspecial = (ordenEspecial) => {
    const { ordenEncabezado, ordenDetalle } = ordenEspecial;

    const formatearFecha = (fechaISO) => {
        if (!fechaISO) return "—";
        return dayjs(fechaISO).format("D [de] MMMM [de] YYYY");
    };

    const totalUnidades = ordenDetalle.reduce(
        (acc, item) => acc + item.cantidadUnidades, 0
    );

    const filasProductos = ordenDetalle.map((item, index) => `
        <tr style="border-bottom: 1px solid #f0e8dc;">
            <td style="padding: 14px 16px; font-family: 'Georgia', serif; font-size: 14px; color: #3d2b1f;">
                <span style="
                    display: inline-block;
                    width: 24px; height: 24px;
                    background: #c8783a;
                    color: #fff;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 24px;
                    font-size: 11px;
                    font-family: Arial, sans-serif;
                    margin-right: 8px;
                    font-weight: bold;
                ">${index + 1}</span>
                ${item.nombreProducto}
            </td>
            <td style="padding: 14px 16px; font-family: Arial, sans-serif; font-size: 13px; color: #6b4e3d; text-align: center;">${item.idProducto}</td>
            <td style="padding: 14px 16px; font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; color: #c8783a; text-align: right;">${item.cantidadUnidades.toLocaleString("es-GT")} <span style="font-size: 11px; font-weight: normal; color: #a07850;">uds.</span></td>
            <td style="padding: 14px 16px; font-family: Arial, sans-serif; font-size: 12px; color: #a07850; text-align: center;">${formatearFecha(item.fechaCreacion)}</td>
        </tr>
    `).join("");

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />|
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Nueva Orden Especial #${ordenEncabezado.idOrdenEspecial}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #faf6f1; font-family: Arial, sans-serif;">

    <!-- Wrapper -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf6f1; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="620" cellpadding="0" cellspacing="0" style="max-width: 620px; width: 100%;">

                    <!-- ═══ HEADER ═══ -->
                    <tr>
                        <td style="
                            background: linear-gradient(135deg, #2c1810 0%, #4a2c1a 50%, #6b3d22 100%);
                            border-radius: 16px 16px 0 0;
                            padding: 0;
                            overflow: hidden;
                        ">
                            <!-- Franja decorativa superior -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="height: 4px; background: linear-gradient(90deg, #c8783a, #e8a96a, #c8783a, #e8a96a, #c8783a);"></td>
                                </tr>
                            </table>

                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding: 36px 40px 28px;">
                                        <!-- Ícono + Titulo -->
                                        <table cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="vertical-align: middle; padding-right: 16px;">
                                                    <div style="
                                                        width: 56px; height: 56px;
                                                        background: rgba(200, 120, 58, 0.2);
                                                        border: 2px solid rgba(200, 120, 58, 0.5);
                                                        border-radius: 14px;
                                                        display: inline-block;
                                                        text-align: center;
                                                        line-height: 52px;
                                                        font-size: 28px;
                                                    ">🥖</div>
                                                </td>
                                                <td style="vertical-align: middle;">
                                                    <p style="margin: 0 0 2px; font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #c8783a; font-weight: bold;">Notificación del App</p>
                                                    <h1 style="margin: 0; font-family: 'Georgia', serif; font-size: 26px; color: #f5ede3; font-weight: normal; letter-spacing: -0.5px;">
                                                        Nueva Orden Especial
                                                    </h1>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>

                                    <!-- Badge de ID -->
                                    <td style="padding: 36px 40px 28px; text-align: right; vertical-align: top;">
                                        <div style="
                                            display: inline-block;
                                            background: rgba(200, 120, 58, 0.15);
                                            border: 1px solid rgba(200, 120, 58, 0.4);
                                            border-radius: 10px;
                                            padding: 8px 16px;
                                        ">
                                            <p style="margin: 0; font-family: Arial, sans-serif; font-size: 10px; color: #c8783a; letter-spacing: 2px; text-transform: uppercase;">Orden #</p>
                                            <p style="margin: 0; font-family: 'Georgia', serif; font-size: 28px; color: #f5ede3; line-height: 1;">${ordenEncabezado.idOrdenEspecial}</p>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Sub-header: estado -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding: 0 40px 32px;">
                                        <span style="
                                            display: inline-block;
                                            background: #c8783a;
                                            color: #fff;
                                            font-family: Arial, sans-serif;
                                            font-size: 11px;
                                            font-weight: bold;
                                            letter-spacing: 2px;
                                            text-transform: uppercase;
                                            padding: 5px 14px;
                                            border-radius: 20px;
                                        ">● Activa</span>
                                        <span style="
                                            font-family: Arial, sans-serif;
                                            font-size: 12px;
                                            color: rgba(245, 237, 227, 0.5);
                                            margin-left: 12px;
                                        ">Ingresada por <strong style="color: rgba(245,237,227,0.8);">${ordenEncabezado.nombreUsuario}</strong></span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- ═══ CUERPO PRINCIPAL ═══ -->
                    <tr>
                        <td style="background: #ffffff; padding: 0;">

                            <!-- ── Sección: Datos del Cliente ── -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding: 32px 40px 0;">
                                        <p style="
                                            margin: 0 0 16px;
                                            font-family: Arial, sans-serif;
                                            font-size: 10px;
                                            letter-spacing: 3px;
                                            text-transform: uppercase;
                                            color: #c8783a;
                                            font-weight: bold;
                                            border-bottom: 2px solid #f0e8dc;
                                            padding-bottom: 8px;
                                        ">👤 Datos del Cliente</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 0 40px 28px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <!-- Cliente -->
                                                <td style="width: 50%; vertical-align: top; padding-right: 12px;">
                                                    <div style="
                                                        background: #faf6f1;
                                                        border-left: 3px solid #c8783a;
                                                        border-radius: 0 8px 8px 0;
                                                        padding: 14px 16px;
                                                    ">
                                                        <p style="margin: 0 0 4px; font-size: 10px; color: #a07850; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, sans-serif;">Cliente</p>
                                                        <p style="margin: 0; font-family: 'Georgia', serif; font-size: 15px; color: #2c1810; font-weight: bold;">${ordenEncabezado.nombreCliente}</p>
                                                    </div>
                                                </td>
                                                <!-- Teléfono -->
                                                <td style="width: 50%; vertical-align: top; padding-left: 12px;">
                                                    <div style="
                                                        background: #faf6f1;
                                                        border-left: 3px solid #e8a96a;
                                                        border-radius: 0 8px 8px 0;
                                                        padding: 14px 16px;
                                                    ">
                                                        <p style="margin: 0 0 4px; font-size: 10px; color: #a07850; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, sans-serif;">Teléfono</p>
                                                        <p style="margin: 0; font-family: 'Georgia', serif; font-size: 15px; color: #2c1810;">${ordenEncabezado.telefonoCliente}</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- ── Sección: Fechas y Sucursal ── -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding: 0 40px 0;">
                                        <p style="
                                            margin: 0 0 16px;
                                            font-family: Arial, sans-serif;
                                            font-size: 10px;
                                            letter-spacing: 3px;
                                            text-transform: uppercase;
                                            color: #c8783a;
                                            font-weight: bold;
                                            border-bottom: 2px solid #f0e8dc;
                                            padding-bottom: 8px;
                                        ">📦 Logística de Entrega</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 0 40px 28px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <!-- Sucursal -->
                                                <td style="width: 33.33%; vertical-align: top; padding-right: 8px;">
                                                    <div style="
                                                        background: #2c1810;
                                                        border-radius: 10px;
                                                        padding: 16px;
                                                        text-align: center;
                                                    ">
                                                        <p style="margin: 0 0 6px; font-size: 20px;">🏪</p>
                                                        <p style="margin: 0 0 4px; font-size: 9px; color: #c8783a; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, sans-serif;">Sucursal Entrega</p>
                                                        <p style="margin: 0; font-family: 'Georgia', serif; font-size: 13px; color: #f5ede3; line-height: 1.3;">${ordenEncabezado.nombreSucursal}</p>
                                                    </div>
                                                </td>
                                                <!-- Fecha Entrega -->
                                                <td style="width: 33.33%; vertical-align: top; padding: 0 4px;">
                                                    <div style="
                                                        background: #2c1810;
                                                        border-radius: 10px;
                                                        padding: 16px;
                                                        text-align: center;
                                                    ">
                                                        <p style="margin: 0 0 6px; font-size: 20px;">📅</p>
                                                        <p style="margin: 0 0 4px; font-size: 9px; color: #c8783a; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, sans-serif;">Fecha Entrega</p>
                                                        <p style="margin: 0; font-family: 'Georgia', serif; font-size: 13px; color: #f5ede3; line-height: 1.3;">${formatearFecha(ordenEncabezado.fechaEntrega)}</p>
                                                    </div>
                                                </td>
                                                <!-- Fecha Producción -->
                                                <td style="width: 33.33%; vertical-align: top; padding-left: 8px;">
                                                    <div style="
                                                        background: #2c1810;
                                                        border-radius: 10px;
                                                        padding: 16px;
                                                        text-align: center;
                                                    ">
                                                        <p style="margin: 0 0 6px; font-size: 20px;">⚙️</p>
                                                        <p style="margin: 0 0 4px; font-size: 9px; color: #c8783a; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, sans-serif;">A Producir</p>
                                                        <p style="margin: 0; font-family: 'Georgia', serif; font-size: 13px; color: #f5ede3; line-height: 1.3;">${formatearFecha(ordenEncabezado.fechaAProducir)}</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- ── Sección: Detalle de Productos ── -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding: 4px 40px 0;">
                                        <p style="
                                            margin: 0 0 16px;
                                            font-family: Arial, sans-serif;
                                            font-size: 10px;
                                            letter-spacing: 3px;
                                            text-transform: uppercase;
                                            color: #c8783a;
                                            font-weight: bold;
                                            border-bottom: 2px solid #f0e8dc;
                                            padding-bottom: 8px;
                                        ">🥐 Productos Solicitados</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 0 40px 28px;">
                                        <!-- Tabla de productos -->
                                        <table width="100%" cellpadding="0" cellspacing="0" style="border-radius: 10px; overflow: hidden; border: 1px solid #f0e8dc;">
                                            <!-- Encabezado tabla -->
                                            <tr style="background: #f7f0e8;">
                                                <td style="padding: 10px 16px; font-family: Arial, sans-serif; font-size: 10px; font-weight: bold; color: #a07850; text-transform: uppercase; letter-spacing: 1px;">Producto</td>
                                                <td style="padding: 10px 16px; font-family: Arial, sans-serif; font-size: 10px; font-weight: bold; color: #a07850; text-transform: uppercase; letter-spacing: 1px; text-align: center;">ID</td>
                                                <td style="padding: 10px 16px; font-family: Arial, sans-serif; font-size: 10px; font-weight: bold; color: #a07850; text-transform: uppercase; letter-spacing: 1px; text-align: right;">Cantidad</td>
                                                <td style="padding: 10px 16px; font-family: Arial, sans-serif; font-size: 10px; font-weight: bold; color: #a07850; text-transform: uppercase; letter-spacing: 1px; text-align: center;">Registrado</td>
                                            </tr>
                                            ${filasProductos}
                                        </table>

                                        <!-- Total -->
                                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 12px;">
                                            <tr>
                                                <td style="text-align: right;">
                                                    <span style="
                                                        display: inline-block;
                                                        background: linear-gradient(135deg, #c8783a, #e8a96a);
                                                        color: #fff;
                                                        font-family: Arial, sans-serif;
                                                        font-size: 13px;
                                                        font-weight: bold;
                                                        padding: 8px 20px;
                                                        border-radius: 20px;
                                                    ">
                                                        Total: ${totalUnidades.toLocaleString("es-GT")} unidades en ${ordenDetalle.length} producto${ordenDetalle.length !== 1 ? "s" : ""}
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- ── Sección: Info sistema ── -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding: 0 40px 32px;">
                                        <div style="
                                            background: #faf6f1;
                                            border-radius: 10px;
                                            padding: 16px 20px;
                                            display: flex;
                                        ">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="vertical-align: middle; padding-right: 12px; width: 32px;">
                                                        <div style="
                                                            width: 32px; height: 32px;
                                                            background: #e8a96a;
                                                            border-radius: 8px;
                                                            text-align: center;
                                                            line-height: 32px;
                                                            font-size: 16px;
                                                        ">ℹ️</div>
                                                    </td>
                                                    <td style="vertical-align: middle;">
                                                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; color: #6b4e3d; line-height: 1.5;">
                                                            Orden ingresada por <strong>${ordenEncabezado.nombreUsuario}</strong> · 
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- ═══ FOOTER ═══ -->
                    <tr>
                        <td style="
                            background: #2c1810;
                            border-radius: 0 0 16px 16px;
                            padding: 24px 40px;
                        ">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="vertical-align: middle;">
                                        <p style="margin: 0; font-family: 'Georgia', serif; font-size: 16px; color: #f5ede3; font-weight: normal;">🥖 Panaderia San Gabriel</p>
                                        <p style="margin: 4px 0 0; font-family: Arial, sans-serif; font-size: 11px; color: rgba(245,237,227,0.4); letter-spacing: 1px;">Notificación automática — No responder</p>
                                    </td>
                                    <td style="text-align: right; vertical-align: middle;">
                                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 11px; color: rgba(245,237,227,0.4);">Orden #${ordenEncabezado.idOrdenEspecial}</p>
                                        <p style="margin: 4px 0 0; font-family: Arial, sans-serif; font-size: 11px; color: rgba(245,237,227,0.4);">Sucursal: ${ordenEncabezado.nombreSucursal}</p>
                                    </td>
                                </tr>
                            </table>
                            <!-- Franja decorativa inferior -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                                <tr>
                                    <td style="height: 3px; background: linear-gradient(90deg, transparent, #c8783a, #e8a96a, #c8783a, transparent);"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>
    `;
};

export default generarPlantillaNotificacionOrdenEspecial;