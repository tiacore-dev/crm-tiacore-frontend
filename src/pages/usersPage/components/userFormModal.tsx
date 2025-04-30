import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Checkbox } from "antd";
import { useUserMutations } from "../../../hooks/users/useUserMutation";
import { IUser } from "../../../api/usersApi";

interface UserCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  mode?: "create" | "edit" | "registration";
  initialData?: IUser | null;
}

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const UserFormModal: React.FC<UserCreateModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  mode = "create",
  initialData = null,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";

  const { createMutation, updateMutation, registrationMutation } =
    useUserMutations(
      initialData?.user_id || "",
      initialData?.email || "",
      initialData?.full_name || ""
      // initialData?.position || ""
    );

  useEffect(() => {
    if (visible) {
      if (initialData && mode === "edit") {
        form.setFieldsValue({
          email: initialData.email,
          full_name: initialData.full_name,
          // position: initialData.position,
          is_verified: initialData.is_verified || false, // Добавляем is_verified
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialData, mode, form]);

  // Изменения в userFormModal.tsx
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();

      // Создаем новый объект без confirmPassword
      const dataToSend = {
        email: values.email,
        password: values.password,
        full_name: values.full_name,
        position: values.position,
        ...(mode === "edit" &&
          isSuperadmin && {
            is_verified: values.is_verified || false,
          }),
      };

      if (mode === "create") {
        await createMutation.mutateAsync(dataToSend);
      } else if (mode === "edit" && initialData?.user_id) {
        await updateMutation.mutateAsync(dataToSend);
      } else if (mode === "registration") {
        await registrationMutation.mutateAsync(dataToSend);
      }

      form.resetFields();
      onCancel();
      if (onSuccess) onSuccess();
    } catch (error) {
      // Ошибки обрабатываются в хуке useUserMutations
    } finally {
      setIsSubmitting(false);
    }
  };
  const getModalTitle = () => {
    switch (mode) {
      case "create":
        return "Добавить пользователя";
      case "edit":
        return "Редактировать пользователя";
      case "registration":
        return "Регистрация нового пользователя";
      default:
        return "Добавить пользователя";
    }
  };
  return (
    <Modal
      title={getModalTitle()} // Используем функцию для определения заголовка
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Отмена
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isSubmitting}
          onClick={handleSubmit}
        >
          {mode === "registration"
            ? "Зарегистрироваться"
            : mode === "create"
            ? "Создать"
            : "Сохранить"}{" "}
        </Button>,
      ]}
      width={700}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Email пользователя"
          name="email"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите email пользователя",
            },
            {
              type: "email",
              message: "Введите корректный email адрес",
            },
            {
              pattern: emailRegex,
              message: "Email должен быть в формате example@domain.com",
            },
            { min: 3, message: "Минимум 3 символа" },
          ]}
        >
          <Input placeholder="Введите email пользователя" />
        </Form.Item>

        {/* Пароль (основное поле) */}
        <Form.Item
          label="Пароль"
          name="password"
          rules={[
            { required: true, message: "Пожалуйста, введите пароль" },
            { min: 6, message: "Минимум 6 символов" },
          ]}
        >
          <Input.Password placeholder="Введите пароль" />
        </Form.Item>

        {/* Подтверждение пароля */}
        <Form.Item
          label="Подтверждение пароля"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Пожалуйста, подтвердите пароль" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Пароли не совпадают"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Повторите пароль" />
        </Form.Item>

        <Form.Item
          label="Ф.И.О."
          name="full_name"
          rules={[
            { required: true, message: "Пожалуйста, введите Ф.И.О." },
            { min: 3, message: "Минимум 3 символа" },
          ]}
        >
          <Input placeholder="Введите Ф.И.О." />
        </Form.Item>
        {/* <Form.Item
          label="Должность"
          name="position"
          rules={[
            { required: true, message: "Пожалуйста, введите должность" },
            { min: 3, message: "Минимум 3 символа" },
          ]}
        >
          <Input placeholder="Введите должность" />
        </Form.Item> */}
        {isSuperadmin && mode === "edit" && (
          <Form.Item name="is_verified" valuePropName="checked">
            <Checkbox>Верифицировать пользователя</Checkbox>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};
