import { Table, Button, Typography } from "antd";
import { IBankAccount } from "../../../api/bankAccountsApi";
import { useNavigate } from "react-router-dom";
// import dayjs from "dayjs";
// import { FileOutlined } from "@ant-design/icons";
// import { useState } from "react";
// import { downloadContract } from "../../../api/contractsApi";

interface BankAccountsTableProps {
  data: {
    total: number;
    bank_accounts: IBankAccount[];
  };
  loading: boolean;
  legalEntitiesData?: {
    legal_entity_id: string;
    legal_entity_name: string;
  }[];
}

export const BankAccountsTable: React.FC<BankAccountsTableProps> = ({
  data = { total: 0, bank_accounts: [] },
  loading,
  legalEntitiesData = [],
}) => {
  const navigate = useNavigate();

  const getLegalEntityName = (legalEntityId: string) => {
    const legalEntity = legalEntitiesData.find(
      (c) => c.legal_entity_id === legalEntityId
    );
    return legalEntity ? legalEntity.legal_entity_name : legalEntityId;
  };

  const columns = [
    {
      title: "Название банка",
      dataIndex: "bank_name",
      key: "bank_name",
      render: (text: string, record: IBankAccount) => (
        <Button
          type="link"
          onClick={() => navigate(`/bank_accounts/${record.bank_account_id}`)}
        >
          {text}
        </Button>
      ),
    },
    {
      title: "Юр. лицо",
      dataIndex: "legal_entity",
      key: "legal_entity",
      render: (legalEntityId: string) => getLegalEntityName(legalEntityId),
    },
    {
      title: "Номер аккаунта",
      dataIndex: "account_number",
      key: "account_number",
    },
    {
      title: "БИК",
      dataIndex: "bank_bic",
      key: "bank_bic",
    },
    {
      title: "Корреспондентский счет",
      dataIndex: "bank_corr_account",
      key: "bank_corr_account",
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data.bank_accounts}
        rowKey="bank_account_id"
        loading={loading}
        pagination={{
          total: data.total,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total) => (
            <Typography.Text>Всего: {total}</Typography.Text>
          ),
        }}
      />
    </div>
  );
};
