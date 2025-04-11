//bankaccountstablecolumns
import { Button, Select, Input } from "antd";
import { ColumnType } from "antd/es/table";
import { IBankAccount } from "../../../api/bankAccountsApi";
import { NavigateFunction } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";

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
  const getLegalEntityName = (legalEntityId: string): string => {
    const legalEntity = legalEntitiesData.find(
      (c) => c.legal_entity_id === legalEntityId
    );
    return legalEntity ? legalEntity.legal_entity_name : legalEntityId;
  };

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
      title: "Юр. лицо",
      dataIndex: "legal_entity",
      key: "legal_entity",
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      render: getLegalEntityName,
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Select
            showSearch
            allowClear
            placeholder="Фильтр по юр. лицу"
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
    // {
    //   title: "БИК",
    //   dataIndex: "bank_bic",
    //   key: "bank_bic",
    // },
    // {
    //   title: "Корреспондентский счет",
    //   dataIndex: "bank_corr_account",
    //   key: "bank_corr_account",
    // },
  ];
};
