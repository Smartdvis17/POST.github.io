import { Icon } from "@iconify/react";

export const PostCard = ({ post, onViewComments, onEdit, onDelete }) => (
  <div className="card h-100 d-flex flex-column">
    <div className="card-body d-flex flex-column">
      <h5 className="card-title">{post.title}</h5>
      <p className="card-text flex-grow-1">{post.body}</p>

      <button className="btn btn-primary mt-auto mb-2" onClick={() => onViewComments(post)}>
        <Icon icon="mdi:comment-eye-outline" className="me-2" />
        Ver comentarios
      </button>

      <div className="d-flex gap-2">
        <button
          className="btn btn-outline-secondary btn-sm flex-fill"
          onClick={() => onEdit(post)}
          aria-label="Editar post"
        >
          <Icon icon="mdi:pencil-outline" className="me-1" />
          Editar
        </button>
        <button
          className="btn btn-outline-danger btn-sm flex-fill"
          onClick={() => onDelete(post)}
          aria-label="Eliminar post"
        >
          <Icon icon="mdi:trash-can-outline" className="me-1" />
          Eliminar
        </button>
      </div>
    </div>
  </div>
);
