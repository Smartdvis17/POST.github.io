import React, { useState, useEffect } from "react"; // Importamos React y hooks (useState, useEffect) para manejar el estado y efectos secundarios.
import { useNavigate } from "react-router-dom"; // Importamos useNavigate de React Router para redirigir al usuario a diferentes páginas.
import axios from "axios"; // Importamos axios para realizar peticiones HTTP.
import { Icon } from "@iconify/react"; // Importamos Icon de iconify para manejar iconos.
import { Button, Modal } from "react-bootstrap"; // Importamos componentes de Bootstrap para mostrar modales y botones.
import Swal from "sweetalert2"; // Importamos Swal para mostrar alertas.
import { CenteredSpinner } from "../components/CenteredSpinner"; // Importamos el componente del spinner centralizado.

export const Post = () => {
  const navigation = useNavigate(); // Inicializamos useNavigate para poder redirigir a otras páginas.

  // Estados para manejar posts, comentarios, el estado del modal y paginación.
  const [posts, setPosts] = useState([]); // Almacenará la lista de posts.
  const [comentarios, setComentarios] = useState([]); // Almacenará los comentarios de un post específico.
  const [showModal, setShowModal] = useState(false); // Estado para manejar la visibilidad del modal.
  const [currentPost, setCurrentPost] = useState(null); // Almacenará el post actual seleccionado.

  // Paginación
  const [currentPage, setCurrentPage] = useState(1); // Página actual.
  const postsPerPage = 8; // Número de posts por página.
  const [paginationEnabled, setPaginationEnabled] = useState(true); // Controla si la paginación está activada.
  const [loading, setLoading] = useState(false); // Estado para controlar la carga del spinner.

  // Calculamos los índices de los posts que se mostrarán según la página actual.
  const indexOfLastPost = currentPage * postsPerPage; // Índice del último post de la página.
  const indexOfFirstPost = indexOfLastPost - postsPerPage; // Índice del primer post de la página.
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost); // Seleccionamos los posts para mostrar en la página actual.
  const totalPages = Math.ceil(posts.length / postsPerPage); // Calculamos el número total de páginas.
  const postsToDisplay = paginationEnabled ? currentPosts : posts; // Dependiendo de la paginación, mostramos los posts actuales o todos.

  // UseEffect para cargar los posts cuando el componente se monte.
  useEffect(() => {
    getPosts(); // Llamamos a la función que obtiene los posts.
  }, []); // Este efecto solo se ejecuta una vez al montar el componente.

  // Función para obtener los posts de la API.
  const getPosts = async () => {
    setLoading(true); // Mostramos el spinner.
    try {
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      ); // Hacemos la petición HTTP.
      setPosts(data); // Almacenamos los posts en el estado.
    } catch (error) {
      console.log("error en getPosts", error.message); // Si hay un error, lo mostramos en consola.
    } finally {
      setLoading(false); // Ocultamos el spinner una vez que la carga se complete.
    }
  };

  // Función para obtener los comentarios de un post específico.
  const getComentarios = async (post) => {
    setLoading(true); // Mostramos el spinner mientras cargamos los comentarios.
    try {
      const { data } = await axios.get(
        `https://jsonplaceholder.typicode.com/posts/${post.id}/comments`
      );
      setComentarios(data); // Almacenamos los comentarios en el estado.
      setCurrentPost(post); // Establecemos el post actual.
      setShowModal(true); // Mostramos el modal con los comentarios.
    } catch (error) {
      console.log("error en getComentarios", error.message); // Si hay un error, lo mostramos en consola.
    } finally {
      setLoading(false); // Ocultamos el spinner.
    }
  };

  // Función para cerrar el modal.
  const handleCloseModal = () => {
    setLoading(true); // Mostramos el spinner al cerrar el modal.
    setTimeout(() => {
      setShowModal(false); // Cerramos el modal.
      setComentarios([]); // Limpiamos los comentarios.
      setCurrentPost(null); // Limpiamos el post actual.
      setLoading(false); // Ocultamos el spinner después de 500 ms.
    }, 500);
  };

  // Función para manejar el logout.
  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro que quieres salir?", // Mostramos una alerta de confirmación antes de hacer logout.
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Salir!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma el logout.
        setLoading(true); // Mostramos el spinner.
        localStorage.removeItem("login"); // Eliminamos el ítem de login de localStorage.

        Swal.fire({
          title: "¡Sesión cerrada!",
          text: "Has salido correctamente.",
          icon: "success",
          showConfirmButton: false, // No mostramos el botón de confirmación.
          timer: 1500, // Mostramos un mensaje de éxito durante 1.5 segundos.
          timerProgressBar: true, // Mostramos una barra de progreso mientras la alerta está activa.
        });

        setTimeout(() => {
          setLoading(false); // Ocultamos el spinner después de 1.5 segundos.
          navigation("/"); // Redirigimos al usuario a la página de inicio o login.
        }, 1500);
      }
    });
  };

  // Función para ir a la siguiente página de posts.
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      // Si no estamos en la última página.
      setLoading(true); // Mostramos el spinner.
      setTimeout(() => {
        setCurrentPage(currentPage + 1); // Cambiamos la página actual.
        setLoading(false); // Ocultamos el spinner.
      }, 500); // Simulamos un pequeño retraso.
    }
  };

  // Función para ir a la página anterior de posts.
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      // Si no estamos en la primera página.
      setLoading(true); // Mostramos el spinner.
      setTimeout(() => {
        setCurrentPage(currentPage - 1); // Cambiamos la página actual.
        setLoading(false); // Ocultamos el spinner.
      }, 500); // Simulamos un pequeño retraso.
    }
  };

  // Función para activar o desactivar la paginación.
  const togglePagination = () => {
    setLoading(true); // Mostramos el spinner mientras cambiamos la configuración.
    setTimeout(() => {
      setPaginationEnabled((prev) => !prev); // Alternamos entre activar o desactivar la paginación.
      setCurrentPage(1); // Restablecemos a la primera página.
      setLoading(false); // Ocultamos el spinner después de 500 ms.
    }, 500);
  };

  return (
    <div>
      {loading && <CenteredSpinner />}{" "}
      {/* Si 'loading' es verdadero, mostramos el spinner centralizado. */}
      {/* Encabezado de la página con el botón de logout y el ícono para activar/desactivar la paginación. */}
      <section className="container d-flex justify-content-between align-items-center py-4">
        <Icon
          icon={paginationEnabled ? "bi:toggle2-on" : "bi:toggle2-off"} // Ícono que muestra si la paginación está activada o desactivada.
          className="fs-1 text-primary cursor-pointer"
          onClick={togglePagination} // Al hacer clic, alternamos la paginación.
          title={
            paginationEnabled ? "Desactivar paginación" : "Activar paginación"
          } // Título que muestra el estado actual de la paginación.
          role="button"
        />
        <h1 className="text-center">Posts</h1>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>{" "}
        {/* Botón de logout. */}
      </section>
      {/* Paginación: Botones para cambiar entre páginas */}
      {paginationEnabled && (
        <div className="d-flex justify-content-center align-items-center gap-3 py-4">
          <button
            className="btn btn-outline-primary"
            onClick={goToPreviousPage} // Cambio a la página anterior.
            disabled={currentPage === 1} // Deshabilitamos el botón si estamos en la primera página.
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>{" "}
          {/* Muestra la página actual y el total de páginas. */}
          <button
            className="btn btn-outline-primary"
            onClick={goToNextPage} // Cambio a la siguiente página.
            disabled={currentPage === totalPages} // Deshabilitamos el botón si estamos en la última página.
          >
            Siguiente
          </button>
        </div>
      )}
      {/* Mostrar los posts */}
      <section className="container py-4">
        <div className="row">
          {postsToDisplay.map(
            (
              post // Iteramos sobre los posts a mostrar.
            ) => (
              <div
                className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                key={post.id}
              >
                <div className="card h-100 d-flex flex-column">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{post.title}</h5>{" "}
                    {/* Título del post */}
                    <p className="card-text flex-grow-1">{post.body}</p>{" "}
                    {/* Cuerpo del post */}
                    <button
                      className="btn btn-primary mt-auto"
                      onClick={() => getComentarios(post)} // Al hacer clic, obtenemos los comentarios del post.
                    >
                      <Icon icon="mdi:comment-eye-outline" className="me-2" />
                      Ver comentarios
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </section>
      {/* Modal para mostrar los comentarios */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Comentarios del Post #{currentPost?.id}</Modal.Title>{" "}
          {/* Título con el número del post actual */}
        </Modal.Header>
        <Modal.Body>
          {comentarios.length === 0 ? (
            <p>No hay comentarios disponibles.</p>
          ) : (
            <ul className="list-group">
              {comentarios.map(
                (
                  comentario // Iteramos sobre los comentarios y los mostramos.
                ) => (
                  <li className="list-group-item" key={comentario.id}>
                    <h6>
                      {comentario.name}{" "}
                      <small className="text-muted">({comentario.email})</small>
                    </h6>
                    <p>{comentario.body}</p>
                  </li>
                )
              )}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>{" "}
          {/* Botón para cerrar el modal */}
        </Modal.Footer>
      </Modal>
    </div>
  );
};
