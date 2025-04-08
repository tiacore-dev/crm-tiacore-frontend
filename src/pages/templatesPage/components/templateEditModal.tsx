import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useTemplateMutations } from "../../../hooks/templates/useTemplateMutation";
import { RcFile } from "antd/es/upload";
import { ITemplate } from "../../../api/templatesApi";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface TemplateEditModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  templateData: ITemplate;
  companiesData: { company_id: string; company_name: string }[];
}

export const TemplateEditModal: React.FC<TemplateEditModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  templateData,
  companiesData,
}) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState<RcFile | null>(null);
  const { updateMutation } = useTemplateMutations(
    templateData.template_id,
    templateData.template_name,
    templateData.description || "",
    templateData.company,
    templateData.entity,
    templateData.s3_key
  );

  useEffect(() => {
    if (visible && templateData) {
      form.setFieldsValue({
        template_name: templateData.template_name,
        description: templateData.description,
        company: templateData.company,
        entity: templateData.entity,
      });
      setFile(null);
    }
  }, [visible, templateData, form]);

  const beforeUpload = (file: RcFile) => {
    setFile(file);
    return false;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("template_name", values.template_name);
      formData.append("company", values.company);
      formData.append("entity", values.entity);

      if (values.description) {
        formData.append("description", values.description);
      }

      if (file) {
        formData.append("file", file);
      }

      await updateMutation.mutateAsync(formData, {
        onSuccess: () => {
          message.success("Шаблон успешно обновлен");
          onSuccess();
        },
        onError: () => {
          message.error("Ошибка при обновлении шаблона");
        },
      });
    } catch (error) {
      console.error("Ошибка валидации:", error);
    }
  };

  return (
    <Modal
      title="Редактировать шаблон"
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Сохранить"
      cancelText="Отмена"
      confirmLoading={updateMutation.isPending}
      width={700}
      destroyOnClose
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
          <Select showSearch optionFilterProp="children">
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
            <Select.Option value="act">Акт</Select.Option>
            <Select.Option value="bill">Счет</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Файл шаблона"
          extra={
            !file &&
            "Текущий файл: " +
              (templateData.s3_key?.split("/").pop() || "Нет файла")
          }
        >
          <Upload
            beforeUpload={beforeUpload}
            maxCount={1}
            accept=".doc,.docx,.xls,.xlsx,.pdf"
            fileList={file ? [file] : []}
          >
            <Button icon={<UploadOutlined />}>Выберите новый файл</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};
