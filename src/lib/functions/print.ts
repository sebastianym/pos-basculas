export async function printTicketCompra(
  fecha: string,
  hora: string,
  peso: string,
//   material: string,
//   valor: string,
//   usuario: string
) {
  try {
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
            "--------------------------------------------\n",
        ],
      },
      {
        nombre: "EstablecerAlineacion",
        argumentos: [0],
      },
      {
        nombre: "EscribirTexto",
        argumentos: ["FECHA: " + fecha + "\n"],
      },
      {
        nombre: "EscribirTexto",
        argumentos: ["HORA: " + hora + "\n"],
      },
      {
        nombre: "EscribirTexto",
        argumentos: ["PESO: " + peso + " kg" + "\n"],
      },
      {
        nombre: "EstablecerAlineacion",
        argumentos: [0],
      },
      {
        nombre: "EscribirTexto",
        argumentos: ["FECHA: 15/12/2024\n"],
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
