"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@nextui-org/react";
import { usePort } from "@/components/context/PortContext";
import { successAlert } from "@/lib/utils/alerts/successAlert";
import { printTicketServicio } from "@/lib/functions/print";
import getUserInformationAction from "@/data/actions/user/getUserInformationAction";

function ServicioForm() {
  const {
    disconnectSerial,
    setOutput,
    readData,
    output,
    port,
    isConnected,
    connectSerial,
  } = usePort();

  interface Pesaje {
    id: number;
    material: string;
    peso: number;
  }

  const [pesajes, setPesajes] = useState<Pesaje[]>([]);
  const [processed, setProcessed] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [nombreCompleto, setNombreCompleto] = useState<string>("");
  // Estado para el material, ahora es un input controlado
  const [materialSeleccionado, setMaterialSeleccionado] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserInformationAction();
        setNombreCompleto(userData.nombre + " " + userData.apellido);
      } catch (error) {
        console.error("Error al obtener usuario:", error);
        successAlert(
          "Error",
          "No se pudo obtener la información del usuario",
          "error"
        );
      }
    };
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
    }, 5000);
    return () => clearInterval(interval);
  }, [isConnected, isWaiting, port, readData]);

  const handleProcessPesaje = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Validar que se haya ingresado un material y que exista un peso
      if (!materialSeleccionado.trim() || !output) {
        successAlert(
          "Campos incompletos",
          "Por favor, ingrese un material y pese el servicio",
          "error"
        );
        return;
      }

      const nuevoPesaje: Pesaje = {
        id: Date.now(),
        material: materialSeleccionado,
        peso: Number(output),
      };

      setPesajes((prev) => [...prev, nuevoPesaje]);
      setProcessed(true);
      successAlert(
        "Pesaje procesado",
        "El pesaje se ha procesado correctamente",
        "success"
      );

      // Reiniciar el formulario a su estado inicial
      e.currentTarget.reset();
      setMaterialSeleccionado("");
      setOutput("");
    } catch (error) {
      console.error("Error al procesar el pesaje", error);
      successAlert("Error", "Ocurrió un error al procesar el pesaje", "error");
    }
  };

  function formatTime(fecha: Date) {
    let hours = fecha.getHours();
    const minutes = fecha.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convierte 0 a 12 para la hora en formato 12 horas
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  }

  const handlePrintTicket = () => {
    try {
      // Validar que haya pesajes procesados
      if (pesajes.length === 0) {
        successAlert(
          "Sin pesajes",
          "No hay pesajes procesados para imprimir el ticket",
          "error"
        );
        return;
      }

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString();
      const formattedTime = formatTime(currentDate);

      printTicketServicio(formattedDate, formattedTime, pesajes, nombreCompleto);

      // Reiniciar estado
      setPesajes([]);
      setProcessed(false);
      setOutput("");
    } catch (error) {
      console.error("Error al imprimir ticket:", error);
      successAlert("Error", "Ocurrió un error al imprimir el ticket", "error");
    }
  };

  const handleRemovePesaje = (id: number) => {
    try {
      setPesajes((prev) => prev.filter((pesaje) => pesaje.id !== id));
    } catch (error) {
      console.error("Error al eliminar pesaje:", error);
      successAlert("Error", "Ocurrió un error al eliminar el pesaje", "error");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleProcessPesaje}>
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
        <label className="text-sm font-medium leading-none" htmlFor="material">
          Material
        </label>
        <Input
          id="material"
          name="material"
          placeholder="Escriba el nombre del material"
          value={materialSeleccionado}
          onChange={(e) => setMaterialSeleccionado(e.target.value)}
        />
      </div>

      <div className="space-y-2 flex flex-col items-center justify-start">
        <label className="text-sm font-medium w-full" htmlFor="peso">
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
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:cursor-not-allowed disabled:opacity-70"
        disabled={!isConnected || !output}
      >
        Procesar pesaje
      </Button>

      <Button
        type="button"
        onClick={handlePrintTicket}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium disabled:cursor-not-allowed disabled:opacity-70 mt-2"
        disabled={pesajes.length === 0}
      >
        Imprimir Ticket
      </Button>

      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-medium">Pesajes Procesados</h3>
        {pesajes.length === 0 ? (
          <p>No hay pesajes procesados.</p>
        ) : (
          <ul className="space-y-2">
            {pesajes.map((pesaje) => (
              <li
                key={pesaje.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>{`Material: ${pesaje.material}, Peso: ${pesaje.peso}kg`}</span>
                <Button
                  color="danger"
                  variant="ghost"
                  onClick={() => handleRemovePesaje(pesaje.id)}
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

export default ServicioForm;
