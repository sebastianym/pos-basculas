"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { usePort } from "@/components/context/PortContext";
import { successAlert } from "@/lib/utils/alerts/successAlert";
import { printTicketVenta } from "@/lib/functions/print";
import getUserInformationAction from "@/data/actions/user/getUserInformationAction";
import { fetchGET } from "@/data/services/fetchGET";
import { fetchPOST } from "@/data/services/fetchPOST";

function VentaForm() {
  const {
    disconnectSerial,
    setOutput,
    readData,
    output,
    port,
    isConnected,
    connectSerial,
  } = usePort();

  interface Venta {
    id: number;
    material: string;
    peso: number;
    precioPorKg: number;
    precioTotal: number;
  }

  const [ventas, setVentas] = useState<Venta[]>([]);
  const [processed, setProcessed] = useState(false);
  const [cliente, setCliente] = useState(""); // Se usará para persistir el cliente durante el ciclo de ventas
  const [nombreCompleto, setNombreCompleto] = useState<string>("");
  const [userId, setUserId] = useState<number>(0);
  const [materiales, setMateriales] = useState<any>([]);
  const [clientes, setClientes] = useState<any>([]);

  // Estados para controlar los selects
  const [materialSeleccionado, setMaterialSeleccionado] = useState<string>("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>("");

  async function loadClientes() {
    try {
      const data = await fetchGET({
        url: "/api/clientes/all",
        error: "Error al obtener los clientes",
      });
      setClientes(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadMateriales() {
    try {
      const data = await fetchGET({
        url: "/api/materiales/all",
        error: "Error al obtener los materiales",
      });
      setMateriales(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function guardarVenta(
    valorVenta: number,
    materialId: number,
    usuarioId: number,
    companiaClienteId: number
  ) {
    try {
      await fetchPOST({
        url: "/api/ventas/create",
        body: { valorVenta, materialId, usuarioId, companiaClienteId },
        error: "Error al guardar la venta",
      });
    } catch (error) {
      console.error("Error al guardar venta:", error);
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserInformationAction();
        setNombreCompleto(userData.nombre + " " + userData.apellido);
        setUserId(Number(userData.id));
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      }
    };
    loadClientes();
    loadMateriales();
    fetchUser();
  }, []);

  const handleProcessVenta = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const clienteSeleccionadoForm = formData.get("cliente") as string;
      const materialSeleccionadoForm = formData.get("material") as string;
      const precioTotalValue = formData.get("precioTotal") as string;
      const pesoValue = output; // Valor obtenido de la báscula

      // Validar campos obligatorios
      if (!clienteSeleccionadoForm || !materialSeleccionadoForm || !pesoValue) {
        successAlert(
          "Campos incompletos",
          "Por favor, complete todos los campos antes de procesar la venta",
          "error"
        );
        return;
      }

      const nuevaVenta: Venta = {
        id: Date.now(),
        material: materialSeleccionadoForm,
        peso: Number(pesoValue),
        precioPorKg:
          materiales.find((m: any) => m.nombre === materialSeleccionadoForm)
            ?.precioPorKg || 0,
        precioTotal: Number(precioTotalValue),
      };

      // Actualizamos el cliente a usar durante el ciclo de ventas
      setCliente(clienteSeleccionadoForm);
      setVentas((prev) => [...prev, nuevaVenta]);
      setProcessed(true);
      successAlert(
        "Venta procesada",
        "La venta se ha procesado correctamente",
        "success"
      );

      // Limpiar manualmente solo los campos que deben reiniciarse: material y peso.
      // No se limpia el campo de cliente para que persista.
      setMaterialSeleccionado("");
      setOutput("");
      // Nota: No se llama a e.currentTarget.reset() para evitar limpiar el select de cliente.
    } catch (error) {
      console.error("Error al procesar la venta", error);
      successAlert("Error", "Ocurrió un error al procesar la venta", "error");
    }
  };

  function formatTime(fecha: Date) {
    let hours = fecha.getHours();
    const minutes = fecha.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  }

  const handlePrintTicket = async () => {
    try {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString();
      const formattedTime = formatTime(currentDate);

      printTicketVenta(
        formattedDate,
        formattedTime,
        ventas,
        cliente,
        nombreCompleto
      );

      // Guardar cada venta
      for (const venta of ventas) {
        const { precioTotal } = venta;
        const precioTotalNumber = Number(precioTotal);
        const materialEncontrado = materiales.find(
          (material: any) => material.nombre === venta.material
        );
        const clienteEncontrado = clientes.find(
          (c: any) => c.nombre === cliente
        );
        if (materialEncontrado && clienteEncontrado) {
          await guardarVenta(
            precioTotalNumber,
            materialEncontrado.id,
            userId,
            Number(clienteEncontrado.id)
          );
        }
      }
      // Limpiar estados luego de imprimir el ticket:
      setVentas([]);
      setProcessed(false);
      setOutput("");
      // Aquí se limpia el cliente para la siguiente tanda de ventas.
      setCliente("");
      setClienteSeleccionado("");
    } catch (error) {
      console.error("Error al imprimir ticket:", error);
      successAlert("Error", "Ocurrió un error al imprimir el ticket", "error");
    }
  };

  const handleRemoveVenta = (id: number) => {
    try {
      setVentas((prev) => prev.filter((venta) => venta.id !== id));
    } catch (error) {
      console.error("Error al eliminar venta:", error);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleProcessVenta}>
      <div className="flex justify-start mb-4">
        {!isConnected ? (
          <Button
            color="secondary"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={connectSerial}
            type="button"
          >
            Conectar a puerto serie
          </Button>
        ) : (
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={disconnectSerial}
            type="button"
          >
            Desconectar
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none" htmlFor="cliente">
          Cliente
        </label>
        <Select
          id="cliente"
          name="cliente"
          placeholder="Seleccione un cliente"
          value={clienteSeleccionado}
          onChange={(e) => setClienteSeleccionado(e.target.value)}
        >
          {clientes.map((cliente: any) => (
            <SelectItem key={cliente.nombre} value={cliente.nombre}>
              {cliente.nombre}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="material">
          Material
        </label>
        <Select
          id="material"
          name="material"
          placeholder="Seleccione un material"
          value={materialSeleccionado}
          onChange={(e) => setMaterialSeleccionado(e.target.value)}
        >
          {materiales.map((material: any) => (
            <SelectItem key={material.nombre} value={material.nombre}>
              {material.nombre}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="space-y-2 flex flex-col items-center">
        <label htmlFor="peso" className="text-sm font-medium w-full">
          Peso (kg)
        </label>
        <div className="flex w-full">
          <Input
            id="peso"
            type="text"
            placeholder="El peso en kg"
            value={output}
            readOnly
            className="pr-2"
          />
          <Button
            color="primary"
            variant="ghost"
            onClick={async () => {
              try {
                setOutput("");
                if (port) {
                  await readData(port);
                }
              } catch (error) {
                console.error("Error al pesar:", error);
              }
            }}
            className="disabled:cursor-not-allowed disabled:opacity-70"
            disabled={!isConnected}
            type="button"
          >
            Pesar
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="precioPorKg" className="text-sm font-medium">
          Precio por Kg
        </label>
        <Input
          id="precioPorKg"
          type="number"
          placeholder="Ingrese el precio por kg"
          value={
            materiales.find(
              (material: any) => material.nombre === materialSeleccionado
            )?.precioPorKg || 0
          }
          readOnly
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="precioTotal" className="text-sm font-medium">
          Precio Total
        </label>
        <Input
          id="precioTotal"
          name="precioTotal"
          type="number"
          placeholder="Precio total"
          value={(
            Number(output) *
              (materiales.find(
                (material: any) => material.nombre === materialSeleccionado
              )?.precioPorKg || 0) || 0
          ).toString()}
          readOnly
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:cursor-not-allowed disabled:opacity-70"
        disabled={!isConnected || !output}
      >
        Procesar Venta
      </Button>

      <Button
        type="button"
        onClick={handlePrintTicket}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium disabled:cursor-not-allowed disabled:opacity-70 mt-2"
        disabled={ventas.length === 0}
      >
        Imprimir Ticket
      </Button>

      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-medium">Ventas Procesadas</h3>
        {ventas.length === 0 ? (
          <p>No hay ventas procesadas.</p>
        ) : (
          <ul className="space-y-2">
            {ventas.map((venta) => (
              <li
                key={venta.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>{`Material: ${venta.material}, Peso: ${venta.peso}kg, Total: $${venta.precioTotal}`}</span>
                <Button
                  color="danger"
                  variant="ghost"
                  onClick={() => handleRemoveVenta(venta.id)}
                >
                  Eliminar
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </form>
  );
}

export default VentaForm;
