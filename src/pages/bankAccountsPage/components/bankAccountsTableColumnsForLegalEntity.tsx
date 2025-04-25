// bankAccountsTableColumnsForLegalEntity.tsx
import { Button, Input } from "antd";
import { ColumnType } from "antd/es/table";
import { IBankAccount } from "../../../api/bankAccountsApi";
import { NavigateFunction } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";

interface BankAccountsTableColumnsForLegalEntityProps {
  navigate: NavigateFunction;
  bankName: string;
  accountNumber: string;
  legalEntityId: string;
  onBankNameChange: (value: string) => void;
  onAccountNumberChange: (value: string) => void;
}

export const getBankAccountsTableColumnsForLegalEntity = ({
  navigate,
  accountNumber,
  bankName,
  legalEntityId,
  onAccountNumberChange,
  onBankNameChange,
}: BankAccountsTableColumnsForLegalEntityProps): ColumnType<IBankAccount>[] => {
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
          onClick={() =>
            navigate(
              `/legal_entities/${legalEntityId}/${record.bank_account_id}`
            )
          }
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
    {
      title: "БИК",
      dataIndex: "bank_bic",
      key: "bank_bic",
      render: (text: string) => text || "—", // Отображаем прочерк, если значение отсутствует
    },
    {
      title: "Корреспондентский счет",
      dataIndex: "bank_corr_account",
      key: "bank_corr_account",
      render: (text: string) => text || "—", // Отображаем прочерк, если значение отсутствует
    },
  ];
};
