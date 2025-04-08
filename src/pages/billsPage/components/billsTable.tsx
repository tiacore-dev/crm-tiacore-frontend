import { Table, Button, Typography } from "antd";
import { IBill } from "../../../api/billsApi";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

// import dayjs from "dayjs";
// import { FileOutlined } from "@ant-design/icons";
// import { useState } from "react";
// import { downloadContract } from "../../../api/contractsApi";

interface BillsTableProps {
  data: {
    total: number;
    bills: IBill[];
  };
  loading: boolean;
  legalEntitiesData?: {
    legal_entity_id: string;
    legal_entity_name: string;
  }[];
  bankAccountsData?: {
    bank_account_id: string;
    bank_name: string;
  }[];
  contractsData?: {
    contract_id: string;
    contract_name: string;
  }[];
}

export const BillsTable: React.FC<BillsTableProps> = ({
  data = { total: 0, bills: [] },
  loading,
  legalEntitiesData = [],
  bankAccountsData = [],
  contractsData = [],
}) => {
  const navigate = useNavigate();

  const getLegalEntityName = (legalEntityId: string) => {
    const legalEntity = legalEntitiesData.find(
      (c) => c.legal_entity_id === legalEntityId
    );
    return legalEntity ? legalEntity.legal_entity_name : legalEntityId;
  };

  const getBankAccountName = (bankId: string) => {
    const bankAccount = bankAccountsData.find(
      (c) => c.bank_account_id === bankId
    );
    return bankAccount ? bankAccount.bank_name : bankId;
  };

  const getContractName = (contractId: string) => {
    const contract = contractsData.find((c) => c.contract_id === contractId);
    return contract ? contract.contract_name : contractId;
  };

  const columns = [
    {
      title: "Номер счета",
      dataIndex: "bill_number",
      key: "bill_number",
      render: (text: string, record: IBill) => (
        <Button
          type="link"
          onClick={() => navigate(`/bills/${record.bill_id}`)}
        >
          {text}
        </Button>
      ),
    },
    {
      title: "Дата",
      dataIndex: "bill_date",
      key: "bill_date",
      render: (date: number) => dayjs(date).format("DD.MM.YYYY"),
    },
    {
      title: "Банковский счёт",
      dataIndex: "bank_account",
      key: "bank_account",
      render: (bankId: string) => getBankAccountName(bankId),
    },
    {
      title: "Контракт",
      dataIndex: "contract",
      key: "contract",
      render: (contractId?: string) =>
        contractId ? getContractName(contractId) : "-", // Показываем прочерк если нет контракта
    },
    {
      title: "Заказчик",
      dataIndex: "buyer",
      key: "buyer",
      render: (legalEntityId: string) => getLegalEntityName(legalEntityId),
    },
    {
      title: "Исполнитель",
      dataIndex: "seller",
      key: "seller",
      render: (legalEntityId: string) => getLegalEntityName(legalEntityId),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data.bills}
        rowKey="bill_id"
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
