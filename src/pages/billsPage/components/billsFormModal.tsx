import React, { useCallback, useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { useBillMutations } from "../../../hooks/bills/useBillMutation";
import { IBill } from "../../../api/billsApi";
import { IContract } from "../../../api/contractsApi";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import {
  useLegalEntitiesSellers,
  useLegalEntitiesBuyers,
} from "../../../hooks/legalEntities/useLegalEntity_Query";
import { useBankAccountQuery } from "../../../hooks/bankAccounts/useBankAccountQuery";
import { useCompaniesForSelection } from "../../../hooks/companies/useCompanyQuery";
import { useContractsForSelection } from "../../../hooks/contracts/useContractQuery";

interface BillModalProps {
  visible: boolean;
  onCancel: () => void;
  contractsData: IContract[];
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialData?: IBill | null;
}

export const BillCreateModal: React.FC<BillModalProps> = ({
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
  const [bankAccountsDisabled, setBankAccountsDisabled] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );

  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const defaultCompanyId = localStorage.getItem("selectedCompanyId");

  // Запросы данных
  const { data: companiesResponse } = useCompaniesForSelection();
  const companies = companiesResponse?.companies || [];

  // Запросы данных, зависящих от выбранной компании
  const { data: sellersResponse } = useLegalEntitiesSellers(selectedCompanyId);
  const sellers = sellersResponse?.entities || [];
  const { data: buyersResponse } = useLegalEntitiesBuyers(selectedCompanyId);
  const buyers = buyersResponse?.entities || [];
  const { data: contractsResponse } =
    useContractsForSelection(selectedCompanyId);
  const filteredContracts = contractsResponse?.contracts || [];

  // Запрос банковских счетов с фильтрацией по исполнителю
  const { data: filteredBankAccounts } = useBankAccountQuery({
    legal_entity: selectedSeller || undefined,
  });

  const { createMutation, updateMutation } = useBillMutations(
    initialData?.bill_id || "",
    initialData?.bank_account || "",
    initialData?.bill_number || "",
    initialData?.bill_date || 0,
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
        bank_account: undefined,
      });
      setFieldsLocked(false);
      setBankAccountsDisabled(true);
      setSelectedSeller(null);
    },
    [form]
  );

  const handleSellerChange = (sellerId: string) => {
    setSelectedSeller(sellerId);
    if (sellerId) {
      setBankAccountsDisabled(false);
      form.setFieldsValue({ bank_account: undefined });
    } else {
      setBankAccountsDisabled(true);
      form.setFieldsValue({ bank_account: undefined });
    }
  };

  const handleContractChange = (contractId: string) => {
    if (!contractId) {
      setFieldsLocked(false);
      return;
    }

    const selectedContract = filteredContracts.find(
      (c) => c.contract_id === contractId
    );
    if (selectedContract) {
      form.setFieldsValue({
        buyer: selectedContract.buyer,
        seller: selectedContract.seller,
      });
      setFieldsLocked(true);
      setBankAccountsDisabled(false);
      setSelectedSeller(selectedContract.seller);
    }
  };

  useEffect(() => {
    if (visible) {
      if (initialData && mode === "edit") {
        const isLocked = !!initialData.contract;
        setSelectedCompanyId(initialData.company);
        form.setFieldsValue({
          bank_account: initialData.bank_account,
          bill_number: initialData.bill_number,
          bill_date: initialData.bill_date
            ? dayjs(initialData.bill_date)
            : null,
          contract: initialData.contract || undefined,
          buyer: initialData.buyer,
          seller: initialData.seller,
          company: initialData.company,
        });
        setFieldsLocked(isLocked);
        setBankAccountsDisabled(!initialData.seller);
        setSelectedSeller(initialData.seller || null);
      } else {
        form.resetFields();
        setFieldsLocked(false);
        setBankAccountsDisabled(true);
        setSelectedSeller(null);
        setSelectedCompanyId(isSuperadmin ? null : defaultCompanyId);
      }
    }
  }, [visible, initialData, mode, form, isSuperadmin, defaultCompanyId]);

  // Определяем, должны ли быть поля заблокированы (для суперадмина - пока компания не выбрана)
  const fieldsDisabled = isSuperadmin ? !selectedCompanyId : false;

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      const formData = {
        ...values,
        bill_date: values.bill_date ? values.bill_date.valueOf() : null,
        company: isSuperadmin ? selectedCompanyId : defaultCompanyId,
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
          disabled={isSuperadmin && !selectedCompanyId}
        >
          {mode === "create" ? "Создать" : "Сохранить"}
        </Button>,
      ]}
      width={700}
    >
      <Form form={form} layout="vertical">
        {isSuperadmin && mode === "create" && (
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
          name="bill_number"
          label="Номер счета"
          rules={[
            { required: true, message: "Пожалуйста, введите номер счета" },
          ]}
        >
          <Input placeholder="Введите номер счета" disabled={fieldsDisabled} />
        </Form.Item>

        <Form.Item
          name="bill_date"
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
            {filteredContracts.map((contract) => (
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
            onChange={handleSellerChange}
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
            placeholder={
              bankAccountsDisabled
                ? "Сначала выберите исполнителя"
                : "Выберите банковский счет"
            }
            disabled={bankAccountsDisabled || fieldsDisabled}
            loading={!filteredBankAccounts && !bankAccountsDisabled}
          >
            {(filteredBankAccounts?.bank_accounts || []).map((bank) => (
              <Select.Option
                key={bank.bank_account_id}
                value={bank.bank_account_id}
              >
                {`${bank.account_number} (${bank.bank_name})`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
