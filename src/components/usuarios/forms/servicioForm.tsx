"use client";
import { Button } from "@/components/ui/button";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { usePort } from "@/components/context/PortContext";
import { successAlert } from "@/lib/utils/alerts/successAlert";

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
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        // Procesar la compra
        successAlert(
          "Pesaje procesado",
          "El pesaje se ha procesado correctamente",
          "success"
        );
        disconnectSerial();
        setOutput("");
      }}
    >
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
          htmlFor="material"
        >
          Material
        </label>
        <Select placeholder="Seleccione un material" label="">
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
          >
            Pesar
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:cursor-not-allowed disabled:opacity-70"
        disabled={!isConnected || !output}
      >
        Procesar pesaje
      </Button>
    </form>
  );
}

export default ServicioForm;
