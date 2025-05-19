import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import validationSchema from "../schema/ValidationSchema";
import Swal from "sweetalert2";

export const Login = () => {
  const navigation = useNavigate();
  const { setIsLogin } = useUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    const { email, password } = data;

    // Validación personalizada para comprobar el usuario y contraseña
    if (email === "ana@gmail.com" && password === "As1234") {
      !Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Has iniciado sesión correctamente",
        showConfirmButton: false,
        timer: 1500,
      });

      setIsLogin(true);
      localStorage.setItem("login", true);
      navigation("/post");
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Usuario o contraseña incorrectos",
      });
    }
  };

  return (
    <div className="container">
      <h1 className="text-center">Login</h1>
      <div className="d-flex justify-content-center">
        <div className="col-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Input para capturar el email */}
            <div className="mb-3">
              <label className="form-label">Correo</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="email@example.com"
                autoFocus
                {...control.register("email")}
              />
              {errors.email && (
                <div className="text-danger">{errors.email.message}</div>
              )}
            </div>

            {/* Input para capturar la contraseña */}
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
                {...control.register("password")}
              />
              {errors.password && (
                <div className="text-danger">{errors.password.message}</div>
              )}
            </div>

            <div className="mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="dropdownCheck"
                />
                <label className="form-check-label" htmlFor="dropdownCheck">
                  Recordarme
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
