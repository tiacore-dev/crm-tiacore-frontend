//contractDetailsCard
import React from "react";
import { Descriptions, Space, Tag } from "antd";
import { Link } from "react-router-dom";
import { ExportOutlined, DownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { IContract } from "../../../api/contractsApi";
import { usePermissions } from "../../../context/permissionsContext";
import { useCompany } from "../../../context/companyContext";

interface ContractDetailsCardProps {
  contract: IContract;
  getEntityNameById: (id: string | undefined) => string | undefined;
  getContractStatusById: (id: string) => string;
  handleDownload: () => void;
}

export const ContractDetailsCard: React.FC<ContractDetailsCardProps> = ({
  contract,
  getEntityNameById,
  getContractStatusById,
  handleDownload,
}) => {
  const { currentAppPermissions } = useCompany();
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";

  return (
    <Descriptions bordered column={1}>
      <Descriptions.Item label="Название">
        {contract.contract_name}
      </Descriptions.Item>
      <Descriptions.Item label="Дата">
        {dayjs(contract.contract_date).format("DD.MM.YYYY") || "—"}
      </Descriptions.Item>
      <Descriptions.Item label="Заказчик">
        {getEntityNameById(contract.buyer)}
        {"  "}
        {contract.buyer && (
          <Link to={`/legal_entities/${contract.buyer}`}>
            <ExportOutlined />
          </Link>
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Исполнитель">
        {getEntityNameById(contract.seller)}
        {"  "}
        {contract.seller && (
          <Link to={`/legal_entities/${contract.seller}`}>
            <ExportOutlined />
          </Link>
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Статус">
        <Tag
          color={
            contract.status.toLowerCase() === "active" ? "green" : "orange"
          }
        >
          {getContractStatusById(contract.status)}{" "}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Коментарий">
        {contract.comment || "—"}
      </Descriptions.Item>
      <Descriptions.Item label="Файл">
        {contract.s3_key ? (
          <Space>
            <span>{contract.s3_key.split("/").pop()}</span>

            {(isSuperadmin ||
              currentAppPermissions.includes("download_contract")) && (
              <DownloadOutlined
                onClick={handleDownload}
                style={{
                  color: "#1890ff",
                  cursor: "pointer",
                }}
                title="Скачать"
              />
            )}
          </Space>
        ) : (
          "Файл отсутствует"
        )}
      </Descriptions.Item>
    </Descriptions>
  );
};
