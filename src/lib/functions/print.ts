import { fetchGET } from "@/data/services/fetchGET";
declare const qz: any;

// Función para centrar un texto en un ancho determinado
function centerText(text: string, width: number = 44): string {
  if (text.length >= width) return text;
  const leftPadding = Math.floor((width - text.length) / 2);
  return " ".repeat(leftPadding) + text;
}

/**
 * Obtiene la información de la empresa desde el endpoint.
 */
async function getCompanyInfo() {
  return await fetchGET({
    url: "/api/infoEmpresa/get",
    error: "Error al obtener la información de la empresa",
  });
}

/**
 * Arma el encabezado del ticket usando la información de la empresa.
 * @param fecha Fecha en formato legible.
 * @param hora Hora en formato legible.
 */
async function getTicketHeader(fecha: string, hora: string): Promise<string> {
  const companyInfo = await getCompanyInfo();
  return [
    centerText(companyInfo.nombre),
    centerText(`NIT: ${companyInfo.NIT}`),
    centerText(`TELEFONO: ${companyInfo.telefono}`),
    centerText(companyInfo.direccion),
    centerText(`${companyInfo.ciudad} - ${companyInfo.pais}`),
    `${fecha}  ${hora}`,
  ].join("\n");
}

/**
 * Imprime un ticket de compra usando QZ Tray.
 * @param fecha Fecha en formato legible.
 * @param hora Hora en formato legible.
 * @param compras Array de compras, cada una con { material, peso, precioTotal, rechazo }.
 * @param proveedor Nombre del proveedor.
 * @param encargado Nombre del encargado.
 */
export async function printTicketCompra(
  fecha: string,
  hora: string,
  compras: any[],
  proveedor: string,
  encargado: string
) {
  try {
    // Obtenemos el encabezado con la info actualizada de la empresa
    const header = await getTicketHeader(fecha, hora);
    await qz.websocket.connect();

    let total = 0;
    let detalleCompras = "Producto         Peso(kg)    Rechazo(kg)    Valor\n";
    detalleCompras += "----------------------------------------\n";

    compras.forEach((compra) => {
      const { material, peso, precioTotal, rechazo } = compra;
      const precio = Number(precioTotal);
      total += precio;
      // Formateamos cada columna con ancho fijo
      const materialCol = material.padEnd(16, " ");
      const pesoCol = peso.toString().padStart(6, " ") + "  ";
      const rechazoCol = rechazo.toString().padStart(8, " ") + "  ";
      const precioCol =
        "$" +
        precio
          .toFixed(0)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          .padStart(10, " ");
      detalleCompras += `${materialCol}${pesoCol}${rechazoCol}${precioCol}\n`;
    });

    const footer = [
      "----------------------------------------",
      `PROVEEDOR: ${proveedor}`,
      `ENCARGADO: ${encargado}`,
      `TOTAL: $${total
        .toFixed(0)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
      "----------------------------------------",
    ].join("\n");

    const ticket =
      `${header}\n----------------------------------------\n` +
      "DETALLE DE COMPRAS\n" +
      detalleCompras +
      footer;

    const config = qz.configs.create("POS-58");
    const data = [
      "\x1B\x40", // Reset de la impresora
      ticket + "\n\x1B\x64\x05\x1D\x56\x01", // Avanza líneas y corte
    ];

    await qz.print(config, data);
    console.log("Ticket de compra impreso correctamente");
    await qz.websocket.disconnect();
  } catch (error) {
    console.error("Error al imprimir ticket de compra:", error);
  }
}

/**
 * Imprime un ticket de servicio usando QZ Tray.
 * @param fecha Fecha en formato legible.
 * @param hora Hora en formato legible.
 * @param ventas Array de ventas/servicios, cada una con { material, peso }.
 * @param encargado Nombre del encargado.
 */
export async function printTicketServicio(
  fecha: string,
  hora: string,
  ventas: any[],
  encargado: string
) {
  try {
    const header = await getTicketHeader(fecha, hora);
    await qz.websocket.connect();

    let detalleVentas = "Servicio         Peso(kg)\n";
    detalleVentas += "------------------------------\n";

    ventas.forEach((venta) => {
      const { material, peso } = venta;
      const materialCol = material.padEnd(18, " ");
      const pesoCol = peso.toString().padStart(10, " ");
      detalleVentas += `${materialCol}${pesoCol}\n`;
    });

    const footer = [
      "----------------------------------------",
      `ENCARGADO: ${encargado}`,
      "----------------------------------------",
    ].join("\n");

    const ticket =
      `${header}\n----------------------------------------\n` +
      "DETALLE DE SERVICIO\n" +
      detalleVentas +
      footer;

    const config = qz.configs.create("POS-58");
    const data = [
      "\x1B\x40",
      ticket + "\n\x1B\x64\x05\x1D\x56\x01",
    ];

    await qz.print(config, data);
    console.log("Ticket de servicio impreso correctamente");
    await qz.websocket.disconnect();
  } catch (error) {
    console.error("Error al imprimir ticket de servicio:", error);
  }
}

/**
 * Imprime un ticket de venta usando QZ Tray.
 * @param fecha Fecha en formato legible.
 * @param hora Hora en formato legible.
 * @param ventas Array de ventas, cada una con { material, peso, precioTotal, rechazo }.
 * @param cliente Nombre del cliente.
 * @param encargado Nombre del encargado.
 */
export async function printTicketVenta(
  fecha: string,
  hora: string,
  ventas: any[],
  cliente: string,
  encargado: string
) {
  try {
    const header = await getTicketHeader(fecha, hora);
    await qz.websocket.connect();

    let total = 0;
    let detalleVentas =
      "Producto         Peso(kg)    Rechazo(kg)    Precio Unitario\n";
    detalleVentas += "----------------------------------------------\n";

    ventas.forEach((venta) => {
      const { material, peso, precioTotal, rechazo } = venta;
      const precio = Number(precioTotal);
      total += precio;
      const materialCol = material.padEnd(16, " ");
      const pesoCol = peso.toString().padStart(6, " ") + "  ";
      const rechazoCol = rechazo.toString().padStart(8, " ") + "  ";
      const precioCol =
        "$" +
        precio
          .toFixed(0)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          .padStart(10, " ");
      detalleVentas += `${materialCol}${pesoCol}${rechazoCol}${precioCol}\n`;
    });

    const footer = [
      "----------------------------------------------",
      `CLIENTE: ${cliente}`,
      `ENCARGADO: ${encargado}`,
      `TOTAL: $${total
        .toFixed(0)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
      "----------------------------------------------",
    ].join("\n");

    const ticket =
      `${header}\n----------------------------------------------\n` +
      "DETALLE DE VENTA\n" +
      detalleVentas +
      footer;

    const config = qz.configs.create("POS-58");
    const data = [
      "\x1B\x40",
      ticket + "\n\x1B\x64\x05\x1D\x56\x01",
    ];

    await qz.print(config, data);
    console.log("Ticket de venta impreso correctamente");
    await qz.websocket.disconnect();
  } catch (error) {
    console.error("Error al imprimir ticket de venta:", error);
  }
}
