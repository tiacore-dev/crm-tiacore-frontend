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
} from "../../../hooks/legalEntities/useLegalEntity_Query";
import { useCompaniesForSelection } from "../../../hooks/companies/useCompanyQuery";
import { useContractsForSelection } from "../../../hooks/contracts/useContractQuery";

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
  onSuccess,
  mode = "create",
  initialData = null,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldsLocked, setFieldsLocked] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );

  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const { data: companiesResponse } = useCompaniesForSelection();
  const companies = companiesResponse?.companies || [];

  // Запросы данных, зависящих от выбранной компании
  const { data: sellersResponse } = useLegalEntitiesSellers(selectedCompanyId);
  const sellers = sellersResponse?.entities || [];
  const { data: buyersResponse } = useLegalEntitiesBuyers(selectedCompanyId);
  const buyers = buyersResponse?.entities || [];
  const { data: contractsResponse } =
    useContractsForSelection(selectedCompanyId);
  const contractsData = contractsResponse?.contracts || [];

  const { createMutation, updateMutation } = useActsMutations(
    initialData?.act_id || "",
    initialData?.act_number || "",
    initialData?.act_date || 0,
    initialData?.contract || "",
    initialData?.buyer || "",
    initialData?.seller || "",
    initialData?.company || ""
  );

  const handleCompanyChange = useCallback(
    (companyId: string) => {
      setSelectedCompanyId(companyId);
      form.setFieldsValue({
        buyer: undefined,
        seller: undefined,
        contract: undefined,
      });
      setFieldsLocked(false);
    },
    [form]
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
        company: selectedCompanyId, // Используем выбранную компанию
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
  }, [
    form,
    mode,
    initialData,
    createMutation,
    updateMutation,
    onCancel,
    onSuccess,
    selectedCompanyId,
  ]);

  useEffect(() => {
    if (visible) {
      if (initialData && mode === "edit") {
        const isLocked = !!initialData.contract;
        setSelectedCompanyId(initialData.company);
        form.setFieldsValue({
          act_number: initialData.act_number,
          act_date: initialData.act_date ? dayjs(initialData.act_date) : null,
          contract: initialData.contract || undefined,
          buyer: initialData.buyer,
          seller: initialData.seller,
          company: initialData.company,
        });
        setFieldsLocked(isLocked);
      } else {
        form.resetFields();
        setFieldsLocked(false);
        setSelectedCompanyId(
          isSuperadmin ? null : localStorage.getItem("selectedCompanyId")
        );
      }
    }
  }, [visible, initialData, mode, form, isSuperadmin]);

  // Определяем, должны ли быть поля заблокированы (для суперадмина - пока компания не выбрана)
  const fieldsDisabled = isSuperadmin ? !selectedCompanyId : false;

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
          disabled={isSuperadmin && !selectedCompanyId}
        >
          {mode === "create" ? "Создать" : "Сохранить"}
        </Button>,
      ]}
      width={700}
    >
      <Form form={form} layout="vertical">
        {isSuperadmin && (
          <Form.Item
            name="company"
            label="Компания"
            rules={[
              { required: true, message: "Пожалуйста, выберите компанию" },
            ]}
          >
            <Select
              showSearch
              optionFilterProp="children"
              placeholder="Выберите компанию"
              onChange={handleCompanyChange}
            >
              {companies.map((company) => (
                <Select.Option
                  key={company.company_id}
                  value={company.company_id}
                >
                  {company.company_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          name="act_number"
          label="Номер акта"
          rules={[
            { required: true, message: "Пожалуйста, введите номер акта" },
          ]}
        >
          <Input placeholder="Введите номер акта" disabled={fieldsDisabled} />
        </Form.Item>

        <Form.Item
          name="act_date"
          label="Дата"
          rules={[{ required: true, message: "Пожалуйста, выберите дату" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="DD.MM.YYYY"
            disabled={fieldsDisabled}
          />
        </Form.Item>

        <Form.Item name="contract" label="Договор (необязательно)">
          <Select
            showSearch
            optionFilterProp="children"
            placeholder="Выберите договор (необязательно)"
            allowClear
            onChange={handleContractChange}
            disabled={fieldsDisabled || fieldsLocked}
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
            disabled={fieldsDisabled || fieldsLocked}
          >
            {buyers.map((entity) => (
              <Select.Option
                key={entity.legal_entity_id}
                value={entity.legal_entity_id}
              >
                {entity.short_name}
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
            disabled={fieldsDisabled || fieldsLocked}
          >
            {sellers.map((entity) => (
              <Select.Option
                key={entity.legal_entity_id}
                value={entity.legal_entity_id}
              >
                {entity.short_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
