export const parseRole = (role: string) => {
    switch (role) {
        case 'ADMIN':
            return 'Administrador';
        case 'EMPLOYEE':
            return 'Empleado';
        case 'CLIENT':
            return 'Cliente';
        case 'INSTRUCTOR':
            return 'Instructor';
        default:
            return 'Desconocido';
    }
};