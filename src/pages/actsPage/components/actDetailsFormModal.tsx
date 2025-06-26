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
  initialData: IActDetail | undefined;
  companyId: string;
}
// 413dc777-a4c1-4b75-8176-88c8c967d453
export const ActDetailFormModal: React.FC<ActDetailFormModalProps> = ({
  visible,
  onCancel,
  actId,
  onSuccess,
  mode = "create",
  initialData,
  companyId,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: servicesResponse } = useServiceQuery(companyId);
  const { createMutation, updateMutation } = useActDetailMutations(
    initialData?.act_detail_id || "",
    initialData?.act || actId,
    initialData?.service || "",
    initialData?.quantity || 0,
    initialData?.summ || 0,
    initialData?.price || 0
  );

  useEffect(() => {
    if (visible) {
      if (initialData && mode === "edit") {
        form.setFieldsValue({
          service: initialData.service,
          quantity: initialData.quantity,
          price: initialData.price,
          summ: initialData.summ,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          act: actId,
        });
      }
    }
  }, [visible, initialData, mode, form, actId]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();

      if (mode === "create") {
        await createMutation.mutateAsync({
          ...values,
          act: actId,
          summ: values.quantity * values.price, // Calculate summ
        });
      } else if (mode === "edit" && initialData?.act_detail_id) {
        // Prepare only changed fields
        const updatedFields: {
          service?: string;
          quantity?: number;
          price?: number;
        } = {};

        if (values.service !== initialData.service) {
          updatedFields.service = values.service;
        }

        if (values.quantity !== initialData.quantity) {
          updatedFields.quantity = values.quantity;
        }

        if (values.price !== initialData.price) {
          updatedFields.price = values.price;
        }

        // Only send request if there are changes
        if (Object.keys(updatedFields).length > 0) {
          await updateMutation.mutateAsync(updatedFields);
        } else {
          // toast.success("Нет изменений для сохранения");
        }
      }

      form.resetFields();
      onCancel();
      if (onSuccess) onSuccess();
    } catch (error) {
      // console.error("Validation failed:", error);
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
        {mode === "create" && (
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
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
        )}

        <Form.Item
          name="quantity"
          label="Количество"
          rules={[
            { required: true, message: "Пожалуйста, введите цену" },
            {
              validator: (_, value) => {
                const numValue = Number(value);
                if (isNaN(numValue)) {
                  return Promise.reject("Введите корректное число");
                }
                if (numValue <= 0) {
                  return Promise.reject("Цена должна быть больше 0");
                }
                return Promise.resolve();
              },
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
          name="price"
          label="Цена(₽)"
          rules={[
            { required: true, message: "Пожалуйста, введите цену" },
            {
              validator: (_, value) => {
                const numValue = Number(value);
                if (isNaN(numValue)) {
                  return Promise.reject("Введите корректное число");
                }
                if (numValue <= 0) {
                  return Promise.reject("Цена должна быть больше 0");
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            placeholder="Введите цену(₽)"
            style={{ width: "100%" }}
            min={1}
            max={99999999}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
