import { useState } from "react";

const Pagination = ({
  onPageChange,
  totalPages,
}: {
  onPageChange: (p: (n: number) => number) => void;
  totalPages: number;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const setPage: (p: number) => number = (p: number) => Math.max(p - 1, 1);
  const setNextPage: (p: number) => number = (p: number) =>
    Math.min(p + 1, totalPages);
  return (
    <div
      className="pagination"
      style={{
        marginTop: "1.5rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <button
        onClick={() => {
          onPageChange(setPage);
          return setCurrentPage(setPage);
        }}
        disabled={currentPage === 1}
      >
        ⬅️ Anterior
      </button>
      <span>
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={() => {
          onPageChange(setNextPage);
          return setCurrentPage(setNextPage);
        }}
        disabled={currentPage === totalPages}
      >
        Siguiente ➡️
      </button>
    </div>
  );
};

export default Pagination;
