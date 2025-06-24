import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useTemplateMutations } from "../../../hooks/templates/useTemplateMutation";
import { RcFile } from "antd/es/upload";
import { ITemplate } from "../../../api/templatesApi";

type TemplateFormMode = "create" | "edit";

interface TemplateFormModalProps {
  mode: TemplateFormMode;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  companiesData: { company_id: string; company_name: string }[];
  templateData?: ITemplate;
}

export const TemplateFormModal: React.FC<TemplateFormModalProps> = ({
  mode,
  visible,
  onCancel,
  onSuccess,
  templateData,
  companiesData,
}) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState<RcFile | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );

  useEffect(() => {
    // Получаем company_id из localStorage при монтировании компонента
    const companyId = localStorage.getItem("selectedCompanyId");
    setSelectedCompanyId(companyId);
  }, []);

  const { createMutation, updateMutation } = useTemplateMutations(
    templateData?.template_id || "",
    templateData?.template_name || "",
    templateData?.description || "",
    templateData?.company || "",
    templateData?.entity || "",
    templateData?.s3_key || ""
  );

  useEffect(() => {
    if (visible) {
      if (mode === "edit" && templateData) {
        form.setFieldsValue({
          template_name: templateData.template_name,
          description: templateData.description,
          company: templateData.company,
          entity: templateData.entity,
        });
      } else {
        // Устанавливаем company из localStorage при создании
        form.setFieldsValue({
          company: selectedCompanyId,
        });
      }
      setFile(null);
    }
  }, [visible, mode, templateData, form, selectedCompanyId]);

  const beforeUpload = (file: RcFile) => {
    setFile(file);
    return false;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (mode === "create" && !file) {
        message.error("Пожалуйста, загрузите файл шаблона");
        return;
      }

      const formData = new FormData();
      formData.append("template_name", values.template_name);
      formData.append("company", selectedCompanyId || ""); // Используем company из localStorage
      formData.append("entity", values.entity);

      if (values.description) {
        formData.append("description", values.description);
      }

      if (file) {
        formData.append("file", file);
      }

      if (mode === "create") {
        await createMutation.mutateAsync(formData, {
          onSuccess: () => {
            // message.success("Шаблон успешно создан");
            onSuccess();
            form.resetFields();
            setFile(null);
          },
          onError: () => {
            // message.error("Ошибка при создании шаблона");
          },
        });
      } else {
        await updateMutation.mutateAsync(formData, {
          onSuccess: () => {
            // message.success("Шаблон успешно обновлен");
            onSuccess();
          },
          onError: () => {
            // message.error("Ошибка при обновлении шаблона");
          },
        });
      }
    } catch (error) {
      // console.error("Ошибка валидации:", error);
    }
  };

  const getTitle = () => {
    return mode === "create" ? "Добавить шаблон" : "Редактировать шаблон";
  };

  const getFileExtra = () => {
    if (mode === "edit" && !file) {
      return (
        "Текущий файл: " +
        (templateData?.s3_key?.split("/").pop() || "Нет файла")
      );
    }
    return null;
  };

  const isFileRequired = mode === "create";

  return (
    <Modal
      title={getTitle()}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Сохранить"
      cancelText="Отмена"
      confirmLoading={
        mode === "create" ? createMutation.isPending : updateMutation.isPending
      }
      className="responsive-modal"
      width="90%"
      style={{ maxWidth: 700 }}
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
          <Input placeholder="Введите название шаблона" />
        </Form.Item>

        {/* Скрытое поле для company */}
        <Form.Item name="company" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="entity"
          label="Тип"
          rules={[{ required: true, message: "Пожалуйста, выберите тип" }]}
        >
          <Select placeholder="Выберите тип">
            <Select.Option value="act">Акт</Select.Option>
            <Select.Option value="bill">Счет</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Файл шаблона"
          extra={getFileExtra()}
          required={isFileRequired}
        >
          <Upload
            beforeUpload={beforeUpload}
            maxCount={1}
            accept=".doc,.docx,.xls,.xlsx,.pdf"
            fileList={file ? [file] : []}
          >
            <Button icon={<UploadOutlined />}>
              {mode === "create" ? "Выберите файл" : "Выберите новый файл"}
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item name="description" label="Описание">
          <Input.TextArea placeholder="Введите описание (необязательно)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
