import React, { useState } from "react";
import { Modal, Form, Input, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useTemplateMutations } from "../../../hooks/templates/useTemplateMutation";
import { RcFile } from "antd/es/upload";

interface TemplateCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  companiesData: { company_id: string; company_name: string }[];
}

export const TemplateCreateModal: React.FC<TemplateCreateModalProps> = ({
  visible,
  onCancel,
  companiesData,
}) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState<RcFile | null>(null);
  const { createMutation } = useTemplateMutations("", "", "", "", "", "");

  const beforeUpload = (file: RcFile) => {
    setFile(file);
    return false; // Отменяем автоматическую загрузку
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!file) {
        message.error("Пожалуйста, загрузите файл шаблона");
        return;
      }

      const formData = new FormData();
      formData.append("template_name", values.template_name);
      formData.append("company", values.company);
      formData.append("entity", values.entity);
      formData.append("file", file as RcFile); // Убеждаемся, что файл добавляется корректно

      if (values.description) {
        formData.append("description", values.description);
      }

      formData.forEach((value, key) => {
        console.log(key, value);
      });

      createMutation.mutate(formData);
      onCancel();
      form.resetFields();
      setFile(null);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title="Добавить шаблон"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Сохранить"
      cancelText="Отмена"
      confirmLoading={createMutation.isPending}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="template_name"
          label="Название шаблона"
          rules={[
            { required: true, message: "Пожалуйста, введите название" },
            { min: 3, message: "Минимум 3 символа" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Описание">
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          name="company"
          label="Компания"
          rules={[{ required: true, message: "Пожалуйста, выберите компанию" }]}
        >
          <Select>
            {companiesData.map((company) => (
              <Select.Option
                key={company.company_id}
                value={company.company_id}
              >
                {company.company_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="entity"
          label="Тип сущности"
          rules={[{ required: true, message: "Пожалуйста, выберите тип" }]}
        >
          <Select>
            <Select.Option value="Act">Акт</Select.Option>
            <Select.Option value="Bill">Счет</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Файл шаблона" required>
          <Upload
            beforeUpload={beforeUpload}
            maxCount={1}
            accept=".doc,.docx,.xls,.xlsx"
          >
            <Button icon={<UploadOutlined />}>Выберите файл</Button>
            {file && <span style={{ marginLeft: 8 }}>{file.name}</span>}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};
