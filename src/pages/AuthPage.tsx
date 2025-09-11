import React, { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { Tabs, Tab } from "@mui/material";
import { FormField } from "../components/FormField";
import { loginUser, registerUser } from "../api/authApi";
import { useNavigate, useSearchParams } from "react-router";

interface LoginFormInputs {
  username: string;
  password: string;
}

interface RegisterFormInputs extends LoginFormInputs {
  email: string;
  name: string;
  lastName: string;
  dateOfBirth: string;
}

const AuthPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const mode = searchParams.get("mode") ?? "login";
  const isLogin = mode === "login";
  const isAuthenticated = !!localStorage.getItem("token");

  useEffect(() => {
    if (isLogin && isAuthenticated) {
      navigate("/events", { replace: true });
    }
  }, [isLogin, isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormInputs>();

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    if (isLogin) {
      toast.promise(
        loginUser({ username: data.username, password: data.password }).then(
          (res) => {
            localStorage.setItem("token", res.token);
            localStorage.setItem(
              "tokenExpiresAt",
              (Date.now() + res.expiresIn).toString()
            );
            navigate("/events");
          }
        ),
        {
          loading: "Iniciando sesión...",
          success: "Ingreso exitoso",
          error: (err) => `Error al iniciar sesión: ${err.message}`,
        }
      );
    } else {
      toast.promise(
        registerUser(data).then(() => {
          toast.success("Registro exitoso. Iniciá sesión.");
          setSearchParams({ mode: "login" });
          reset();
        }),
        {
          loading: "Registrando...",
          success: "Registro exitoso",
          error: (err) => `Error al registrar: ${err.message}`,
        }
      );
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="page-title">{isLogin ? "Iniciar Sesión" : "Registrarse"}</h2>

        <Tabs
          value={mode}
          onChange={(e, newMode) => {
            setSearchParams({ mode: newMode });
            reset();
          }}
          style={{ marginBottom: 16 }}
        >
          <Tab label="Login" value="login" disabled={isAuthenticated} />
          <Tab label="Registro" value="register" />
        </Tabs>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Usuario" error={errors.username}>
            <input
              type="text"
              {...register("username", { required: "Campo obligatorio" })}
            />
          </FormField>

          <FormField label="Contraseña" error={errors.password}>
            <input
              type="password"
              {...register("password", { required: "Campo obligatorio" })}
            />
          </FormField>

          {!isLogin && (
            <>
              <FormField label="Email" error={errors.email}>
                <input
                  type="email"
                  {...register("email", { required: "Campo obligatorio" })}
                />
              </FormField>

              <FormField label="Nombre" error={errors.name}>
                <input
                  type="text"
                  {...register("name", { required: "Campo obligatorio" })}
                />
              </FormField>

              <FormField label="Apellido" error={errors.lastName}>
                <input
                  type="text"
                  {...register("lastName", { required: "Campo obligatorio" })}
                />
              </FormField>

              <FormField label="Fecha de nacimiento" error={errors.dateOfBirth}>
                <input
                  type="date"
                  {...register("dateOfBirth", { required: "Campo obligatorio" })}
                />
              </FormField>
            </>
          )}

          <div className="form-full">
            <button type="submit" className="btn" disabled={isSubmitting}>
              {isLogin ? "Entrar" : "Registrarse"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
