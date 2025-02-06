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
  readData: (port: SerialPort) => Promise<void>;
  disconnectSerial: () => void;
}>({
  port: null,
  setPort: () => {},
  output: "",
  setOutput: () => {},
  isConnected: false,
  setIsConnected: () => {},
  connectSerial: () => {},
  readData: async () => {},
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
      successAlert("Error", "No se pudo conectar al puerto serie", "error");
    }
  };

  const readData = async (selectedPort: SerialPort) => {
    try {
      const reader = selectedPort.readable.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          buffer += decoder.decode(value);
          if (buffer.includes("\n")) {
            const lines = buffer.split("\n");
            const lastLine = lines.pop()?.trim();
            buffer = lines.join("\n");
            if (lastLine) {
              const match = lastLine.match(/wn(\d+\.\d+)kg/);
              if (match && match[1]) {
                setOutput(match[1]);
                break;
              }
            }
          }
        }
      }
      reader.releaseLock();
    } catch (error) {
      console.error("Error al leer datos del puerto:", error);
      successAlert(
        "Error al leer datos",
        "Se perdió la conexión con el puerto serie",
        "error"
      );
      disconnectSerial();
    }
  };

  const disconnectSerial = async () => {
    try {
      if (port) {
        await port.close();
        setPort(null);
        setIsConnected(false);
        successAlert(
          "Desconectado",
          "La báscula se ha desconectado. Por favor, vuelva a conectarla.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error al desconectar el puerto:", error);
      successAlert("Error", "Ocurrió un error al desconectar la báscula", "error");
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
