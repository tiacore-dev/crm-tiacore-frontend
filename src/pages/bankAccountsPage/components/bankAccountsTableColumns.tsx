import { Button, Select, Input } from "antd";
import { ColumnType } from "antd/es/table";
import { IBankAccount } from "../../../api/bankAccountsApi";
import { NavigateFunction } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { getEntityNameById } from "../../../utils/infoById"; // Добавить импорт

interface BankAccountsTableColumnsProps {
  legalEntitiesData: {
    legal_entity_id: string;
    legal_entity_name: string;
  }[];
  navigate: NavigateFunction;
  legalEntity: string;
  bankName: string;
  accountNumber: string;
  onLegalEntityChange: (value: string) => void;
  onBankNameChange: (value: string) => void;
  onAccountNumberChange: (value: string) => void;
}

export const getBankAccountsTableColumns = ({
  legalEntitiesData,
  navigate,
  legalEntity,
  bankName,
  accountNumber,
  onLegalEntityChange,
  onBankNameChange,
  onAccountNumberChange,
}: BankAccountsTableColumnsProps): ColumnType<IBankAccount>[] => {
  return [
    {
      title: "Номер счёта",
      dataIndex: "account_number",
      key: "account_number",
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      sorter: (a: IBankAccount, b: IBankAccount) =>
        a.account_number.localeCompare(b.account_number),
      sortDirections: ["ascend", "descend"],
      render: (text: string, record: IBankAccount) => (
        <Button
          type="link"
          onClick={() => navigate(`/bank_accounts/${record.bank_account_id}`)}
        >
          {text}
        </Button>
      ),
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по номеру счёта"
            value={accountNumber}
            onChange={(e) => onAccountNumberChange(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
        </div>
      ),
      filteredValue: accountNumber ? [accountNumber] : null,
    },
    {
      title: "Контрагент",
      dataIndex: "legal_entity",
      key: "legal_entity",
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      sorter: (a: IBankAccount, b: IBankAccount) => {
        const nameA =
          getEntityNameById(a.legal_entity, legalEntitiesData) ||
          a.legal_entity;
        const nameB =
          getEntityNameById(b.legal_entity, legalEntitiesData) ||
          b.legal_entity;
        return nameA.localeCompare(nameB);
      },
      sortDirections: ["ascend", "descend"],
      render: (legalEntityId: string) =>
        getEntityNameById(legalEntityId, legalEntitiesData) || legalEntityId,
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Select
            showSearch
            allowClear
            placeholder="Фильтр по контрагенту"
            value={legalEntity || undefined}
            onChange={(value) => onLegalEntityChange(value || "")}
            style={{ width: 200 }}
            options={legalEntitiesData.map((c) => ({
              label: c.legal_entity_name,
              value: c.legal_entity_id,
            }))}
            filterOption={(input, option) =>
              (option?.label as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        </div>
      ),
      filteredValue: legalEntity ? [legalEntity] : null,
    },
    {
      title: "Название банка",
      dataIndex: "bank_name",
      key: "bank_name",
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      sorter: (a: IBankAccount, b: IBankAccount) =>
        a.bank_name.localeCompare(b.bank_name),
      sortDirections: ["ascend", "descend"],
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Фильтр по банку"
            value={bankName}
            onChange={(e) => onBankNameChange(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
        </div>
      ),
      filteredValue: bankName ? [bankName] : null,
    },
  ];
};
