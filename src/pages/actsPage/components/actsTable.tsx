import { Table, Button, Typography } from "antd";
// import { IBill } from "../../../api/billsApi";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { IAct } from "../../../api/actsApi";

// import dayjs from "dayjs";
// import { FileOutlined } from "@ant-design/icons";
// import { useState } from "react";
// import { downloadContract } from "../../../api/contractsApi";

interface ActsTableProps {
  data: {
    total: number;
    acts: IAct[];
  };
  loading: boolean;
  legalEntitiesData?: {
    legal_entity_id: string;
    legal_entity_name: string;
  }[];
  contractsData?: {
    contract_id: string;
    contract_name: string;
  }[];
}

export const ActsTable: React.FC<ActsTableProps> = ({
  data = { total: 0, acts: [] },
  loading,
  legalEntitiesData = [],
  contractsData = [],
}) => {
  const navigate = useNavigate();

  const getLegalEntityName = (legalEntityId: string) => {
    const legalEntity = legalEntitiesData.find(
      (c) => c.legal_entity_id === legalEntityId
    );
    return legalEntity ? legalEntity.legal_entity_name : legalEntityId;
  };

  const getContractName = (contractId: string) => {
    const contract = contractsData.find((c) => c.contract_id === contractId);
    return contract ? contract.contract_name : contractId;
  };

  const columns = [
    {
      title: "Номер акта",
      dataIndex: "act_number",
      key: "act_number",
      render: (text: string, record: IAct) => (
        <Button type="link" onClick={() => navigate(`/acts/${record.act_id}`)}>
          {text}
        </Button>
      ),
    },
    {
      title: "Дата",
      dataIndex: "act_date",
      key: "act_date",
      render: (date: number) => dayjs(date).format("DD.MM.YYYY"),
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
        dataSource={data.acts}
        rowKey="act_id"
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
