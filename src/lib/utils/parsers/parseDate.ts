export function parseDate(utcDate: string): string {
    const date = new Date(utcDate);

    if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
    }
    
    const yearOptions: Intl.DateTimeFormatOptions = { year: 'numeric' };
    const year = date.toLocaleDateString('es-ES', yearOptions);
    const dayNameOptions: Intl.DateTimeFormatOptions = { weekday: 'long' };
    const dayOptions: Intl.DateTimeFormatOptions = { day: 'numeric' };
    const monthOptions: Intl.DateTimeFormatOptions = { month: 'long' };

    const dayName = date.toLocaleDateString('es-ES', dayNameOptions);
    const day = date.toLocaleDateString('es-ES', dayOptions);
    const month = date.toLocaleDateString('es-ES', monthOptions);

    const formattedDate = `${capitalizeFirstLetter(dayName)} ${day} de ${capitalizeFirstLetter(month)}, ${year}`;
    
    return formattedDate;
}

function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}