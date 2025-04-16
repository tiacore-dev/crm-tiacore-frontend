import { Modal, Form, Select, Button } from "antd";
import { useUserCompanyRelationsMutations } from "../../hooks/userCompanyRelations/useUserCompanyRelationsMutations";
import { IUserCompanyRelation } from "../../api/userCompanyRelationsApi";
import { useEffect, useState } from "react";
import { IUser } from "../../api/usersApi";

interface RelationFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialData?: IUserCompanyRelation | null;
  roles: Array<{ role_id: string; role_name: string }>;
  userId?: string;
  companyId?: string;
  companies?: Array<{ company_id: string; company_name: string }>;
  users?: IUser[];
}

export const RelationFormModal = ({
  visible,
  onCancel,
  onSuccess,
  mode = "create",
  initialData,
  roles,
  userId,
  companyId,
  companies = [],
  users = [],
}: RelationFormModalProps) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createMutation, updateMutation } = useUserCompanyRelationsMutations(
    initialData?.user_company_id || "",
    initialData?.user_id || "",
    initialData?.company_id || "",
    initialData?.role_id || "",
    () => {}
  );

  useEffect(() => {
    if (initialData && mode === "edit") {
      form.setFieldsValue({
        user_id: initialData.user_id,
        company_id: initialData.company_id,
        role_id: initialData.role_id,
      });
    } else {
      form.resetFields();
      // Устанавливаем значения по умолчанию для создания
      if (userId) {
        form.setFieldsValue({ user_id: userId });
      }
      if (companyId) {
        form.setFieldsValue({ company_id: companyId });
      }
    }
  }, [initialData, mode, form, userId, companyId]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();

      if (mode === "create") {
        await createMutation.mutateAsync({
          // Преобразуем названия полей перед отправкой
          user: userId || values.user_id,
          role: values.role_id,
          company: companyId || values.company_id,
        });
      } else if (mode === "edit" && initialData?.user_company_id) {
        await updateMutation.mutateAsync({
          role: values.role_id,
          user_company_id: initialData.user_company_id,
        });
      }

      form.resetFields();
      onCancel();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={initialData ? "Редактировать связь" : "Создать связь"}
      open={visible}
      onOk={handleSubmit}
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
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          role_id: initialData?.role_id,
        }}
      >
        {/* Показываем поле пользователя только в режиме создания и если не передан userId */}
        {mode === "create" && !userId && (
          <Form.Item
            name="user_id"
            label="Пользователь"
            rules={[
              {
                required: !companyId,
                message: "Пожалуйста, выберите пользователя",
              },
            ]}
          >
            <Select placeholder="Выберите пользователя">
              {users.map((user) => (
                <Select.Option key={user.user_id} value={user.user_id}>
                  {user.full_name
                    ? user.full_name
                    : user.username || user.user_id}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* Показываем поле компании только в режиме создания и если не передан companyId */}
        {mode === "create" && !companyId && (
          <Form.Item
            name="company_id"
            label="Компания"
            rules={[
              { required: !userId, message: "Пожалуйста, выберите компанию" },
            ]}
          >
            <Select placeholder="Выберите компанию">
              {companies.map((company) => (
                <Select.Option
                  key={company.company_id}
                  value={company.company_id}
                >
                  {company.company_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* Поле роли показываем всегда */}
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
