import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { CenteredSpinner } from "../components/CenteredSpinner";
import { AppNavbar } from "../components/AppNavbar";
import { PostSearchBar } from "../components/PostSearchBar";
import { PostPagination } from "../components/PostPagination";
import { PostList } from "../components/PostList";
import { CommentsModal } from "../components/CommentsModal";
import { PostFormModal } from "../components/PostFormModal";

const API_URL = "https://jsonplaceholder.typicode.com/posts";
const POSTS_PER_PAGE = 8;
const POSTS_CACHE_KEY = "posts_cache";

export const Post = () => {
  const navigation = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationEnabled, setPaginationEnabled] = useState(true);

  // Modal de comentarios
  const [comentarios, setComentarios] = useState([]);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  // Modal de creación/edición
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [saving, setSaving] = useState(false);

  // Evita sobrescribir la copia local con [] antes de que termine de cargar.
  const hasLoadedRef = useRef(false);

  const filteredPosts = posts.filter((post) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      post.title.toLowerCase().includes(term) ||
      post.body.toLowerCase().includes(term)
    );
  });

  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const postsToDisplay = paginationEnabled ? currentPosts : filteredPosts;

  useEffect(() => {
    // Si ya tenemos una copia local (con nuestros cambios) la usamos en vez
    // de volver a pedir los posts originales, para que sobrevivan al recargar.
    const cached = localStorage.getItem(POSTS_CACHE_KEY);
    if (cached) {
      setPosts(JSON.parse(cached));
      hasLoadedRef.current = true;
    } else {
      getPosts();
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Cada vez que cambian los posts (crear, editar, eliminar) actualizamos la copia local.
  useEffect(() => {
    if (hasLoadedRef.current) {
      localStorage.setItem(POSTS_CACHE_KEY, JSON.stringify(posts));
    }
  }, [posts]);

  const getPosts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_URL);
      setPosts(data);
      hasLoadedRef.current = true;
    } catch (error) {
      console.log("error en getPosts", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getComentarios = async (post) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/${post.id}/comments`);
      setComentarios(data);
      setCurrentPost(post);
      setShowCommentsModal(true);
    } catch (error) {
      console.log("error en getComentarios", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseCommentsModal = () => {
    setLoading(true);
    setTimeout(() => {
      setShowCommentsModal(false);
      setComentarios([]);
      setCurrentPost(null);
      setLoading(false);
    }, 500);
  };

  const openCreateModal = () => {
    setEditingPost(null);
    setFormTitle("");
    setFormBody("");
    setShowFormModal(true);
  };

  const openEditModal = (post) => {
    setEditingPost(post);
    setFormTitle(post.title);
    setFormBody(post.body);
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setEditingPost(null);
  };

  const handleSaveForm = async (event) => {
    event.preventDefault();
    if (!formTitle.trim() || !formBody.trim()) return;

    setSaving(true);
    try {
      if (editingPost) {
        if (editingPost.isLocal) {
          // Post creado en esta sesión: la API de prueba no lo conoce (le
          // inventamos el id), así que un PUT real fallaría con error 500.
          // Actualizamos solo el estado local.
          setPosts((prev) =>
            prev.map((post) =>
              post.id === editingPost.id
                ? { ...post, title: formTitle, body: formBody }
                : post
            )
          );
        } else {
          const { data } = await axios.put(`${API_URL}/${editingPost.id}`, {
            ...editingPost,
            title: formTitle,
            body: formBody,
          });
          setPosts((prev) =>
            prev.map((post) => (post.id === editingPost.id ? { ...post, ...data } : post))
          );
        }
      } else {
        const { data } = await axios.post(API_URL, {
          title: formTitle,
          body: formBody,
          userId: 1,
        });
        // La API de prueba siempre devuelve id 101; generamos uno propio para
        // evitar choques y lo marcamos como local (ver nota de isLocal arriba).
        setPosts((prev) => [{ ...data, id: Date.now(), isLocal: true }, ...prev]);
      }

      setShowFormModal(false);
      setEditingPost(null);
      Swal.fire({
        icon: "success",
        title: editingPost ? "Post actualizado" : "Post creado",
        showConfirmButton: false,
        timer: 1200,
      });
    } catch (error) {
      console.log("error en handleSaveForm", error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se pudo guardar el post.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (post) => {
    Swal.fire({
      title: "¿Eliminar este post?",
      text: post.title,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        if (!post.isLocal) {
          await axios.delete(`${API_URL}/${post.id}`);
        }
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
        Swal.fire({
          icon: "success",
          title: "Post eliminado",
          showConfirmButton: false,
          timer: 1200,
        });
      } catch (error) {
        console.log("error en handleDelete", error.message);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se pudo eliminar el post.",
        });
      }
    });
  };

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro que quieres salir?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Salir!",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        localStorage.removeItem("login");

        Swal.fire({
          title: "¡Sesión cerrada!",
          text: "Has salido correctamente.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });

        setTimeout(() => {
          setLoading(false);
          navigation("/");
        }, 1500);
      }
    });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setLoading(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setLoading(false);
      }, 500);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setLoading(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setLoading(false);
      }, 500);
    }
  };

  const togglePagination = () => {
    setLoading(true);
    setTimeout(() => {
      setPaginationEnabled((prev) => !prev);
      setCurrentPage(1);
      setLoading(false);
    }, 500);
  };

  return (
    <div>
      {loading && <CenteredSpinner />}

      <AppNavbar
        title="Posts"
        paginationEnabled={paginationEnabled}
        onTogglePagination={togglePagination}
        onLogout={handleLogout}
      />

      <PostSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreate={openCreateModal}
      />

      <PostPagination
        visible={paginationEnabled}
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={goToPreviousPage}
        onNext={goToNextPage}
      />

      <section className="container py-4">
        <PostList
          posts={postsToDisplay}
          onViewComments={getComentarios}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      </section>

      <CommentsModal
        show={showCommentsModal}
        post={currentPost}
        comments={comentarios}
        onClose={handleCloseCommentsModal}
      />

      <PostFormModal
        show={showFormModal}
        isEditing={Boolean(editingPost)}
        title={formTitle}
        body={formBody}
        saving={saving}
        onTitleChange={setFormTitle}
        onBodyChange={setFormBody}
        onSubmit={handleSaveForm}
        onClose={closeFormModal}
      />
    </div>
  );
};
