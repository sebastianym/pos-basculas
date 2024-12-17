import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ServicioForm from "@/components/usuarios/forms/servicioForm";

function ServicioBascula() {
  return (
    <main className="p-6 w-full">
      <div className="mx-auto max-w-[2000px]">
        <div className="flex justify-center items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1a47b8]">
            Servicio de Báscula
          </h1>
        </div>
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle>Formulario de Servicio</CardTitle>
          </CardHeader>
          <CardContent>
            <ServicioForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default ServicioBascula;
