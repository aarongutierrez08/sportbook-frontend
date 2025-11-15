import React, { useEffect, useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { Tabs, Tab } from "@mui/material";
import { FormField } from "../commons/components/FormField";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import type { SportUser } from "../types/user";

type TabMode = "login" | "register";

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

type FormInputs = RegisterFormInputs;

const AuthPage: React.FC = () => {
  const { login: loginUser, register: registerUser, status } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<TabMode>("login");

  useEffect(() => {
    if (status === "auth") {
      navigate("/events", { replace: true });
    }
  }, [status, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    clearErrors,
  } = useForm<FormInputs>({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const isRegister = tab === "register";

  const rules = useMemo(
    () => ({
      username: { required: "Campo obligatorio" },
      password: { required: "Campo obligatorio" },
      email: isRegister ? { required: "Campo obligatorio" } : undefined,
      name: isRegister ? { required: "Campo obligatorio" } : undefined,
      lastName: isRegister ? { required: "Campo obligatorio" } : undefined,
      dateOfBirth: isRegister ? { required: "Campo obligatorio" } : undefined,
    }),
    [isRegister]
  );

  if (status === "idle") {
    return <div style={{ padding: 24 }}>Cargando…</div>;
  }

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const sportUser: SportUser = {
      username: data.username,
      password: data.password,
      email: data.email,
      name: data.name,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
    };
    if (isRegister) {
      toast.promise(registerUser(sportUser), {
        loading: "Registrando...",
        success: () => {
          reset();
          navigate("/events", { replace: true });
          return "Registro exitoso";
        },
        error: (err) =>
          `Error al registrar: ${err?.message ?? "Intenta nuevamente"}`,
      });
    } else {
      toast.promise(
        loginUser({ username: data.username, password: data.password }),
        {
          loading: "Iniciando sesión...",
          success: () => {
            navigate("/events", { replace: true });
            return "Ingreso exitoso";
          },
          error: (err) =>
            `Error al iniciar sesión: ${err?.message ?? "Intenta nuevamente"}`,
        }
      );
    }
  };

  const handleTabChange = (_: unknown, newMode: TabMode) => {
    if (isSubmitting) return;
    setTab(newMode);
    clearErrors();
    if (newMode === "login") {
      reset(
        ({ username, password }) =>
          ({
            username: username ?? "",
            password: password ?? "",
          } as FormInputs),
        { keepErrors: false, keepDirty: false }
      );
    }
  };

  return (
    <div className="container">
      <div className="card-container">
        <div className="card">
          <h2 className="page-title">
            {isRegister ? "Registrarse" : "Iniciar Sesión"}
          </h2>

          <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Login" value="login" disabled={isSubmitting} />
            <Tab label="Registro" value="register" disabled={isSubmitting} />
          </Tabs>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField label="Usuario" error={errors.username}>
              <input
                type="text"
                autoComplete="username"
                {...register("username", rules.username)}
              />
            </FormField>

            <FormField label="Contraseña" error={errors.password}>
              <input
                type="password"
                autoComplete={isRegister ? "new-password" : "current-password"}
                {...register("password", rules.password)}
              />
            </FormField>

            {isRegister && (
              <>
                <FormField label="Email" error={errors.email}>
                  <input
                    type="email"
                    autoComplete="email"
                    {...register("email", rules.email)}
                  />
                </FormField>

                <FormField label="Nombre" error={errors.name}>
                  <input
                    type="text"
                    autoComplete="given-name"
                    {...register("name", rules.name)}
                  />
                </FormField>

                <FormField label="Apellido" error={errors.lastName}>
                  <input
                    type="text"
                    autoComplete="family-name"
                    {...register("lastName", rules.lastName)}
                  />
                </FormField>

                <FormField
                  label="Fecha de nacimiento"
                  error={errors.dateOfBirth}
                >
                  <input
                    type="date"
                    {...register("dateOfBirth", rules.dateOfBirth)}
                  />
                </FormField>
              </>
            )}

            <button
              type="submit"
              className="btn btn--block"
              disabled={isSubmitting}
            >
              {isRegister ? "Registrarse" : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
