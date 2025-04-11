import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { useUserMutations } from "../../../hooks/users/useUserMutation";
import { IUser } from "../../../api/usersApi";

interface UserCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialData?: IUser | null;
}

export const UserFormModal: React.FC<UserCreateModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  mode = "create",
  initialData = null,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createMutation, updateMutation } = useUserMutations(
    initialData?.user_id || "",
    initialData?.username || "",
    initialData?.full_name || "",
    initialData?.position || ""
  );

  useEffect(() => {
    if (initialData && mode === "edit") {
      form.setFieldsValue({
        username: initialData.username,
        full_name: initialData.full_name,
        position: initialData.position,
      });
    } else {
      form.resetFields();
    }
  }, [initialData, mode, form]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();

      if (mode === "create") {
        await createMutation.mutateAsync(values);
      } else if (mode === "edit" && initialData?.user_id) {
        await updateMutation.mutateAsync(values);
      }

      form.resetFields();
      onCancel();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={
        mode === "create"
          ? "Добавить пользователя"
          : "Редактировать пользователя"
      }
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
          {mode === "create" ? "Создать" : "Сохранить"}
        </Button>,
      ]}
      width={700}
    >
      <Form form={form} layout="vertical">
        {/* Валидация для поля "Логин" */}
        <Form.Item
          label="Логин пользователя"
          name="username"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите логин пользователя",
            },
            { min: 3, message: "Минимум 3 символа" },
          ]}
        >
          <Input placeholder="Введите логин пользователя" />
        </Form.Item>
        {mode === "create" && (
          <Form.Item
            label="Пароль пользователя"
            name="password"
            rules={[
              { required: true, message: "Пожалуйста, введите пароль" },
              { min: 6, message: "Минимум 6 символов" },
            ]}
          >
            <Input.Password placeholder="Введите пароль" />
          </Form.Item>
        )}
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

        <Form.Item
          label="Должность"
          name="position"
          rules={[
            { required: true, message: "Пожалуйста, введите должность" },
            { min: 3, message: "Минимум 3 символа" },
          ]}
        >
          <Input placeholder="Введите должность" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
