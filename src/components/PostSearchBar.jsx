import { Icon } from "@iconify/react";

export const PostSearchBar = ({ searchTerm, onSearchChange, onCreate }) => (
  <section className="container pt-4">
    <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center">
      <div className="input-group" style={{ maxWidth: "360px" }}>
        <span className="input-group-text">
          <Icon icon="mdi:magnify" />
        </span>
        <input
          type="search"
          className="form-control"
          placeholder="Buscar por título o contenido..."
          aria-label="Buscar posts"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={onCreate}>
        <Icon icon="mdi:plus" className="me-1" />
        Nuevo post
      </button>
    </div>
  </section>
);
