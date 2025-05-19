import * as yup from "yup";

// Definir el esquema de validación con Yup
const validationSchema = yup.object().shape({
  email: yup
    .string()
    .min(3, "El correo electrónico debe tener al menos 3 caracteres")
    .email("Correo electrónico no válido")
    .required("El correo electrónico es obligatorio"),
   
  password: yup
    .string()
    .min(4, "La contraseña debe tener al menos 4 caracteres")
    .required("La contraseña es obligatoria")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/,
      "La contraseña debe contener al menos una letra y un número"
    ),
});

export default validationSchema;
