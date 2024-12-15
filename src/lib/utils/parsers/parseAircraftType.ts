const parseAircraftType = (type: string) => {
    switch (type) {
        case 'AIRCRAFT':
            return 'Aeronave';
        case 'SIMULATOR':
            return 'Simulador';
        default:
            return 'Desconocido';
    }
};

export default parseAircraftType;