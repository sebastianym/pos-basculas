"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { usePort } from "@/components/context/PortContext";
import { successAlert } from "@/lib/utils/alerts/successAlert";
import { printTicketCompra } from "@/lib/functions/print";

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

  const handleProcessVenta = (e: any) => {
    e.preventDefault();
    const nuevaVenta = {
      id: Date.now(),
      material: e.target.material.value,
      peso: Number(output),
      precioPorKg: 5000, // Esto podría ajustarse dinámicamente
      precioTotal: Number(output) * 5000,
    };
    setVentas([...ventas, nuevaVenta]);
    setProcessed(true);
    successAlert(
      "Venta procesada",
      "La venta se ha procesado correctamente",
      "success"
    );
    setOutput("");
  };

  const handlePrintTicket = () => {
    printTicketCompra("15/12/2024", "8:41", ventas);
    setVentas([]);
    setProcessed(false);
    setOutput("");
  };

  const handleRemoveVenta = (id: any) => {
    setVentas(ventas.filter((venta) => venta.id !== id));
  };

  return (
    <form className="space-y-4" onSubmit={handleProcessVenta}>
      <div className="flex justify-end mb-4">
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
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="cliente"
        >
          Cliente
        </label>
        <Select
          id="cliente"
          name="cliente"
          placeholder="Seleccione un cliente"
          label=""
        >
          <SelectItem key="1" value="cliente1">
            cliente 1
          </SelectItem>
        </Select>
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="material"
        >
          Material
        </label>
        <Select
          id="material"
          name="material"
          placeholder="Seleccione un material"
          label=""
        >
          <SelectItem key="1" value="Papel">
            Papel
          </SelectItem>
          <SelectItem key="2" value="Vidrio">
            Vidrio
          </SelectItem>
          <SelectItem key="3" value="Cartón">
            Cartón
          </SelectItem>
          <SelectItem key="4" value="Plástico">
            Plástico
          </SelectItem>
          <SelectItem key="5" value="PET">
            PET
          </SelectItem>
          <SelectItem key="6" value="Aluminio">
            Aluminio
          </SelectItem>
          <SelectItem key="7" value="Acero">
            Acero
          </SelectItem>
          <SelectItem key="8" value="Chatarra">
            Chatarra
          </SelectItem>
          <SelectItem key="9" value="Cobre">
            Cobre
          </SelectItem>
        </Select>
      </div>

      <div className="space-y-2 flex flex-col items-center justify-start">
        <label
          className="text-start space-y-2 w-full text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="peso"
        >
          Peso (kg)
        </label>
        <div className="flex w-full">
          <Input
            id="peso"
            type="text"
            label=""
            placeholder="El peso en kg"
            value={output}
            readOnly
            className="pr-2"
          />
          <Button
            color="primary"
            variant="ghost"
            onClick={() => port && readData(port)}
            className="disabled:cursor-not-allowed disabled:opacity-70"
            disabled={!isConnected}
            type="button"
          >
            Pesar
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="precioPorKg"
        >
          Precio por Kg
        </label>
        <Input
          id="precioPorKg"
          type="number"
          label=""
          placeholder="Ingrese el precio por kg"
          value={"5000"}
          readOnly
        />
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="precioTotal"
        >
          Precio Total
        </label>
        <Input
          id="precioTotal"
          type="number"
          label=""
          placeholder="Precio total"
          value={(Number(output) * 5000).toString()}
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
        disabled={!processed}
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
