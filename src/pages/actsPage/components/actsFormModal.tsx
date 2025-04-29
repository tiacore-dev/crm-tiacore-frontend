import React, { useCallback, useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { useActsMutations } from "../../../hooks/acts/useActsMutation";
import { ILegalEntity } from "../../../api/legalEntitiesApi";
import { IAct } from "../../../api/actsApi";
import { IContract } from "../../../api/contractsApi";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import {
  useLegalEntitiesSellers,
  useLegalEntitiesBuyers,
} from "../../../hooks/legalEntities/useLegalEntityQuery";
import { useCompaniesForSelection } from "../../../hooks/companies/useCompanyQuery";

interface ActModalProps {
  visible: boolean;
  onCancel: () => void;
  legalEntitiesData: ILegalEntity[];
  contractsData: IContract[];
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialData?: IAct | null;
}

export const ActFormModal: React.FC<ActModalProps> = ({
  visible,
  onCancel,
  contractsData,
  onSuccess,
  mode = "create",
  initialData = null,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldsLocked, setFieldsLocked] = useState(false);
  const { data: sellersResponse } = useLegalEntitiesSellers();
  const sellers = sellersResponse?.entities || [];
  const { data: buyersResponse } = useLegalEntitiesBuyers();
  const buyers = buyersResponse?.entities || [];
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  const { data: companiesResponse } = useCompaniesForSelection();
  const companies = companiesResponse?.companies || [];
  const { createMutation, updateMutation } = useActsMutations(
    initialData?.act_id || "",
    initialData?.act_number || "",
    initialData?.act_date || 0,
    initialData?.contract || "",
    initialData?.buyer || "",
    initialData?.seller || "",
    initialData?.company || ""
  );

  const handleContractChange = useCallback(
    (contractId: string) => {
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
    },
    [contractsData, form]
  );

  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      const formData = {
        ...values,
        act_date: values.act_date ? values.act_date.valueOf() : null,
        company: isSuperadmin ? values.company : selectedCompanyId, // Автозаполнение для обычных пользователей
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
      // console.error("Validation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    form,
    mode,
    initialData,
    createMutation,
    updateMutation,
    onCancel,
    onSuccess,
  ]);

  useEffect(() => {
    if (visible) {
      if (initialData && mode === "edit") {
        const isLocked = !!initialData.contract;
        form.setFieldsValue({
          act_number: initialData.act_number,
          act_date: initialData.act_date ? dayjs(initialData.act_date) : null,
          contract: initialData.contract || undefined,
          buyer: initialData.buyer,
          seller: initialData.seller,
        });
        setFieldsLocked(isLocked);
      } else {
        form.resetFields();
        setFieldsLocked(false);
      }
    }
  }, [visible, initialData, mode, form]);

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
            {buyers.map((entity) => (
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
            {sellers.map((entity) => (
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
