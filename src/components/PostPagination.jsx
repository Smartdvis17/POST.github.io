export const PostPagination = ({
  visible,
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}) => {
  if (!visible || totalPages === 0) return null;

  return (
    <div className="d-flex justify-content-center align-items-center gap-3 py-4">
      <button
        className="btn btn-outline-primary"
        onClick={onPrevious}
        disabled={currentPage === 1}
      >
        Anterior
      </button>
      <span>
        Página {currentPage} de {totalPages}
      </span>
      <button
        className="btn btn-outline-primary"
        onClick={onNext}
        disabled={currentPage === totalPages}
      >
        Siguiente
      </button>
    </div>
  );
};
