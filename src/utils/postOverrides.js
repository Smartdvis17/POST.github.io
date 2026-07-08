// Guarda solo los cambios locales (creados, editados, eliminados) por separado
// de los posts de la API. Así, la base de 100 posts siempre se vuelve a pedir
// a la API en cada carga y nunca puede "perderse" por una copia local dañada;
// como mucho se pierden los cambios propios, que se pueden restablecer.
const DELETED_IDS_KEY = "deleted_post_ids";
const LOCAL_POSTS_KEY = "local_posts";
const EDITED_POSTS_KEY = "edited_posts";

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const getLocalPosts = () => readJSON(LOCAL_POSTS_KEY, []);
export const getDeletedIds = () => readJSON(DELETED_IDS_KEY, []);
export const getEditedPosts = () => readJSON(EDITED_POSTS_KEY, {});

export const addLocalPost = (post) => {
  localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify([post, ...getLocalPosts()]));
};

export const updateLocalPost = (id, changes) => {
  const updated = getLocalPosts().map((post) =>
    post.id === id ? { ...post, ...changes } : post
  );
  localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(updated));
};

export const removeLocalPost = (id) => {
  const updated = getLocalPosts().filter((post) => post.id !== id);
  localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(updated));
};

export const setEditedPost = (id, changes) => {
  const edited = { ...getEditedPosts(), [id]: changes };
  localStorage.setItem(EDITED_POSTS_KEY, JSON.stringify(edited));
};

export const addDeletedId = (id) => {
  localStorage.setItem(DELETED_IDS_KEY, JSON.stringify([...getDeletedIds(), id]));
};

export const clearAllOverrides = () => {
  localStorage.removeItem(DELETED_IDS_KEY);
  localStorage.removeItem(LOCAL_POSTS_KEY);
  localStorage.removeItem(EDITED_POSTS_KEY);
};

// Combina los posts originales de la API con los cambios locales guardados.
export const applyOverrides = (apiPosts) => {
  const deletedIds = getDeletedIds();
  const editedPosts = getEditedPosts();
  const localPosts = getLocalPosts();

  const merged = apiPosts
    .filter((post) => !deletedIds.includes(post.id))
    .map((post) => (editedPosts[post.id] ? { ...post, ...editedPosts[post.id] } : post));

  return [...localPosts, ...merged];
};
