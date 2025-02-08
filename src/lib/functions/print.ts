// Asegúrate de que QZ Tray esté disponible (por ejemplo, en el objeto global "qz")
declare const qz: any;
/**
 * Imprime un ticket de compra usando QZ Tray.
 * @param {string} fecha - Fecha en formato legible.
 * @param {string} hora - Hora en formato legible.
 * @param {Array} compras - Array de compras, cada una con { material, peso, precioTotal }.
 * @param {string} proveedor - Nombre del proveedor.
 * @param {string} encargado - Nombre del encargado.
 */

function centerText(text: string, width: number = 44): string {
  if (text.length >= width) return text;
  const leftPadding = Math.floor((width - text.length) / 2);
  return " ".repeat(leftPadding) + text;
}

/**
 * Imprime un ticket de servicio usando QZ Tray.
 * @param {string} fecha - Fecha en formato legible.
 * @param {string} hora - Hora en formato legible.
 * @param {Array} ventas - Array de ventas/servicios, cada una con { material, peso }.
 * @param {string} encargado - Nombre del encargado.
 */

export async function printTicketCompra(
  fecha: string,
  hora: string,
  compras: any[],
  proveedor: string,
  encargado: string
) {
  try {
    await qz.websocket.connect();

    let total = 0;
    // Cabecera de detalle de compras con columnas fijas
    let detalleCompras = "Producto         Peso(kg)    Peso Rechazo(kg)    Valor\n";

    detalleCompras += "----------------------------------------\n";

    compras.forEach((compra) => {
      const { material, peso, precioTotal, rechazo } = compra;
      const precio = Number(precioTotal);
      total += precio;
      // Se formatea cada línea con ancho fijo: 16, 10 y 10 caracteres respectivamente.
      const materialCol = material.padEnd(16, " ");
      const pesoCol = peso.toString().padStart(6, " ") + "  ";
      const rechazoCol = rechazo.toString().padStart(13, " ") + "  ";
      const precioCol = "$" + precio.toFixed(2).padStart(8, " ");
      detalleCompras += `${materialCol}${pesoCol}${rechazoCol}${precioCol}\n`;
    });

    const header = [
      centerText("ASORESCATAR"),
      centerText("NIT: 901.064.992-4"),
      centerText("TELEFONO: 315 7057466"),
      centerText("CARRERA 64 VIA 40 LOMA #3 BODEGA 40-492"),
      centerText("BARRANQUILLA - COLOMBIA"),
      `${fecha}  ${hora}`,
    ].join("\n");

    const footer = [
      "----------------------------------------",
      `PROVEEDOR: ${proveedor}`,
      `ENCARGADO: ${encargado}`,
      `TOTAL: $${total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
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
      ticket + "\n\x1B\x64\x05\x1D\x56\x01", // Avanza líneas y realiza el corte
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
 * @param {string} fecha - Fecha en formato legible.
 * @param {string} hora - Hora en formato legible.
 * @param {Array} ventas - Array de ventas/servicios, cada una con { material, peso }.
 * @param {string} encargado - Nombre del encargado.
 */

export async function printTicketServicio(
  fecha: string,
  hora: string,
  ventas: any[],
  encargado: string
) {
  try {
    await qz.websocket.connect();

    // Cabecera para el detalle de servicio
    let detalleVentas = "Servicio         Peso(kg)\n";
    detalleVentas += "------------------------------\n";

    ventas.forEach((venta) => {
      const { material, peso } = venta;
      // Columnas: 18 caracteres para el servicio y 10 para el peso
      const materialCol = material.padEnd(18, " ");
      const pesoCol = peso.toString().padStart(10, " ");
      detalleVentas += `${materialCol}${pesoCol}\n`;
    });

    const header = [
      centerText("ASORESCATAR"),
      centerText("NIT: 901.064.992-4"),
      centerText("TELEFONO: 315 7057466"),
      centerText("CARRERA 64 VIA 40 LOMA #3 BODEGA 40-492"),
      centerText("BARRANQUILLA - COLOMBIA"),
      `${fecha}  ${hora}`,
    ].join("\n");

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
    const data = ["\x1B\x40", ticket + "\n\x1B\x64\x05\x1D\x56\x01"];

    await qz.print(config, data);
    console.log("Ticket de servicio impreso correctamente");
    await qz.websocket.disconnect();
  } catch (error) {
    console.error("Error al imprimir ticket de servicio:", error);
  }
}

/**
 * Imprime un ticket de venta usando QZ Tray.
 * @param {string} fecha - Fecha en formato legible.
 * @param {string} hora - Hora en formato legible.
 * @param {Array} ventas - Array de ventas, cada una con { material, peso, precioTotal }.
 * @param {string} cliente - Nombre del cliente.
 * @param {string} encargado - Nombre del encargado.
 */

export async function printTicketVenta(
  fecha: string,
  hora: string,
  ventas: any[],
  cliente: string,
  encargado: string
) {
  try {
    await qz.websocket.connect();

    let total = 0;
    // Cabecera de detalle de ventas con columnas fijas
    let detalleVentas = "Producto         Peso(kg)    Peso Rechazo(kg)    Precio Unitario\n";
    detalleVentas += "----------------------------------------------\n";

    ventas.forEach((venta) => {
      const { material, peso, precioTotal, rechazo } = venta;
      const precio = Number(precioTotal);
      total += precio;
      // Formateo de columnas: 16 para producto, 10 para peso y 12 para precio
      const materialCol = material.padEnd(16, " ");
      const pesoCol = peso.toString().padStart(6, " ") + "  ";
      const rechazoCol = rechazo.toString().padStart(13, " ") + "  ";
      const precioCol = "$" + precio.toFixed(2).padStart(15, " ");
      detalleVentas += `${materialCol}${pesoCol}${rechazoCol}${precioCol}\n`;
    });

    const header = [
      centerText("ASORESCATAR"),
      centerText("NIT: 901.064.992-4"),
      centerText("TELEFONO: 315 7057466"),
      centerText("CARRERA 64 VIA 40 LOMA #3 BODEGA 40-492"),
      centerText("BARRANQUILLA - COLOMBIA"),
      `${fecha}  ${hora}`,
    ].join("\n");

    const footer = [
      "----------------------------------------------",
      `CLIENTE: ${cliente}`,
      `ENCARGADO: ${encargado}`,
      `TOTAL: $${total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
      "----------------------------------------------",
    ].join("\n");

    const ticket =
      `${header}\n----------------------------------------------\n` +
      "DETALLE DE VENTA\n" +
      detalleVentas +
      footer;

    const config = qz.configs.create("POS-58");
    const data = ["\x1B\x40", ticket + "\n\x1B\x64\x05\x1D\x56\x01"];

    await qz.print(config, data);
    console.log("Ticket de venta impreso correctamente");
    await qz.websocket.disconnect();
  } catch (error) {
    console.error("Error al imprimir ticket de venta:", error);
  }
}
