import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import { useBillMutations } from "../../../hooks/bills/useBillMutation";
import { ILegalEntity } from "../../../api/legalEntitiesApi";
import { IBankAccount } from "../../../api/bankAccountsApi";
import { IBill } from "../../../api/billsApi";
import { IContract } from "../../../api/contractsApi";
import { DatePicker } from "antd";
import dayjs from "dayjs";

interface BillModalProps {
  visible: boolean;
  onCancel: () => void;
  legalEntitiesData: ILegalEntity[];
  bankAccountsData: IBankAccount[];
  contractsData: IContract[];
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialData?: IBill | null;
}

export const BillCreateModal: React.FC<BillModalProps> = ({
  visible,
  onCancel,
  legalEntitiesData,
  bankAccountsData,
  contractsData,
  onSuccess,
  mode = "create",
  initialData = null,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createMutation, updateMutation } = useBillMutations(
    initialData?.bill_id || "",
    initialData?.bank_account || "",
    initialData?.bill_number || "",
    initialData?.bill_date || 0,
    initialData?.contract || "",
    initialData?.buyer || "",
    initialData?.seller || ""
  );

  useEffect(() => {
    if (initialData && mode === "edit") {
      form.setFieldsValue({
        bank_account: initialData.bank_account,
        bill_number: initialData.bill_number,
        bill_date: initialData.bill_date ? dayjs(initialData.bill_date) : null,
        contract: initialData.contract || undefined, // Явно указываем undefined для необязательного поля
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

      // Преобразуем дату в timestamp
      const formData = {
        ...values,
        bill_date: values.bill_date ? values.bill_date.valueOf() : null,
        // contract будет включен только если есть значение
      };

      if (mode === "create") {
        await createMutation.mutateAsync(formData);
      } else if (mode === "edit" && initialData?.bill_id) {
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
      title={mode === "create" ? "Добавить счёт" : "Редактировать счёт"}
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
          name="bank_account"
          label="Банковский счет"
          rules={[
            {
              required: true,
              message: "Пожалуйста, выберите банковский счет",
            },
          ]}
        >
          <Select
            placeholder="Выберите банковский счет"
            options={bankAccountsData.map((bank) => ({
              value: bank.bank_account_id,
              label: bank.bank_name,
            }))}
            // disabled={mode === "edit"} // Можно запретить менять юр. лицо при редактировании
          />
        </Form.Item>

        <Form.Item
          name="bill_number"
          label="Номер счета"
          rules={[
            { required: true, message: "Пожалуйста, введите номер счета" },
            { min: 3, message: "Минимальная длина - 3 символа" },
          ]}
        >
          <Input placeholder="Введите номер счета" />
        </Form.Item>

        <Form.Item
          name="bill_date"
          label="Дата"
          rules={[{ required: true, message: "Пожалуйста, выберите дату" }]}
        >
          <DatePicker style={{ width: "100%" }} format="DD.MM.YYYY" />
        </Form.Item>
        <Form.Item
          name="contract"
          label="Контракт (необязательно)"
          // Убираем правило required
        >
          <Select
            placeholder="Выберите контракт (необязательно)"
            options={contractsData.map((contract) => ({
              value: contract.contract_id,
              label: contract.contract_name,
            }))}
            allowClear // Добавляем возможность очистить выбор
          />
        </Form.Item>
        <Form.Item
          name="buyer"
          label="Заказчик"
          rules={[
            {
              required: true,
              message: "Пожалуйста, выберите заказчика",
            },
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
            {
              required: true,
              message: "Пожалуйста, выберите исполнителя",
            },
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
