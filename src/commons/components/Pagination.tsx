import React, { useEffect, useMemo, useState } from "react";
import "../../styles/pagination.css";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

type PageInfo = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  startIndex: number;
  endIndex: number;
};

type PaginationProps<T> = {
  items: T[];
  pageSize: number;
  initialPage?: number;
  onPageChange?: (page: number) => void;
  emptyPlaceholder?: React.ReactNode;
  children: (pageItems: T[], info: PageInfo) => React.ReactNode;
};

const Pagination = <T,>({
  items,
  pageSize,
  initialPage = 1,
  onPageChange,
  emptyPlaceholder = null,
  children,
}: PaginationProps<T>) => {
  const safePageSize = Math.max(1, pageSize || 1);
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));

  const [page, setPage] = useState(() =>
    Math.min(Math.max(initialPage, 1), totalPages)
  );

  useEffect(() => {
    setPage(1);
  }, [totalItems, safePageSize]);

  useEffect(() => {
    onPageChange?.(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, onPageChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setPage((p) => Math.max(1, p - 1));
      if (e.key === "ArrowRight") setPage((p) => Math.min(totalPages, p + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [totalPages]);

  const startIndex = (page - 1) * safePageSize;
  const endIndex = Math.min(startIndex + safePageSize, totalItems);

  const pageItems = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex]
  );

  const info: PageInfo = {
    page,
    totalPages,
    totalItems,
    pageSize: safePageSize,
    startIndex,
    endIndex,
  };

  const goTo = (next: number) =>
    setPage(() => Math.min(Math.max(next, 1), totalPages));
  const prev = () => goTo(page - 1);
  const next = () => goTo(page + 1);

  if (totalItems === 0) {
    return <>{emptyPlaceholder}</>;
  }

  return (
    <>
      {children(pageItems, info)}
      <nav className="pagination" role="navigation" aria-label="Paginación">
        <button onClick={prev} disabled={page === 1} aria-label="Página anterior">
          <ChevronLeftIcon fontSize="small" aria-hidden="true" />
          <span>Anterior</span>
        </button>

        <span className="pagination__label" aria-live="polite">
          Página {page} de {totalPages}
        </span>

        <button
          onClick={next}
          disabled={page === totalPages}
          aria-label="Página siguiente"
        >
          <span>Siguiente</span>
          <ChevronRightIcon fontSize="small" aria-hidden="true" />
        </button>
      </nav>
    </>
  );
};

export default Pagination;
