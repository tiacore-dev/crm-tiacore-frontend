import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import { useActsMutations } from "../../../hooks/acts/useActsMutation";
import { ILegalEntity } from "../../../api/legalEntitiesApi";
import { IBankAccount } from "../../../api/bankAccountsApi";
import { IAct } from "../../../api/actsApi";
import { IContract } from "../../../api/contractsApi";
import { DatePicker } from "antd";
import dayjs from "dayjs";

interface ActModalProps {
  visible: boolean;
  onCancel: () => void;
  legalEntitiesData: ILegalEntity[];
  contractsData: IContract[];
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialData?: IAct | null;
}

export const ActCreateModal: React.FC<ActModalProps> = ({
  visible,
  onCancel,
  legalEntitiesData,
  contractsData,
  onSuccess,
  mode = "create",
  initialData = null,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createMutation, updateMutation } = useActsMutations(
    initialData?.act_id || "",
    initialData?.act_number || "",
    initialData?.act_date || 0,
    initialData?.contract || "",
    initialData?.buyer || "",
    initialData?.seller || ""
  );

  useEffect(() => {
    if (initialData && mode === "edit") {
      form.setFieldsValue({
        act_number: initialData.act_number,
        act_date: initialData.act_date ? dayjs(initialData.act_date) : null,
        contract: initialData.contract || undefined,
        buyer: initialData.buyer,
        seller: initialData.seller,
      });
    } else {
      form.resetFields();
    }
  }, [initialData, mode, form]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();

      const formData = {
        ...values,
        act_date: values.act_date ? values.act_date.valueOf() : null,
      };

      if (mode === "create") {
        await createMutation.mutateAsync(formData);
      } else if (mode === "edit" && initialData?.act_id) {
        await updateMutation.mutateAsync(formData);
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
      title={mode === "create" ? "Добавить акт" : "Редактировать акт"}
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
        <Form.Item
          name="act_number"
          label="Номер акта"
          rules={[
            { required: true, message: "Пожалуйста, введите номер акта" },
            { min: 3, message: "Минимальная длина - 3 символа" },
          ]}
        >
          <Input placeholder="Введите номер акта" />
        </Form.Item>
        <Form.Item
          name="act_date"
          label="Дата"
          rules={[{ required: true, message: "Пожалуйста, выберите дату" }]}
        >
          <DatePicker style={{ width: "100%" }} format="DD.MM.YYYY" />
        </Form.Item>
        <Form.Item name="contract" label="Контракт (необязательно)">
          <Select
            placeholder="Выберите контракт (необязательно)"
            options={contractsData.map((contract) => ({
              value: contract.contract_id,
              label: contract.contract_name,
            }))}
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="buyer"
          label="Заказчик"
          rules={[
            { required: true, message: "Пожалуйста, выберите заказчика" },
          ]}
        >
          <Select
            placeholder="Выберите заказчика"
            options={legalEntitiesData.map((entity) => ({
              value: entity.legal_entity_id,
              label: entity.legal_entity_name,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="seller"
          label="Исполнитель"
          rules={[
            { required: true, message: "Пожалуйста, выберите исполнителя" },
          ]}
        >
          <Select
            placeholder="Выберите исполнителя"
            options={legalEntitiesData.map((entity) => ({
              value: entity.legal_entity_id,
              label: entity.legal_entity_name,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
