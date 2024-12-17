"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { usePort } from "@/components/context/PortContext";
import { successAlert } from "@/lib/utils/alerts/successAlert";
import { printTicketCompra } from "@/lib/functions/print";
import getUserInformationAction from "@/data/actions/user/getUserInformationAction";
import { fetchGET } from "@/data/services/fetchGET";

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
    }>
  >([]);
  const [processed, setProcessed] = useState(false);
  const [proveedor, setProveedor] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState<string>("");
  const [materiales, setMateriales] = useState<any>([]);
  const [proveedores, setProveedores] = useState<any>([]);
  const [materialSeleccionado, setMaterialSeleccionado] = useState<any>(null);

  async function loadProveedores() {
    const data = await fetchGET({
      url: "/api/proveedores/all",
      error: "Error al obtener los proveedores",
    });
    setProveedores(data);
  }

  async function loadMateriales() {
    const data = await fetchGET({
      url: "/api/materiales/all",
      error: "Error al obtener los materiales",
    });
    setMateriales(data);
  }

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserInformationAction();
      console.log(userData);
      setNombreCompleto(userData.nombre + " " + userData.apellido);
    };
    loadProveedores();
    loadMateriales();
    fetchUser();
  }, []);

  const handleProcessCompra = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nuevaCompra = {
      id: Date.now(),
      material: formData.get("material") as string,
      peso: Number(output),
      precioPorKg: 5000, // Esto podría ajustarse dinámicamente
      precioTotal: formData.get("precioTotal") as unknown as number,
    };
    setProveedor(formData.get("proveedor") as string);
    setCompras([...compras, nuevaCompra]);
    setProcessed(true);
    successAlert(
      "Compra procesada",
      "La compra se ha procesado correctamente",
      "success"
    );
    setOutput("");
  };

  const handlePrintTicket = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    printTicketCompra(
      formattedDate,
      formattedTime,
      compras,
      proveedor,
      nombreCompleto
    );
    setCompras([]);
    setProcessed(false);
    setOutput("");
  };

  const handleRemoveCompra = (id: any) => {
    setCompras(compras.filter((compra) => compra.id !== id));
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
          htmlFor="proveedor"
        >
          Proveedor
        </label>
        <Select
          id="proveedor"
          name="proveedor"
          placeholder="Seleccione un proveedor"
          label=""
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
          onChange={(e) => setMaterialSeleccionado(e.target.value)}
        >
          {materiales.map((material: any) => (
            <SelectItem key={material.nombre} value={material.nombre}>
              {material.nombre}
            </SelectItem>
          ))}
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
          value={
            materiales.find(
              (material: any) => material.nombre === materialSeleccionado
            )?.precioPorKg || 0
          }
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
          name="precioTotal"
          type="number"
          label=""
          placeholder="Precio total"
          value={(Number(output) * materiales.find(
            (material: any) => material.nombre === materialSeleccionado
          )?.precioPorKg || 0).toString()}
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
        disabled={!processed}
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
