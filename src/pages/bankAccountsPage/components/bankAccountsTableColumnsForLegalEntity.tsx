import { Button, Input, Dropdown } from "antd";
import { ColumnType } from "antd/es/table";
import { IBankAccount } from "../../../api/bankAccountsApi";
import { NavigateFunction } from "react-router-dom";
import {
  SearchOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

interface BankAccountsTableColumnsForLegalEntityProps {
  navigate: NavigateFunction;
  bankName: string;
  accountNumber: string;
  legalEntityId: string;
  onBankNameChange: (value: string) => void;
  onAccountNumberChange: (value: string) => void;
  onEdit: (account: IBankAccount) => void;
  onDelete: (account: IBankAccount) => void;
  hasPermission: (permission: string) => boolean; // Добавляем параметр
}

export const getBankAccountsTableColumnsForLegalEntity = ({
  navigate,
  accountNumber,
  bankName,
  legalEntityId,
  onAccountNumberChange,
  onBankNameChange,
  onEdit,
  onDelete,
  hasPermission, // Получаем функцию проверки прав
}: BankAccountsTableColumnsForLegalEntityProps): ColumnType<IBankAccount>[] => {
  const getMenuItems = (account: IBankAccount) => {
    const items = [];

    if (hasPermission("edit_bank_account")) {
      items.push({
        key: "edit",
        icon: <EditOutlined />,
        label: "Редактировать",
        onClick: () => onEdit(account),
      });
    }

    if (hasPermission("delete_bank_account")) {
      items.push({
        key: "delete",
        icon: <DeleteOutlined />,
        label: "Удалить",
        danger: true,
        onClick: () => onDelete(account),
      });
    }

    return items;
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
      render: (text: string) => text,
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
      render: (text: string) => text || "—",
    },
    {
      title: "Корреспондентский счет",
      dataIndex: "bank_corr_account",
      key: "bank_corr_account",
      render: (text: string) => text || "—",
    },
    {
      title: "",
      key: "actions",
      width: 40,
      render: (_: any, record: IBankAccount) => {
        const menuItems = getMenuItems(record);
        if (menuItems.length === 0) return null; // Не показываем кнопку, если нет доступных действий

        return (
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button
              type="text"
              icon={<MoreOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        );
      },
    },
  ];
};
