"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { fetchGET } from "@/data/services/fetchGET";
import { fetchPOST } from "@/data/services/fetchPOST";
import { CircularProgress } from "@nextui-org/react";
import { errorAlert } from "@/lib/alerts/alerts";
import { successAlert } from "@/lib/utils/alerts/successAlert";

const formSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  NIT: z.string().min(9, "El NIT debe tener al menos 9 caracteres"),
  telefono: z.string().min(7, "El teléfono debe tener al menos 7 caracteres"),
  direccion: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  ciudad: z.string().min(2, "La ciudad debe tener al menos 2 caracteres"),
  pais: z.string().min(2, "El país debe tener al menos 2 caracteres"),
  numeroDeTiquete: z.union([
    z.string().regex(/^\d+$/, "El número de tiquete debe ser un número"),
    z.number().int().min(1, "El número de tiquete debe ser mayor a 0"),
  ]),
});

export default function CompanyInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [infoEmpresa, setInfoEmpresa] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {}, // Inicialmente vacío, se actualizará con `reset`
  });

  async function loadInfoEmpresa() {
    const data = await fetchGET({
      url: "/api/infoEmpresa/get",
      error: "Error al obtener la información de la empresa",
    });
    setInfoEmpresa(data);
    setLoading(false);
  }

  useEffect(() => {
    loadInfoEmpresa();
  }, []);

  useEffect(() => {
    if (infoEmpresa) {
      form.reset(infoEmpresa);
    }
  }, [infoEmpresa, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      console.log("Updating company data:", values);
      await fetchPOST({
        url: "/api/infoEmpresa/update",
        body: values,
        error: "Error al actualizar la información de la empresa",
      });
      await loadInfoEmpresa();
      successAlert("Éxito", "Información actualizada correctamente", "success");
    } catch (error) {
      await loadInfoEmpresa();
      errorAlert("Error", "Error al actualizar la información de la empresa");
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-2">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#1D4ED8]">
          Información de la Empresa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Empresa</FormLabel>
                  <FormControl>
                    <Input disabled={!isEditing} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="NIT"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIT</FormLabel>
                  <FormControl>
                    <Input disabled={!isEditing} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input disabled={!isEditing} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input disabled={!isEditing} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ciudad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciudad</FormLabel>
                  <FormControl>
                    <Input disabled={!isEditing} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pais"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>País</FormLabel>
                  <FormControl>
                    <Input disabled={!isEditing} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numeroDeTiquete"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de tiquete</FormLabel>
                  <FormControl>
                    <Input disabled={!isEditing} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              {!isEditing ? (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-[#1D4ED8] hover:bg-[#1D4ED8]/90"
                >
                  Modificar Datos Empresa
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      form.reset(infoEmpresa);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#1D4ED8] hover:bg-[#1D4ED8]/90"
                  >
                    Guardar
                  </Button>
                </>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
