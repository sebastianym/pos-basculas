import Swal from "sweetalert2";

export const successAlert = (title: string, message: string) => {
  Swal.fire({
    title: title,
    text: message,
    icon: "success",
    confirmButtonColor: "hsl(270, 60%, 52%)",
    background: "hsl(250, 24%, 9%)",
    color: "#d2d3e0bf",
    allowEnterKey: true,
    confirmButtonText: "De acuerdo",
    padding: "35px",
  });
};

export const errorAlert = (title: string, message: string) => {
  Swal.fire({
    title: title,
    text: message,
    icon: "error",
    confirmButtonColor: "hsl(270, 60%, 52%)",
    background: "hsl(250, 24%, 9%)",
    color: "#d2d3e0bf",
    allowEnterKey: true,
    confirmButtonText: "De acuerdo",
    padding: "35px",
  });
};

export const warningAlert = (title: string, message: string) => {
  Swal.fire({
    title: title,
    text: message,
    icon: "warning",
    confirmButtonColor: "hsl(270, 60%, 52%)",
    background: "hsl(250, 24%, 9%)",
    color: "#d2d3e0bf",
    allowEnterKey: true,
    confirmButtonText: "De acuerdo",
    padding: "35px",
  });
};

export const showExplanation = (message: string) => {
  Swal.fire({
    text: message,
    confirmButtonColor: "hsl(270, 60%, 52%)",
    background: "hsl(250, 24%, 9%)",
    color: "#d2d3e0bf",
    confirmButtonText: "Cerrar",
    padding: "35px",
  });
};

export const confirmAlert = async (title: string, message: string) => {
  return new Promise<boolean>((resolve) => {
    Swal.fire({
      title: title,
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: `Cancelar`,
      focusDeny: true,
      confirmButtonColor: "hsl(270, 60%, 52%)",
      background: "hsl(250, 24%, 9%)",
      color: "#d2d3e0bf",
      padding: "35px",
      cancelButtonColor: "#e53e3e",
    }).then((result) => {
      if (result.isConfirmed) {
        resolve(true);
        return true;
      } else {
        resolve(false);
        return false;
      }
    });
  });
};

export const productForm = async (method: string, product?: string) => {
  const { value: name } = await Swal.fire({
    title: "Ingresa el nombre del producto",
    input: "text",
    inputValue: product ? product : "",
    inputPlaceholder: product ? "" : "Nombre del producto",
    showCancelButton: true,
    confirmButtonText: method === "update" ? "Actualizar" : "Crear producto",
    cancelButtonText: "Cancelar",
    background: "hsl(250, 24%, 9%)",
    color: "#d2d3e0bf",
    confirmButtonColor: "hsl(270, 60%, 52%)",
    cancelButtonColor: "#e53e3e",
    padding: "35px",
    inputValidator: (value) => {
      if (!value) {
        return "Por favor, ingresa el nombre del producto.";
      }
    },
  });
  if(name) {
    return name;
  }
};
