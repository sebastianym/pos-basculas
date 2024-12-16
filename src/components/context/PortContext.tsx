"use client";
import { successAlert } from "@/lib/utils/alerts/successAlert";
import { createContext, useState, useContext } from "react";

export const PortContext = createContext<{
  port: SerialPort | null;
  setPort: (port: SerialPort) => void;
  output: string;
  setOutput: (output: string) => void;
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
  connectSerial: () => void;
  readData: (port: SerialPort) => void;
  disconnectSerial: () => void;
}>({
  port: null,
  setPort: () => {},
  output: "",
  setOutput: () => {},
  isConnected: false,
  setIsConnected: () => {},
  connectSerial: () => {},
  readData: () => {},
  disconnectSerial: () => {},
});

export const usePort = () => {
  const context = useContext(PortContext);
  if (!context) {
    throw new Error("usePort must be used within a PortProvider");
  }
  return context;
};

export const PortProvider = ({ children }: { children: React.ReactNode }) => {
  const [port, setPort] = useState<SerialPort | null>(null);
  const [output, setOutput] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const connectSerial = async () => {
    try {
      // Solicitar al usuario que seleccione un dispositivo serie
      const selectedPort = await navigator.serial.requestPort();
      await selectedPort.open({
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: "none",
      });

      setPort(selectedPort);
      setIsConnected(true);
    } catch (error) {
      console.error("Error al conectar:", error);
    }
  };

  const readData = async (selectedPort: SerialPort) => {
    try {
      const reader = selectedPort.readable.getReader();
      const decoder = new TextDecoder();
      let buffer = ""; // Almacena temporalmente los datos recibidos

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          // Si el lector se cierra, salimos del bucle
          break;
        }
        if (value) {
          // Decodificar los datos recibidos y agregarlos al buffer
          buffer += decoder.decode(value);

          // Procesar solo la última línea válida
          if (buffer.includes("\n")) {
            const lines = buffer.split("\n");
            const lastLine = lines.pop()?.trim(); // Extraer la última línea completa
            buffer = lines.join("\n"); // Mantener el resto no procesado

            if (lastLine) {
              // Usar una expresión regular para extraer solo el número
              const match = lastLine.match(/wn(\d+\.\d+)kg/);
              if (match && match[1]) {
                setOutput(match[1]); // Guardar el valor más reciente
                break; // Salir del bucle después de una lectura válida
              }
            }
          }
        }
      }

      // Liberar el lector después de la lectura
      reader.releaseLock();
    } catch (error) {
      successAlert(
        "Error al leer datos",
        "Se perdió la conexión con el puerto serie",
        "error"
      );
      disconnectSerial();
    }
  };

  const disconnectSerial = async () => {
    if (port) {
      await port.close();
      setPort(null);
      setIsConnected(false);
    }
  };

  return (
    <PortContext.Provider
      value={{
        port,
        setPort,
        output,
        setOutput,
        isConnected,
        setIsConnected,
        connectSerial,
        readData,
        disconnectSerial,
      }}
    >
      {children}
    </PortContext.Provider>
  );
};
