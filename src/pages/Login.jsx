import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import validationSchema from "../schema/ValidationSchema";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";

export const Login = () => {
  const navigation = useNavigate();
  const { setIsLogin } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

    // Pequeño retraso para dar sensación de verificación real
    setTimeout(() => {
      if (email === "email@example.com" && password === "Password123") {
        Swal.fire({
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
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center">
      <div className="auth-card card shadow-lg border-0">
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <div className="auth-icon-circle mx-auto mb-3">
              <Icon icon="mdi:shield-lock-outline" width="32" height="32" />
            </div>
            <h1 className="h3 fw-bold mb-1">Bienvenido de nuevo</h1>
            <p className="text-muted mb-0">Inicia sesión para continuar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Correo */}
            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <div className="input-group">
                <span className="input-group-text">
                  <Icon icon="mdi:email-outline" />
                </span>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="email@example.com"
                  autoFocus
                  autoComplete="email"
                  {...control.register("email")}
                />
              </div>
              {errors.email && (
                <div className="text-danger small mt-1">{errors.email.message}</div>
              )}
            </div>

            {/* Contraseña */}
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <div className="input-group">
                <span className="input-group-text">
                  <Icon icon="mdi:lock-outline" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  placeholder="Password123"
                  autoComplete="current-password"
                  {...control.register("password")}
                />
                <button
                  type="button"
                  className="input-group-text auth-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  <Icon icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"} />
                </button>
              </div>
              {errors.password && (
                <div className="text-danger small mt-1">{errors.password.message}</div>
              )}
            </div>

            <div className="mb-4 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="dropdownCheck"
              />
              <label className="form-check-label small" htmlFor="dropdownCheck">
                Recordarme
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Verificando...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
