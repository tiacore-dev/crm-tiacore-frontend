import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../axiosConfig";
import toast from "react-hot-toast";
import { Button, Typography, Spin, Space } from "antd";
import "./loginPage.css";
import { FloatingInput } from "../../components/floatingInput/floatingInput";
import { UserFormModal } from "../usersPage/components/userFormModal";

type FormData = {
  email: string;
  password: string;
};

type AuthResponse = {
  access_token: string;
  refresh_token: string;
  permissions: Record<string, string[]>;
  is_superadmin: boolean;
  user_id: string;
};

type ApiError = {
  response?: {
    data: {
      message: string;
    };
  };
};

// Регулярное выражение для валидации email
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const LoginPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    if (token) {
      toast.success(
        <div>Email успешно подтверждён! Теперь вы можете войти в систему.</div>,
        {
          duration: 8000,
        }
      );
      navigate("/login", { replace: true });
    }
  }, [location.search, navigate]);

  const loginMutation = useMutation<AuthResponse, Error, FormData>({
    mutationFn: async (data) => {
      const url = process.env.REACT_APP_API_URL;
      if (!url) throw new Error("REACT_APP_API_URL is not defined");

      try {
        const response = await axiosInstance.post<AuthResponse>(
          `${url}/api/auth/login`,
          data
        );
        return response.data;
      } catch (error: unknown) {
        const apiError = error as ApiError;
        const errorMessage =
          apiError.response?.data.message || "Ошибка при авторизации";
        throw new Error(errorMessage);
      }
    },
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("is_superadmin", data.is_superadmin.toString());
      if (!data.is_superadmin) {
        localStorage.setItem("permissions", JSON.stringify(data.permissions));
        const companyIds = Object.keys(data.permissions);
        if (companyIds.length > 0) {
          localStorage.setItem("selectedCompanyId", companyIds[0]);
        }
      }
      localStorage.setItem("user_id", data.user_id);

      window.location.href = "/home";
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = useCallback(
    (data: FormData) => {
      loginMutation.mutate(data);
    },
    [loginMutation]
  );

  return (
    <div className="login_container">
      <div className="form">
        <Typography.Title level={3} className="form-title">
          Вход
        </Typography.Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "E-mail обязателен",
            }}
            render={({ field }) => (
              <FloatingInput
                id="email"
                name="email"
                value={field.value}
                onChange={field.onChange}
                disabled={loginMutation.isPending}
                hint="Введите email"
              />
            )}
          />
          {errors.email && (
            <div className="error-text">{errors.email.message}</div>
          )}
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Пароль обязателен",
              minLength: {
                value: 6,
                message: "Пароль должен содержать минимум 6 символов",
              },
            }}
            render={({ field }) => (
              <FloatingInput
                id="password"
                name="Пароль"
                type="password"
                value={field.value}
                onChange={field.onChange}
                disabled={loginMutation.isPending}
                hint="Минимум 6 символов"
              />
            )}
          />
          {errors.password && (
            <div className="error-text">{errors.password.message}</div>
          )}

          <Space direction="vertical" style={{ width: "100%" }}>
            <Button
              htmlType="submit"
              className="button"
              size="large"
              disabled={loginMutation.isPending}
              block
            >
              {loginMutation.isPending ? <Spin size="small" /> : "Войти"}
            </Button>

            <Button
              type="link"
              onClick={() => setIsRegisterModalVisible(true)}
              block
            >
              Зарегистрироваться
            </Button>
          </Space>
        </form>
      </div>

      {/* Модальное окно регистрации */}
      <UserFormModal
        visible={isRegisterModalVisible}
        onCancel={() => setIsRegisterModalVisible(false)}
        onSuccess={() => {
          setIsRegisterModalVisible(false);
        }}
        mode="registration"
      />
    </div>
  );
};

// import React, { useCallback, useState, useEffect } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useMutation } from "@tanstack/react-query";
// import { axiosInstance } from "../../axiosConfig";
// import toast from "react-hot-toast";
// import { Button, Typography, Spin, Space } from "antd";
// import "./loginPage.css";
// import { FloatingInput } from "../../components/floatingInput/floatingInput";
// import { UserFormModal } from "../usersPage/components/userFormModal";

// type FormData = {
//   email: string;
//   password: string;
// };

// type AuthResponse = {
//   access_token: string;
//   refresh_token: string;
//   permissions: Record<string, string[]>;
//   is_superadmin: boolean;
//   user_id: string;
// };

// type ApiError = {
//   response?: {
//     data: {
//       message: string;
//     };
//   };
// };

// export const LoginPage: React.FC = () => {
//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormData>({
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);

//   // Мутация для подтверждения email
//   const verifyEmailMutation = useMutation({
//     mutationFn: async (token: string) => {
//       const url = process.env.REACT_APP_API_URL;
//       if (!url) throw new Error("REACT_APP_API_URL is not defined");

//       const response = await axiosInstance.get(
//         `${url}/api/auth/verify-email?token=${token}`
//       );
//       return response.data;
//     },
//     onSuccess: () => {
//       toast.success("Email успешно подтверждён! Теперь вы можете войти в систему.");
//       navigate("/login", { replace: true });
//     },
//     onError: (error: ApiError) => {
//       const errorMessage = error.response?.data.message || "Ошибка при подтверждении email";
//       toast.error(errorMessage);
//       navigate("/login", { replace: true });
//     },
//   });

//   // Проверяем токен при загрузке страницы
//   useEffect(() => {
//     const searchParams = new URLSearchParams(location.search);
//     const token = searchParams.get("token");

//     if (token) {
//       verifyEmailMutation.mutate(token);
//     }
//   }, [location.search]);

//   const loginMutation = useMutation<AuthResponse, Error, FormData>({
//     mutationFn: async (data) => {
//       const url = process.env.REACT_APP_API_URL;
//       if (!url) throw new Error("REACT_APP_API_URL is not defined");

//       try {
//         const response = await axiosInstance.post<AuthResponse>(
//           `${url}/api/auth/token`,
//           data
//         );
//         return response.data;
//       } catch (error: unknown) {
//         const apiError = error as ApiError;
//         const errorMessage =
//           apiError.response?.data.message || "Ошибка при авторизации";
//         throw new Error(errorMessage);
//       }
//     },
//     onSuccess: (data) => {
//       localStorage.setItem("access_token", data.access_token);
//       localStorage.setItem("refresh_token", data.refresh_token);
//       localStorage.setItem("is_superadmin", data.is_superadmin.toString());
//       if (!data.is_superadmin) {
//         localStorage.setItem("permissions", JSON.stringify(data.permissions));
//         const companyIds = Object.keys(data.permissions);
//         if (companyIds.length > 0) {
//           localStorage.setItem("selectedCompanyId", companyIds[0]);
//         }
//       }
//       localStorage.setItem("user_id", data.user_id);

//       window.location.href = "/home";
//     },
//     onError: (error) => {
//       toast.error(error.message);
//     },
//   });

//   const onSubmit = useCallback(
//     (data: FormData) => {
//       loginMutation.mutate(data);
//     },
//     [loginMutation]
//   );

//   return (
//     <div className="login_container">
//       <div className="form">
//         <Typography.Title level={3} className="form-title">
//           Вход
//         </Typography.Title>

//         <form onSubmit={handleSubmit(onSubmit)}>
//           <Controller
//             name="email"
//             control={control}
//             rules={{
//               required: "E-mail обязателен",
//             }}
//             render={({ field }) => (
//               <FloatingInput
//                 id="email"
//                 name="email"
//                 value={field.value}
//                 onChange={field.onChange}
//                 disabled={loginMutation.isPending}
//                 hint="Введите email"
//               />
//             )}
//           />
//           {errors.email && (
//             <div className="error-text">{errors.email.message}</div>
//           )}
//           <Controller
//             name="password"
//             control={control}
//             rules={{
//               required: "Пароль обязателен",
//               minLength: {
//                 value: 6,
//                 message: "Пароль должен содержать минимум 6 символов",
//               },
//             }}
//             render={({ field }) => (
//               <FloatingInput
//                 id="password"
//                 name="Пароль"
//                 type="password"
//                 value={field.value}
//                 onChange={field.onChange}
//                 disabled={loginMutation.isPending}
//                 hint="Минимум 6 символов"
//               />
//             )}
//           />
//           {errors.password && (
//             <div className="error-text">{errors.password.message}</div>
//           )}

//           <Space direction="vertical" style={{ width: "100%" }}>
//             <Button
//               htmlType="submit"
//               className="button"
//               size="large"
//               disabled={loginMutation.isPending}
//               block
//             >
//               {loginMutation.isPending ? <Spin size="small" /> : "Войти"}
//             </Button>

//             <Button
//               type="link"
//               onClick={() => setIsRegisterModalVisible(true)}
//               block
//             >
//               Зарегистрироваться
//             </Button>
//           </Space>
//         </form>
//       </div>

//       <UserFormModal
//         visible={isRegisterModalVisible}
//         onCancel={() => setIsRegisterModalVisible(false)}
//         onSuccess={() => {
//           setIsRegisterModalVisible(false);
//         }}
//         mode="registration"
//       />
//     </div>
//   );
// };
