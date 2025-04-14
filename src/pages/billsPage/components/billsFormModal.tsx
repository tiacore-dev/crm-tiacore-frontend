import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
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
  const [fieldsLocked, setFieldsLocked] = useState(false);

  const { createMutation, updateMutation } = useBillMutations(
    initialData?.bill_id || "",
    initialData?.bank_account || "",
    initialData?.bill_number || "",
    initialData?.bill_date || 0,
    initialData?.contract || "",
    initialData?.buyer || "",
    initialData?.seller || ""
  );

  const handleContractChange = (contractId: string) => {
    if (!contractId) {
      setFieldsLocked(false);
      return;
    }

    const selectedContract = contractsData.find(
      (c) => c.contract_id === contractId
    );
    if (selectedContract) {
      form.setFieldsValue({
        buyer: selectedContract.buyer,
        seller: selectedContract.seller,
      });
      setFieldsLocked(true);
    }
  };

  useEffect(() => {
    if (initialData && mode === "edit") {
      const isLocked = !!initialData.contract;
      form.setFieldsValue({
        bank_account: initialData.bank_account,
        bill_number: initialData.bill_number,
        bill_date: initialData.bill_date ? dayjs(initialData.bill_date) : null,
        contract: initialData.contract || undefined,
        buyer: initialData.buyer,
        seller: initialData.seller,
      });
      setFieldsLocked(isLocked);
    } else {
      form.resetFields();
      setFieldsLocked(false);
    }
  }, [initialData, mode, form]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      const formData = {
        ...values,
        bill_date: values.bill_date ? values.bill_date.valueOf() : null,
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
            showSearch
            optionFilterProp="children"
            placeholder="Выберите банковский счет"
          >
            {bankAccountsData.map((bank) => (
              <Select.Option
                key={bank.bank_account_id}
                value={bank.bank_account_id}
              >
                {bank.bank_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="bill_number"
          label="Номер счета"
          rules={[
            { required: true, message: "Пожалуйста, введите номер счета" },
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

        <Form.Item name="contract" label="Договор (необязательно)">
          <Select
            showSearch
            optionFilterProp="children"
            placeholder="Выберите договор (необязательно)"
            allowClear
            onChange={handleContractChange}
          >
            {contractsData.map((contract) => (
              <Select.Option
                key={contract.contract_id}
                value={contract.contract_id}
              >
                {contract.contract_name}
              </Select.Option>
            ))}
          </Select>
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
            showSearch
            optionFilterProp="children"
            placeholder="Выберите заказчика"
            disabled={fieldsLocked}
          >
            {legalEntitiesData.map((entity) => (
              <Select.Option
                key={entity.legal_entity_id}
                value={entity.legal_entity_id}
              >
                {entity.legal_entity_name}
              </Select.Option>
            ))}
          </Select>
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
            showSearch
            optionFilterProp="children"
            placeholder="Выберите исполнителя"
            disabled={fieldsLocked}
          >
            {legalEntitiesData.map((entity) => (
              <Select.Option
                key={entity.legal_entity_id}
                value={entity.legal_entity_id}
              >
                {entity.legal_entity_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
