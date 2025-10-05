import { useState, useEffect } from 'react';

export const usePageSize = (totalItems: number) => {
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const calculatePageSize = () => {
      // Ancho de la card + gap (300px + 1.5rem)
      const cardWidth = 300 + 24;
      // Alto de la card + gap (300px + 1.5rem)
      const cardHeight = 300 + 24;

      // Obtenemos el ancho y alto disponible de la ventana
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight - 100; // Restamos 100px para el header y otros elementos

      // Calculamos cuántas cards caben en cada fila
      const cardsPerRow = Math.floor((Math.min(viewportWidth, 1200) - 48) / cardWidth); // Usamos max-width de 1200px

      // Calculamos cuántas filas completas podemos mostrar
      const maxRows = Math.floor(viewportHeight / cardHeight);

      // Calculamos el número óptimo de filas basado en el total de items
      const totalRows = Math.ceil(totalItems / cardsPerRow);
      const optimalRows = Math.min(maxRows, totalRows);

      // Calculamos el tamaño de página óptimo
      const optimalPageSize = optimalRows * cardsPerRow;

      // Aseguramos un mínimo de 4 cards por página y un máximo basado en los items totales
      setPageSize(Math.min(Math.max(optimalPageSize, 4), totalItems));
    };

    // Calculamos el tamaño inicial
    calculatePageSize();

    // Recalculamos cuando cambia el tamaño de la ventana
    window.addEventListener('resize', calculatePageSize);

    // Limpiamos el event listener
    return () => window.removeEventListener('resize', calculatePageSize);
  }, [totalItems, window.innerWidth, window.innerHeight]);

  return pageSize;
};
