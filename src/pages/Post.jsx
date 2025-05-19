import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Icon } from "@iconify/react";
import { Button, Modal } from "react-bootstrap";
import Swal from "sweetalert2";


export const Post = () => {
  //Paso 1 Importamos useNavigate
  const navigation = useNavigate();

  //Paso 2 Creamos un estado para guardar todos los post
  const [posts, setPosts] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  //Para la paginacion creamos los estados para mostrar 8 post por pagina
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  // Calcular índices de los posts actuales
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Calcular total de páginas
  const totalPages = Math.ceil(posts.length / postsPerPage);

  //Paso 4 Creamos un UseEffect para ejecutar el getPosts
  useEffect(() => {
    getPosts();
  }, []);

  //Paso 3 Creamos una funcion para obtener los post
  const getPosts = async () => {
    try {
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      );
      console.log(data);
      setPosts(data);
    } catch (error) {
      console.log("error en getPosts", error.message);
    }
  };

  //Paso 3 Creamos una funcion para obtener los Comentarios
  const getComentarios = async (post) => {
    try {
      const { data } = await axios.get(
        `https://jsonplaceholder.typicode.com/posts/${post.id}/comments`
      );
      console.log(data);
      setComentarios(data);
      setCurrentPost(post);
      setShowModal(true);
    } catch (error) {
      console.log("error en getComentarios", error.message);
    }
  };

  //Paso 5 Creamos una funcion para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setComentarios([]);
    setCurrentPost(null);
  };

  //Paso 6 creamos una funcion para manejar el logout
  const handleLogout = () => {
    // Mostramos la alerta de confirmación primero
    Swal.fire({
      title: "¿Estás seguro que quieres salir?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Salir!",
    }).then((result) => {
      // Solo se ejecuta si el usuario confirma
      if (result.isConfirmed) {
        // Aquí se elimina el item de login
        localStorage.removeItem("login");

        // Mostramos una alerta de éxito
        Swal.fire({
          title: "¡Sesión cerrada!",
          text: "Has salido correctamente.",
          icon: "success",
          showConfirmButton: false, // Oculta el botón OK
          timer: 1500, // Duración en milisegundos
          timerProgressBar: true, // (Opcional) Barra de progreso visual
        });

        // Redirigimos al usuario después de un pequeño delay para que vea la alerta
        setTimeout(() => {
          navigation("/"); // Redirige a la página de inicio o login
        }, 1500); // 1.5 segundos de espera para la alerta
      }
    });
  };

  //Creamos las funciones para cambiar de pagina
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      {/* Contenedor para el título y el botón de logout */}
      <section className="container d-flex justify-content-between align-items-center py-4">
        <h1 className="text-center">Posts</h1>
        {/* Botón de logout */}
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </section>

      {/* Contenedor para la paginación */}
      <div className="d-flex justify-content-center align-items-center gap-3 py-4">
        <button
          className="btn btn-outline-primary"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="btn btn-outline-primary"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>

      {/* Contenedor para los posts */}
      <section className="container py-4">
        <div className="row">
          {currentPosts.map((post) => (
            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
              key={post.id}
            >
              <div className="card h-100 d-flex flex-column">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text flex-grow-1">{post.body}</p>
                  <button
                    className="btn btn-primary mt-auto"
                    onClick={() => getComentarios(post)}
                  >
                    <Icon icon="mdi:comment-eye-outline" className="me-2" />
                    Ver comentarios
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal para mostrar comentarios */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Comentarios del Post #{currentPost?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {comentarios.length === 0 ? (
            <p>No hay comentarios disponibles.</p>
          ) : (
            <ul className="list-group">
              {comentarios.map((comentario) => (
                <li className="list-group-item" key={comentario.id}>
                  <h6>
                    {comentario.name}{" "}
                    <small className="text-muted">({comentario.email})</small>
                  </h6>
                  <p>{comentario.body}</p>
                </li>
              ))}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
