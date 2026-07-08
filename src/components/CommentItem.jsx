import { Avatar } from "./Avatar";
import { getFakeCommentDate, formatRelativeDate } from "../utils/commentDate";

export const CommentItem = ({ comentario }) => {
  const fakeDate = getFakeCommentDate(comentario.id);

  return (
    <li className="comment-item d-flex gap-3">
      <Avatar name={comentario.name} />
      <div className="flex-grow-1 min-width-0">
        <div className="d-flex flex-wrap justify-content-between align-items-baseline gap-2">
          <h6 className="mb-0">{comentario.name}</h6>
          <small
            className="text-muted flex-shrink-0"
            title={fakeDate.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          >
            {formatRelativeDate(fakeDate)}
          </small>
        </div>
        <small className="text-muted d-block mb-1">{comentario.email}</small>
        <p className="mb-0">{comentario.body}</p>
      </div>
    </li>
  );
};
