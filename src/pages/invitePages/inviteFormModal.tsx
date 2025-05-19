import { Modal, Form, Select, Button, Input, message } from "antd";
import { useState } from "react";
import { useInviteMutation } from "../../hooks/auth/useAuthMutations";

interface InviteFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  roles: Array<{ role_id: string; role_name: string }>;
  companyId: string;
}

export const InviteFormModal = ({
  visible,
  onCancel,
  onSuccess,
  roles,
  companyId,
}: InviteFormModalProps) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inviteMutation = useInviteMutation();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      // const companyId = localStorage.getItem("selectedCompanyId");

      // if (!companyId) {
      //   message.error("Не выбрана компания");
      //   return;
      // }

      await inviteMutation.mutateAsync({
        email: values.email,
        company_id: companyId,
        role_id: values.role_id,
      });

      //   message.success("Приглашение отправлено");
      form.resetFields();
      onCancel();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
      //   message.error("Ошибка при отправке приглашения");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title="Пригласить пользователя"
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
          Отправить приглашение
        </Button>,
      ]}
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите email пользователя",
            },
            { type: "email", message: "Введите корректный email" },
          ]}
        >
          <Input placeholder="Введите email пользователя" />
        </Form.Item>
        <Form.Item
          name="role_id"
          label="Роль"
          rules={[{ required: true, message: "Пожалуйста, выберите роль" }]}
        >
          <Select placeholder="Выберите роль">
            {roles.map((role) => (
              <Select.Option key={role.role_id} value={role.role_id}>
                {role.role_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
