import Swal from "sweetalert2";

export const successAlert = async (title: string, text: string, icon: "success" | "error" | "warning" | "info") => {
    Swal.fire({
        confirmButtonColor: "hsl(270, 60%, 52%)",
        title,
        text,
        icon,
        background: 'hsl(250, 24%, 9%)',
        color: '#d2d3e0bf',
        allowEnterKey: true,
        confirmButtonText: "De acuerdo",
        padding: '35px',
    });
};