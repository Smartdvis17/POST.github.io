# Post App

Aplicación React (Vite) que simula un panel de administración de posts: login, listado con búsqueda y paginación, CRUD de posts y visualización de comentarios. Pensada como proyecto de práctica/demo, no como sistema de producción (ver [Limitaciones](#limitaciones-conocidas)).

## Tabla de contenidos

- [Stack](#stack)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Scripts disponibles](#scripts-disponibles)
- [Credenciales de acceso](#credenciales-de-acceso)
- [Funcionalidades](#funcionalidades)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Persistencia de datos local](#persistencia-de-datos-local)
- [Limitaciones conocidas](#limitaciones-conocidas)

## Stack

- [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/) (`createBrowserRouter`)
- [React Hook Form](https://react-hook-form.com/) + [Yup](https://github.com/jquense/yup) para validación de formularios
- [Bootstrap 5](https://getbootstrap.com/) (vía CDN) + [React Bootstrap](https://react-bootstrap.netlify.app/) para modales
- [Axios](https://axios-http.com/) para consumir la API de prueba [jsonplaceholder](https://jsonplaceholder.typicode.com/)
- [SweetAlert2](https://sweetalert2.github.io/) para alertas y confirmaciones
- [Iconify](https://iconify.design/) (`@iconify/react`) para iconografía

## Requisitos

- Node.js 18 o superior
- npm

## Instalación

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Scripts disponibles

| Script            | Descripción                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`      | Levanta el servidor de desarrollo (Vite)       |
| `npm run build`    | Genera el build de producción en `dist/`       |
| `npm run preview`  | Sirve el build de producción localmente        |
| `npm run lint`     | Corre ESLint sobre todo el proyecto            |

## Credenciales de acceso

El login no tiene backend real: el usuario y contraseña están fijos en [`src/pages/Login.jsx`](src/pages/Login.jsx).

```
Correo:      email@example.com
Contraseña:  Password123
```

## Funcionalidades

### Autenticación (demo)

- Login con validación de campos (Yup + React Hook Form) y mostrar/ocultar contraseña.
- Sesión simulada con `localStorage` (`login`): [`PrivateRoute`](src/navigation/PrivateRoute.jsx) protege `/post` y [`PublicRoute`](src/navigation/PublicRoute.jsx) redirige a `/post` si ya iniciaste sesión (evita volver a mostrar el login si recargas la página estando logueado).
- Logout con confirmación (SweetAlert2).

### Posts

- Listado paginado (8 por página) consumido desde `jsonplaceholder`, con opción de desactivar la paginación.
- Búsqueda en vivo por título o contenido.
- Crear, editar y eliminar posts (modal con formulario).
- Botón **Restablecer** para descartar los cambios locales y volver a los posts originales de la API.
- Ver comentarios de un post en un modal, con autor (avatar de iniciales), email y una fecha simulada (ver [`src/utils/commentDate.js`](src/utils/commentDate.js) — la API no provee fecha real).
- Página 404 para rutas no reconocidas.

## Estructura del proyecto

```
src/
├── components/         # Componentes de presentación reutilizables
│   ├── AppNavbar.jsx        # Encabezado de la app (título, toggle paginación, logout)
│   ├── Avatar.jsx           # Círculo con iniciales de un nombre
│   ├── CenteredSpinner.jsx  # Spinner de carga a pantalla completa
│   ├── CommentItem.jsx      # Fila de un comentario (avatar, nombre, fecha, cuerpo)
│   ├── CommentsModal.jsx    # Modal con la lista de comentarios de un post
│   ├── PostCard.jsx         # Tarjeta individual de un post
│   ├── PostFormModal.jsx    # Modal de creación/edición de un post
│   ├── PostList.jsx         # Grilla de PostCard + estado vacío
│   ├── PostPagination.jsx   # Controles de paginación
│   └── PostSearchBar.jsx    # Buscador + botones "Nuevo post" / "Restablecer"
├── context/
│   └── UserContext.jsx  # Contexto global de sesión (isLogin/setIsLogin)
├── hooks/
│   └── useUser.jsx      # Hook de acceso a UserContext
├── navigation/
│   ├── PrivateRoute.jsx # Protege rutas que requieren sesión iniciada
│   └── PublicRoute.jsx  # Redirige a /post si ya hay sesión iniciada
├── pages/
│   ├── Login.jsx         # Página de login
│   ├── NotFound.jsx      # Página 404
│   └── Post.jsx          # Orquesta estado y lógica del listado de posts
├── schema/
│   └── ValidationSchema.jsx # Esquema de validación (Yup) del login
├── utils/
│   ├── commentDate.js    # Genera y formatea la fecha simulada de un comentario
│   └── postOverrides.js  # Persistencia local de posts creados/editados/eliminados
├── index.css             # Tema global (paleta oscura, variables, overrides de Bootstrap)
└── main.jsx               # Router y providers de la app
```

## Persistencia de datos local

`jsonplaceholder` es una API de prueba: acepta `POST`/`PUT`/`DELETE` pero no persiste nada realmente, y sus respuestas fallan si el `id` no existe en su set de datos (por ejemplo, cualquier post creado desde el cliente). Para que la app se sienta funcional de todos modos, [`src/utils/postOverrides.js`](src/utils/postOverrides.js) guarda tus cambios en `localStorage`, separados de los datos de la API:

- `local_posts` — posts creados desde la app.
- `edited_posts` — ediciones a posts originales de la API (`{ id: { title, body } }`).
- `deleted_post_ids` — ids de posts originales que eliminaste.

En cada carga, la app siempre pide los 100 posts originales a la API y les aplica estos cambios encima. Así, la lista base nunca puede "desaparecer" por completo aunque algo en el `localStorage` falle — como mucho se pierden los cambios propios, y para eso está el botón **Restablecer**.

## Limitaciones conocidas

- **No hay backend real**: el login usa credenciales fijas en el código y los posts se apoyan en una API de prueba que no persiste datos.
- **Fecha de comentarios simulada**: `jsonplaceholder` no incluye fecha en los comentarios; se genera una determinística (mismo comentario → misma fecha) solo para fines visuales.
- **Datos por navegador**: los cambios locales de posts (crear/editar/eliminar) viven en el `localStorage` de cada navegador, no se sincronizan entre dispositivos ni usuarios.
