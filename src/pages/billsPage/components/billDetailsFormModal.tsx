import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Form, InputNumber, Select } from "antd";
import { IBillDetail } from "../../../api/billDetailsApi";
import { useBillDetailMutations } from "../../../hooks/billDetails/billDetailMutation";
import { useServiceQuery } from "../../../hooks/services/useServiceQuery";

interface BillDetailFormModalProps {
  visible: boolean;
  onCancel: () => void;
  billId: string; // ID акта, к которому относится деталь
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialData?: IBillDetail | null;
}

export const BillDetailFormModal: React.FC<BillDetailFormModalProps> = ({
  visible,
  onCancel,
  billId,
  onSuccess,
  mode = "create",
  initialData = null,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: servicesResponse } = useServiceQuery();

  const { createMutation, updateMutation } = useBillDetailMutations(
    initialData?.bill_detail_id || "",
    initialData?.bill || billId,
    initialData?.service || "",
    initialData?.quantity || 0,
    initialData?.summ || 0
  );

  useEffect(() => {
    if (visible) {
      if (initialData && mode === "edit") {
        form.setFieldsValue({
          service: initialData.service,
          quantity: initialData.quantity,
          summ: initialData.summ,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          bill: billId,
        });
      }
    }
  }, [visible, initialData, mode, form, billId]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();

      if (mode === "create") {
        await createMutation.mutateAsync({
          ...values,
          bill: billId,
        });
      } else if (mode === "edit" && initialData?.bill_detail_id) {
        await updateMutation.mutateAsync({
          ...values,
          bill_detail_id: initialData.bill_detail_id,
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
        <Form.Item name="bill" hidden>
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
              validator: (_, value) => {
                const numValue = Number(value);
                if (isNaN(numValue)) {
                  return Promise.reject("Введите корректное число");
                }
                if (numValue <= 0) {
                  return Promise.reject("Сумма должна быть больше 0");
                }
                return Promise.resolve();
              },
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
