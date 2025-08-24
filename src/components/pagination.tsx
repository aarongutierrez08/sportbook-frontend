import React, {useState} from "react";

const Pagination = ({ onPageChange, totalPages }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const setPage = (p) => Math.max(p - 1, 1)
    return (<div
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
                onPageChange(setPage)
                return setCurrentPage(setPage)
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
                onPageChange((p) => Math.min(p + 1, totalPages))
                return setCurrentPage((p) => Math.min(p + 1, totalPages))
            }}
            disabled={currentPage === totalPages}
        >
            Siguiente ➡️
        </button>
    </div>)
}

export default Pagination;