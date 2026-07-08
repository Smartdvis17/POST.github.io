import { Button, Modal } from "react-bootstrap";
import { CommentItem } from "./CommentItem";

export const CommentsModal = ({ show, post, comments, onClose }) => (
  <Modal show={show} onHide={onClose} size="lg" centered>
    <Modal.Header closeButton>
      <Modal.Title>Comentarios del Post #{post?.id}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {comments.length === 0 ? (
        <p>No hay comentarios disponibles.</p>
      ) : (
        <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
          {comments.map((comentario) => (
            <CommentItem comentario={comentario} key={comentario.id} />
          ))}
        </ul>
      )}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        Cerrar
      </Button>
    </Modal.Footer>
  </Modal>
);
