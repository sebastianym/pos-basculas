export async function printTicketCompra(fecha: string, hora: string, compras: any[]) {
  try {
    let total = 0;
    let detalleCompras = "";

    // Generar detalle de compras y calcular total
    compras.forEach((compra: any) => {
      const { material, peso, valor } = compra;
      total += valor;
      detalleCompras += `Material: ${material}, Peso: ${peso}kg, Valor: $${valor.toFixed(
        2
      )}\n`;
    });

    const listaDeOperaciones = [
      {
        nombre: "EstablecerAlineacion",
        argumentos: [1],
      },
      {
        nombre: "EscribirTexto",
        argumentos: [
          "--------------------------------------------\n" +
            "ASORESCATAR\n" +
            "NIT: 901.064.992-4\n" +
            "TELEFONO: 315 7057466\n" +
            "DIRECCION: CARRERA 64 VIA 40 LOMA #3 BODEGA 40-492\n" +
            "BARRANQUILLA - COLOMBIA\n" +
            `${fecha} ${hora}\n` +
            "--------------------------------------------\n",
        ],
      },
      {
        nombre: "EstablecerAlineacion",
        argumentos: [0],
      },
      {
        nombre: "EscribirTexto",
        argumentos: ["DETALLE DE COMPRAS\n" + detalleCompras + "\n"],
      },
      {
        nombre: "EscribirTexto",
        argumentos: [`TOTAL: $${total.toFixed(2)}\n`],
      },
      {
        nombre: "EstablecerAlineacion",
        argumentos: [0],
      },
      {
        nombre: "Feed",
        argumentos: [5],
      },
      {
        nombre: "CorteParcial",
        argumentos: [],
      },
    ];

    const nombreImpresora = "pos-80250";
    const cargaUtil = {
      serial: "",
      operaciones: listaDeOperaciones,
      nombreImpresora: nombreImpresora,
    };

    const respuestaHttp = await fetch("http://localhost:8000/imprimir", {
      method: "POST",
      body: JSON.stringify(cargaUtil),
    });

    const respuesta = await respuestaHttp.json();
    if (respuesta.ok) {
      console.log("Impreso correctamente");
    } else {
      console.error(respuesta.message);
    }
  } catch (e) {
    console.log(e);
  }
}

export async function printTicketVenta(fecha: any, hora: any, ventas: any[]) {
  try {
    let total = 0;
    let detalleVentas = "";

    // Generar detalle de ventas y calcular total
    ventas.forEach((venta) => {
      const { material, peso, valorUnitario } = venta;
      const subtotal = peso * valorUnitario;
      total += subtotal;
      detalleVentas += `Material: ${material}, Peso: ${peso}kg, Valor Unitario: $${valorUnitario.toFixed(
        2
      )}, Subtotal: $${subtotal.toFixed(2)}\n`;
    });

    const listaDeOperaciones = [
      {
        nombre: "EstablecerAlineacion",
        argumentos: [1],
      },
      {
        nombre: "EscribirTexto",
        argumentos: [
          "--------------------------------------------\n" +
            "ASORESCATAR\n" +
            "NIT: 901.064.992-4\n" +
            "TELEFONO: 315 7057466\n" +
            "DIRECCION: CARRERA 64 VIA 40 LOMA #3 BODEGA 40-492\n" +
            "BARRANQUILLA - COLOMBIA\n" +
            `${fecha} ${hora}\n` +
            "--------------------------------------------\n",
        ],
      },
      {
        nombre: "EstablecerAlineacion",
        argumentos: [0],
      },
      {
        nombre: "EscribirTexto",
        argumentos: ["DETALLE DE VENTAS\n" + detalleVentas + "\n"],
      },
      {
        nombre: "EscribirTexto",
        argumentos: [`TOTAL: $${total.toFixed(2)}\n`],
      },
      {
        nombre: "EstablecerAlineacion",
        argumentos: [0],
      },
      {
        nombre: "Feed",
        argumentos: [5],
      },
      {
        nombre: "CorteParcial",
        argumentos: [],
      },
    ];

    const nombreImpresora = "pos-80250";
    const cargaUtil = {
      serial: "",
      operaciones: listaDeOperaciones,
      nombreImpresora: nombreImpresora,
    };

    const respuestaHttp = await fetch("http://localhost:8000/imprimir", {
      method: "POST",
      body: JSON.stringify(cargaUtil),
    });

    const respuesta = await respuestaHttp.json();
    if (respuesta.ok) {
      console.log("Impreso correctamente");
    } else {
      console.error(respuesta.message);
    }
  } catch (e) {
    console.log(e);
  }
}
