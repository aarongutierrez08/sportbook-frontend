export const formatDate = (dateString: string) => {
    if (!dateString) return '';

    // Si la fecha está en formato YYYY-MM-DD
    const date = new Date(dateString);

    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) return dateString;

    // Formatear como DD/MM/YYYY
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}