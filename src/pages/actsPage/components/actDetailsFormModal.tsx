import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Form, InputNumber, Select } from "antd";
import { IActDetail } from "../../../api/actDetailsApi";
import { useActDetailMutations } from "../../../hooks/actDetails/actDetailMutation";
import { useServiceQuery } from "../../../hooks/services/useServiceQuery";

interface ActDetailFormModalProps {
  visible: boolean;
  onCancel: () => void;
  actId: string; // ID акта, к которому относится деталь
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialData?: IActDetail | null;
}

export const ActDetailFormModal: React.FC<ActDetailFormModalProps> = ({
  visible,
  onCancel,
  actId,
  onSuccess,
  mode = "create",
  initialData = null,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: servicesResponse } = useServiceQuery();

  const { createMutation, updateMutation } = useActDetailMutations(
    initialData?.act_detail_id || "",
    initialData?.act || actId,
    initialData?.service || "",
    initialData?.quantity || 0,
    initialData?.summ || 0
  );

  useEffect(() => {
    if (initialData && mode === "edit") {
      form.setFieldsValue({
        service: initialData.service,
        quantity: initialData.quantity,
        summ: initialData.summ,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        act: actId, // Устанавливаем ID акта по умолчанию
      });
    }
  }, [initialData, mode, form, actId]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();

      if (mode === "create") {
        await createMutation.mutateAsync({
          ...values,
          act: actId, // Убедимся, что используется правильный actId
        });
      } else if (mode === "edit" && initialData?.act_detail_id) {
        await updateMutation.mutateAsync({
          ...values,
          act_detail_id: initialData.act_detail_id,
        });
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
      title={mode === "create" ? "Добавить" : "Редактировать"}
      open={visible}
      onOk={form.submit}
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
        <Form.Item name="act" hidden>
          <Input type="hidden" />
        </Form.Item>

        <Form.Item
          name="service"
          label="Услуга"
          rules={[{ required: true, message: "Пожалуйста, выберите услугу" }]}
        >
          <Select
            placeholder="Выберите услугу"
            options={servicesResponse?.services.map((service) => ({
              value: service.service_id,
              label: service.service_name,
            }))}
            showSearch
            optionFilterProp="label"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Количество"
          rules={[
            { required: true, message: "Пожалуйста, введите количество" },
            {
              type: "number",
              min: 1,
              message: "Количество должно быть больше 0",
            },
          ]}
        >
          <InputNumber
            placeholder="Введите количество"
            style={{ width: "100%" }}
            min={1}
          />
        </Form.Item>

        <Form.Item
          name="summ"
          label="Сумма(₽)"
          rules={[
            { required: true, message: "Пожалуйста, введите сумму" },
            {
              type: "number",
              min: 1,
              message: "Сумма должна быть больше 0",
            },
          ]}
        >
          <InputNumber
            placeholder="Введите сумму(₽)"
            style={{ width: "100%" }}
            min={1}
            max={99999999}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
