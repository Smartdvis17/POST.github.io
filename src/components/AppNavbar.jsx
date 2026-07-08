import { Icon } from "@iconify/react";

export const AppNavbar = ({
  title,
  paginationEnabled,
  onTogglePagination,
  onLogout,
}) => (
  <header className="app-navbar container-fluid d-flex flex-wrap justify-content-between align-items-center gap-3 px-4 py-3">
    <div className="d-flex align-items-center gap-2">
      <Icon icon="mdi:post-outline" className="fs-3 text-primary" />
      <h1 className="h4 mb-0 fw-bold">{title}</h1>
    </div>
    <div className="d-flex align-items-center gap-3">
      <Icon
        icon={paginationEnabled ? "bi:toggle2-on" : "bi:toggle2-off"}
        className="fs-1 text-primary cursor-pointer"
        onClick={onTogglePagination}
        title={paginationEnabled ? "Desactivar paginación" : "Activar paginación"}
        role="button"
        aria-label={paginationEnabled ? "Desactivar paginación" : "Activar paginación"}
      />
      <button onClick={onLogout} className="btn btn-danger">
        <Icon icon="mdi:logout" className="me-1" />
        Salir
      </button>
    </div>
  </header>
);
