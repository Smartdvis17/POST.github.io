import { Icon } from "@iconify/react";
import { PostCard } from "./PostCard";

export const PostList = ({ posts, isSearching, onViewComments, onEdit, onDelete }) => {
  if (posts.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <Icon icon="mdi:file-search-outline" className="fs-1 mb-2" />
        <p className="mb-0">
          {isSearching
            ? "No se encontraron posts con esa búsqueda."
            : "No hay posts para mostrar."}
        </p>
      </div>
    );
  }

  return (
    <div className="row">
      {posts.map((post) => (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={post.id}>
          <PostCard
            post={post}
            onViewComments={onViewComments}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
};
