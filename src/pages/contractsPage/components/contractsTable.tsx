import { Table, Button, Typography, Tag } from "antd";
import { IContract } from "../../../api/contractsApi";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { FileOutlined } from "@ant-design/icons";
import { useState } from "react";
import { downloadContract } from "../../../api/contractsApi";

interface ContractsTableProps {
  data: {
    total: number;
    contracts: IContract[];
  };
  loading: boolean;
  legalEntitiesData?: {
    legal_entity_id: string;
    legal_entity_name: string;
  }[];
}

export const ContractsTable: React.FC<ContractsTableProps> = ({
  data = { total: 0, contracts: [] },
  loading,
  legalEntitiesData = [],
}) => {
  const navigate = useNavigate();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const getLegalEntityName = (legalEntityId: string) => {
    const legalEntity = legalEntitiesData.find(
      (c) => c.legal_entity_id === legalEntityId
    );
    return legalEntity ? legalEntity.legal_entity_name : legalEntityId;
  };

  const handleDownload = async (contract_id: string) => {
    setDownloadingId(contract_id);
    try {
      const result = await downloadContract(contract_id);
      if (result) {
        const link = document.createElement("a");
        link.href = result;
        link.download = ""; // Можно указать имя файла, если известно
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      // Обработка ошибки
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "Активен";
      case "waiting":
        return "В процессе";
      default:
        return status;
    }
  };

  const columns = [
    {
      title: "Название",
      dataIndex: "contract_name",
      key: "contract_name",
      render: (text: string, record: IContract) => (
        <Button
          type="link"
          onClick={() => navigate(`/contracts/${record.contract_id}`)}
        >
          {text}
        </Button>
      ),
    },
    {
      title: "Дата",
      dataIndex: "contract_date",
      key: "contract_date",
      render: (date: number) => {
        if (!date || isNaN(date)) return "-";
        return dayjs(date).format("DD.MM.YYYY");
      },
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
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const displayStatus = getStatusDisplay(status);
        return (
          <Tag color={status.toLowerCase() === "active" ? "green" : "orange"}>
            {displayStatus}
          </Tag>
        );
      },
    },
    {
      title: "Файл",
      dataIndex: "s3_key",
      key: "s3_key",
      render: (_: string, record: IContract) => {
        if (!record.s3_key) return "-";
        const fileName = record.s3_key.split("/").pop() || "Файл";

        return (
          <Button
            type="link"
            onClick={() => handleDownload(record.contract_id)}
            loading={downloadingId === record.contract_id}
            icon={<FileOutlined />}
          >
            {fileName}
          </Button>
        );
      },
    },
    {
      title: "Комментарий",
      dataIndex: "comment",
      key: "comment",
      render: (comment: string) => comment || "-",
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data.contracts}
        rowKey="contract_id"
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
