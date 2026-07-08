import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

export const NotFound = () => (
  <div className="auth-page d-flex align-items-center justify-content-center text-center">
    <div>
      <Icon icon="mdi:compass-off-outline" className="text-primary" width="64" height="64" />
      <h1 className="display-5 fw-bold mt-3 mb-2">404</h1>
      <p className="text-muted mb-4">La página que buscas no existe.</p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </div>
  </div>
);
