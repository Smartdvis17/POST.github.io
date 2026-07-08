import { Button, Modal } from "react-bootstrap";

export const PostFormModal = ({
  show,
  isEditing,
  title,
  body,
  saving,
  onTitleChange,
  onBodyChange,
  onSubmit,
  onClose,
}) => (
  <Modal show={show} onHide={onClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>{isEditing ? "Editar post" : "Nuevo post"}</Modal.Title>
    </Modal.Header>
    <form onSubmit={onSubmit}>
      <Modal.Body>
        <div className="mb-3">
          <label className="form-label">Título</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contenido</label>
          <textarea
            className="form-control"
            rows={4}
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            required
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit" disabled={saving}>
          {saving ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Guardando...
            </>
          ) : (
            "Guardar"
          )}
        </Button>
      </Modal.Footer>
    </form>
  </Modal>
);
