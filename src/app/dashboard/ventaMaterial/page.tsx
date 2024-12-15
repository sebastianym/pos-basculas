import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function VentaMaterial() {
  return (
    <main className="p-6 w-full">
      <div className="mx-auto max-w-[2000px]">
        <div className="flex justify-center items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1a47b8]">
            Compra de Material
          </h1>
        </div>
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle>Formulario de Compra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Conectar a puerto serie
              </Button>
            </div>
            <form className="space-y-4">
              <div>
                <Label htmlFor="material">Material</Label>
                <Select>
                  <SelectTrigger id="material">
                    <SelectValue placeholder="Seleccione un material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aluminio">Aluminio</SelectItem>
                    <SelectItem value="cobre">Cobre</SelectItem>
                    <SelectItem value="bronce">Bronce</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="peso">Peso (kg)</Label>
                <div className="flex gap-2">
                  <Input id="peso" placeholder="El peso en kg" />
                  <Button variant="outline">Pesar</Button>
                </div>
              </div>
              <div>
                <Label htmlFor="precio-kg">Precio por Kg</Label>
                <Input id="precio-kg" defaultValue="5000" />
              </div>
              <div>
                <Label htmlFor="precio-total">Precio Total</Label>
                <Input id="precio-total" defaultValue="0" readOnly />
              </div>
              <Button className="w-full bg-[#1a47b8] hover:bg-[#2857c8] text-white">
                Procesar Compra
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default VentaMaterial;
