import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import { useBankAccountMutations } from "../../../hooks/bankAccounts/useBankAccountMutation";
import { ILegalEntity } from "../../../api/legalEntitiesApi";
import { IBankAccount } from "../../../api/bankAccountsApi";

interface BankAccountCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  legalEntitiesData: ILegalEntity[];
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialData?: IBankAccount | null;
}

export const BankAccountCreateModal: React.FC<BankAccountCreateModalProps> = ({
  visible,
  onCancel,
  legalEntitiesData,
  onSuccess,
  mode = "create",
  initialData = null,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createMutation, updateMutation } = useBankAccountMutations(
    initialData?.bank_account_id || "",
    initialData?.legal_entity || "",
    initialData?.bank_name || "",
    initialData?.account_number || "",
    initialData?.bank_bic || "",
    initialData?.bank_corr_account || ""
  );

  useEffect(() => {
    if (initialData && mode === "edit") {
      form.setFieldsValue({
        legal_entity: initialData.legal_entity,
        bank_name: initialData.bank_name,
        account_number: initialData.account_number,
        bank_bic: initialData.bank_bic,
        bank_corr_account: initialData.bank_corr_account,
      });
    } else {
      form.resetFields();
    }
  }, [initialData, mode, form]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();

      if (mode === "create") {
        await createMutation.mutateAsync(values);
      } else if (mode === "edit" && initialData?.bank_account_id) {
        await updateMutation.mutateAsync(values);
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
      title={
        mode === "create"
          ? "Добавить банковский счёт"
          : "Редактировать банковский счёт"
      }
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
          name="legal_entity"
          label="Юридическое лицо"
          rules={[
            {
              required: true,
              message: "Пожалуйста, выберите юридическое лицо",
            },
          ]}
        >
          <Select
            placeholder="Выберите юридическое лицо"
            options={legalEntitiesData.map((entity) => ({
              value: entity.legal_entity_id,
              label: entity.legal_entity_name,
            }))}
            // disabled={mode === "edit"} // Можно запретить менять юр. лицо при редактировании
          />
        </Form.Item>

        <Form.Item
          name="bank_name"
          label="Название банка"
          rules={[
            { required: true, message: "Пожалуйста, введите название банка" },
            { min: 3, message: "Минимальная длина - 3 символа" },
            { max: 255, message: "Максимальная длина - 255 символов" },
          ]}
        >
          <Input placeholder="Введите название банка" />
        </Form.Item>

        <Form.Item
          name="account_number"
          label="Номер счета"
          rules={[
            { required: true, message: "Пожалуйста, введите номер счета" },
            { len: 20, message: "Номер счета должен содержать 20 символов" },
          ]}
        >
          <Input placeholder="Введите номер счета (20 символов)" />
        </Form.Item>

        <Form.Item
          name="bank_bic"
          label="БИК банка"
          rules={[
            { required: true, message: "Пожалуйста, введите БИК банка" },
            { len: 9, message: "БИК банка должен содержать 9 символов" },
          ]}
        >
          <Input placeholder="Введите БИК банка (9 символов)" />
        </Form.Item>

        <Form.Item
          name="bank_corr_account"
          label="Корреспондентский счет"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите корреспондентский счет",
            },
            {
              len: 20,
              message: "Корреспондентский счет должен содержать 20 символов",
            },
          ]}
        >
          <Input placeholder="Введите корреспондентский счет (20 символов)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
