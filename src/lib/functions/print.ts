import { fetchGET } from "@/data/services/fetchGET";
import { fetchPOST } from "@/data/services/fetchPOST";
declare const qz: any;

// Función para quitar acentos de un texto
function removeAccents(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Función para centrar un texto en un ancho determinado (quita acentos)
function centerText(text: string, width: number = 44): string {
  const noAccents = removeAccents(text);
  if (noAccents.length >= width) return noAccents;
  const leftPadding = Math.floor((width - noAccents.length) / 2);
  return " ".repeat(leftPadding) + noAccents;
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
 * Arma el encabezado del ticket usando la información de la empresa y
 * agrega el número de tiquete debajo de la fecha y hora.
 * @param fecha Fecha en formato legible.
 * @param hora Hora en formato legible.
 * @returns Objeto con el encabezado del ticket y el número de tiquete actual.
 */
async function getTicketHeader(
  fecha: string,
  hora: string
): Promise<{ header: string; ticketNumber: number }> {
  const companyInfo = await getCompanyInfo();
  const ticketNumber = companyInfo.numeroDeTiquete;
  const header = [
    centerText(companyInfo.nombre),
    centerText(`NIT: ${companyInfo.NIT}`),
    centerText(`TELEFONO: ${companyInfo.telefono}`),
    centerText(companyInfo.direccion),
    centerText(`${companyInfo.ciudad} - ${companyInfo.pais}`),
    centerText(`${fecha}  ${hora}`),
    centerText(`No. Tiquete: ${ticketNumber}`),
  ].join("\n");
  return { header, ticketNumber };
}

/**
 * Actualiza el número de tiquete en la base de datos, sumándole 1 al valor actual.
 * @param currentNumber Número de tiquete actual.
 */
async function updateTicketNumber(currentNumber: number) {
  const newTicketNumber = currentNumber + 1;
  await fetchPOST({
    url: "http://localhost:3000/api/infoEmpresa/updateNumeroTiquete",
    body: { numeroDeTiquete: newTicketNumber },
    error: "Error al actualizar el número del tiquete",
  });
}

/**
 * Imprime un ticket de compra usando QZ Tray con el nuevo formato de detalle.
 * Se imprime la descripción del material en la primera línea y en la segunda se muestran:
 * Item (índice del producto), Peso (kg), Rechazo (kg) y Valor.
 */
export async function printTicketCompra(
  fecha: string,
  hora: string,
  compras: any[],
  proveedor: string,
  encargado: string
) {
  try {
    const { header, ticketNumber } = await getTicketHeader(fecha, hora);
    await qz.websocket.connect();

    let total = 0;
    // Construir el detalle con el nuevo formato, eliminando acentos
    let detalleCompras = removeAccents("DETALLE DE COMPRAS\n\n");
    detalleCompras += removeAccents("         Descripción material\n");
    detalleCompras += removeAccents(
      "Item     Peso (kg)    Rechazo (kg)   Valor\n"
    );
    detalleCompras += removeAccents(
      "-------------------------------------------------------\n"
    );

    compras.forEach((compra, index) => {
      const itemIndex = (index + 1).toString().padEnd(8, " ");
      // Primera línea: descripción del material (sin acentos)
      const materialDesc = removeAccents("         " + compra.material);
      // Segunda línea: ítem, peso, rechazo y valor
      const pesoCol = compra.peso.toString().padStart(10, " ");
      const rechazoCol = compra.rechazo.toString().padStart(12, " ");
      const precio = Number(compra.precioTotal);
      total += precio;
      const precioCol =
        "$" +
        precio
          .toFixed(0)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          .padStart(10, " ");

      detalleCompras += materialDesc + "\n";
      detalleCompras += itemIndex + pesoCol + rechazoCol + precioCol + "\n";
    });

    const footer = [
      removeAccents("-------------------------------------------------------"),
      removeAccents(`PROVEEDOR: ${proveedor}`),
      removeAccents(`ENCARGADO: ${encargado}`),
      removeAccents(
        `TOTAL: $${total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
      ),
      removeAccents("-------------------------------------------------------"),
    ].join("\n");

    const ticket = `${header}\n\n${detalleCompras}\n${footer}`;
    // Enviar comando para reiniciar y seleccionar la tabla de caracteres adecuada (ejemplo: \x1B\x74\x10)
    const initCmd = "\x1B\x40" + "\x1B\x74\x10";
    const config = qz.configs.create("POS-58");
    const data = [
      initCmd,
      ticket + "\n\x1B\x64\x05\x1D\x56\x01", // Avanza líneas y corte
    ];

    await qz.print(config, data);
    console.log("Ticket de compra impreso correctamente");
    await qz.websocket.disconnect();
    await updateTicketNumber(ticketNumber);
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
    const { header, ticketNumber } = await getTicketHeader(fecha, hora);
    await qz.websocket.connect();

    let detalleVentas = removeAccents("Servicio         Peso(kg)\n");
    detalleVentas += removeAccents("------------------------------\n");

    ventas.forEach((venta) => {
      const { material, peso } = venta;
      const materialCol = removeAccents(material).padEnd(18, " ");
      const pesoCol = peso.toString().padStart(10, " ");
      detalleVentas += `${materialCol}${pesoCol}\n`;
    });

    const footer = [
      removeAccents("----------------------------------------"),
      removeAccents(`ENCARGADO: ${encargado}`),
      removeAccents("----------------------------------------"),
    ].join("\n");

    const ticket = `${header}\n\n${removeAccents(
      "DETALLE DE SERVICIO\n\n"
    )}${detalleVentas}\n${footer}`;
    const config = qz.configs.create("POS-58");
    const data = ["\x1B\x40", ticket + "\n\x1B\x64\x05\x1D\x56\x01"];

    await qz.print(config, data);
    console.log("Ticket de servicio impreso correctamente");
    await qz.websocket.disconnect();
    await updateTicketNumber(ticketNumber);
  } catch (error) {
    console.error("Error al imprimir ticket de servicio:", error);
  }
}

/**
 * Imprime un ticket de venta usando QZ Tray con el mismo formato que el de compra.
 * Se imprime la descripción del material en la primera línea y en la segunda se muestran:
 * Item (índice del producto), Peso (kg), Rechazo (kg) y Precio Unitario.
 */
export async function printTicketVenta(
  fecha: string,
  hora: string,
  ventas: any[],
  cliente: string,
  encargado: string
) {
  try {
    const { header, ticketNumber } = await getTicketHeader(fecha, hora);
    await qz.websocket.connect();

    let total = 0;
    let detalleVentas = removeAccents("DETALLE DE VENTA\n\n");
    detalleVentas += removeAccents("         Descripción material\n");
    detalleVentas += removeAccents(
      "Item     Peso (kg)    Rechazo (kg)   Precio Unitario\n"
    );
    detalleVentas += removeAccents(
      "-------------------------------------------------------\n"
    );

    ventas.forEach((venta, index) => {
      const itemIndex = (index + 1).toString().padEnd(8, " ");
      const materialDesc = removeAccents("         " + venta.material);
      const pesoCol = venta.peso.toString().padStart(10, " ");
      const rechazoCol = venta.rechazo.toString().padStart(12, " ");
      const precio = Number(venta.precioTotal);
      total += precio;
      const precioCol =
        "$" +
        precio
          .toFixed(0)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          .padStart(10, " ");

      detalleVentas += materialDesc + "\n";
      detalleVentas += itemIndex + pesoCol + rechazoCol + precioCol + "\n";
    });

    const footer = [
      removeAccents("-------------------------------------------------------"),
      removeAccents(`CLIENTE: ${cliente}`),
      removeAccents(`ENCARGADO: ${encargado}`),
      removeAccents(
        `TOTAL: $${total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
      ),
      removeAccents("-------------------------------------------------------"),
    ].join("\n");

    const ticket = `${header}\n\n${detalleVentas}\n${footer}`;
    // Comando de inicio para reiniciar la impresora y establecer la tabla de caracteres adecuada
    const initCmd = "\x1B\x40" + "\x1B\x74\x10";
    const config = qz.configs.create("POS-58");
    const data = [initCmd, ticket + "\n\x1B\x64\x05\x1D\x56\x01"];

    await qz.print(config, data);
    console.log("Ticket de venta impreso correctamente");
    await qz.websocket.disconnect();
    await updateTicketNumber(ticketNumber);
  } catch (error) {
    console.error("Error al imprimir ticket de venta:", error);
  }
}
