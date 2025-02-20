"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { usePort } from "@/components/context/PortContext";
import { successAlert } from "@/lib/utils/alerts/successAlert";
import { printTicketCompra } from "@/lib/functions/print";
import getUserInformationAction from "@/data/actions/user/getUserInformationAction";
import { fetchGET } from "@/data/services/fetchGET";
import { fetchPOST } from "@/data/services/fetchPOST";
import { set } from "zod";

function CompraForm() {
  const {
    disconnectSerial,
    setOutput,
    readData,
    output,
    port,
    isConnected,
    connectSerial,
  } = usePort();

  const [compras, setCompras] = useState<
    Array<{
      id: number;
      material: string;
      peso: number;
      precioPorKg: number;
      precioTotal: number;
      rechazo: number;
    }>
  >([]);
  const [processed, setProcessed] = useState(false);
  const [proveedor, setProveedor] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState<string>("");
  const [userId, setUserId] = useState<number>(0);
  const [materiales, setMateriales] = useState<any>([]);
  const [proveedores, setProveedores] = useState<any>([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [rechazo, setRechazo] = useState(0);
  // Estado para controlar el select de material
  const [materialSeleccionado, setMaterialSeleccionado] = useState<string>("");

  async function loadProveedores() {
    try {
      const data = await fetchGET({
        url: "/api/proveedores/all",
        error: "Error al obtener los proveedores",
      });
      setProveedores(data);
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

  async function guardarCompra(
    valorCompra: number,
    materialId: number,
    usuarioId: number,
    proveedorId: number
  ) {
    try {
      console.log(valorCompra, materialId, usuarioId, proveedorId);
      await fetchPOST({
        url: "/api/compras/create",
        body: { valorCompra, materialId, usuarioId, proveedorId },
        error: "Error al guardar la compra",
      });
    } catch (error) {
      console.error("Error al guardar compra:", error);
    }
  }

  function formatTime(fecha: Date) {
    let hours = fecha.getHours();
    const minutes = fecha.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convierte 0 a 12 para la hora en formato 12 horas
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
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
    loadProveedores();
    loadMateriales();
    fetchUser();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isConnected && !isWaiting) {
        setIsWaiting(true);
        try {
          if (port) {
            await readData(port);
          }
        } catch (error) {
          console.error("Error al pesar:", error);
        } finally {
          setIsWaiting(false);
        }
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isConnected, isWaiting, port, readData]);

  const handleProcessCompra = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const proveedorSeleccionado = formData.get("proveedor") as string;
      const materialSeleccionadoForm = formData.get("material") as string;
      const precioTotalValue = formData.get("precioTotal") as string;
      const pesoValue = output; // Valor obtenido de la báscula

      // Validar campos obligatorios
      if (!proveedorSeleccionado || !materialSeleccionadoForm || !pesoValue) {
        successAlert(
          "Campos incompletos",
          "Por favor, complete todos los campos antes de procesar la compra",
          "error"
        );
        return;
      }

      // Validar rechazo
      if (rechazo >= Number(pesoValue)) {
        successAlert(
          "Rechazo inválido",
          "El rechazo no puede ser mayor o igual al peso total",
          "error"
        );
        return;
      }

      console.log(proveedorSeleccionado, materialSeleccionadoForm, pesoValue);

      const nuevaCompra = {
        id: Date.now(),
        material: materialSeleccionadoForm,
        peso: Number(pesoValue),
        precioPorKg:
          materiales.find((m: any) => m.nombre === materialSeleccionadoForm)
            ?.precioPorKg || 0,
        precioTotal: Number(precioTotalValue),
        rechazo,
      };

      setProveedor(proveedorSeleccionado);

      console.log(proveedor, nuevaCompra);
      setCompras((prev) => [...prev, nuevaCompra]);
      setProcessed(true);
      successAlert(
        "Compra procesada",
        "La compra se ha procesado correctamente",
        "success"
      );

      // Reiniciar el formulario a su estado inicial
      e.currentTarget.reset();
      setMaterialSeleccionado("");
      setOutput("");
      setRechazo(0);
    } catch (error) {
      console.error("Error al procesar la compra", error);
      successAlert("Error", "Ocurrió un error al procesar la compra", "error");
    }
  };

  const handlePrintTicket = async () => {
    try {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString();
      const formattedTime = formatTime(currentDate);
      printTicketCompra(
        formattedDate,
        formattedTime,
        compras,
        proveedor,
        nombreCompleto
      );
      // Recorrer las compras para guardar cada una
      for (const compra of compras) {
        const { precioTotal } = compra;
        const precioTotalNumber = Number(precioTotal);
        const materialEncontrado = materiales.find(
          (material: any) => material.nombre === compra.material
        );
        const proveedorEncontrado = proveedores.find(
          (p: any) => p.nombreProveedor === proveedor
        );
        console.log(proveedores, proveedor);
        console.log(materialEncontrado, proveedorEncontrado);
        if (materialEncontrado && proveedorEncontrado) {
          await guardarCompra(
            precioTotalNumber,
            materialEncontrado.id,
            userId,
            proveedorEncontrado.id
          );
        }
      }
      // Limpiar estado
      setCompras([]);
      setProcessed(false);
      setOutput("");
    } catch (error) {
      console.error("Error al imprimir ticket:", error);
      successAlert("Error", "Ocurrió un error al imprimir el ticket", "error");
    }
  };

  const handleRemoveCompra = (id: number) => {
    try {
      setCompras((prev) => prev.filter((compra) => compra.id !== id));
    } catch (error) {
      console.error("Error al eliminar compra:", error);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleProcessCompra}>
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
            onClick={() => {
              disconnectSerial();
              setOutput("");
            }}
            type="button"
          >
            Desconectar
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none" htmlFor="proveedor">
          Proveedor
        </label>
        <Select
          id="proveedor"
          name="proveedor"
          placeholder="Seleccione un proveedor"
        >
          {proveedores.map((proveedor: any) => (
            <SelectItem
              key={proveedor.nombreProveedor}
              value={proveedor.nombreProveedor}
            >
              {proveedor.nombreProveedor}
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
          onChange={(e) => setMaterialSeleccionado(e.target.value)}
          value={materialSeleccionado}
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
          {/* <Button
            color="primary"
            variant="ghost"
            onClick={async () => {
              if (isWaiting) return; // Evita clics múltiples en espera
              setIsWaiting(true); // Bloquea el botón temporalmente
              try {
                setOutput("");
                if (port) {
                  await readData(port);
                }
              } catch (error) {
                console.error("Error al pesar:", error);
              } finally {
                setTimeout(() => setIsWaiting(false), 1000); // Espera 1 segundo antes de reactivar el botón
              }
            }}
            className="disabled:cursor-not-allowed disabled:opacity-70"
            disabled={!isConnected || isWaiting}
            type="button"
          >
            Pesar
          </Button> */}
        </div>
      </div>

      <div className="space-y-2 flex flex-col items-center">
        <label htmlFor="rechazo" className="text-sm font-medium w-full">
          Rechazo (Opcional)
        </label>
        <div className="flex w-full">
          <Input
            id="rechazo"
            type="text"
            placeholder="El rechazo en kg"
            onChange={(e) => setRechazo(Number(e.target.value))}
            className="pr-2"
          />
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
            (Number(output) - rechazo) *
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
        Procesar Compra
      </Button>

      <Button
        type="button"
        onClick={handlePrintTicket}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium disabled:cursor-not-allowed disabled:opacity-70 mt-2"
        disabled={compras.length === 0}
      >
        Imprimir Ticket
      </Button>

      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-medium">Compras Procesadas</h3>
        {compras.length === 0 ? (
          <p>No hay compras procesadas.</p>
        ) : (
          <ul className="space-y-2">
            {compras.map((compra) => (
              <li
                key={compra.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>{`Material: ${compra.material}, Peso: ${compra.peso}kg, Total: $${compra.precioTotal}`}</span>
                <Button
                  color="danger"
                  variant="ghost"
                  onClick={() => handleRemoveCompra(compra.id)}
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

export default CompraForm;
