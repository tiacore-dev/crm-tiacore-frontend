import { Table, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { IContract } from "../../../api/contractsApi";
import { useState } from "react";
import { downloadContract } from "../../../api/contractsApi";
import { getContractsTableColumns } from "./contractsTableColumns";
import { useCompany } from "../../../context/companyContext";

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
  contractStatusesData?: {
    contract_status_id: string;
    status_name: string;
  }[];
  currentPage: number;
  pageSize: number;
  sortBy?: string;
  order?: string;
  filters?: {
    buyer?: string;
    seller?: string;
    status?: string;
    contract_date_from?: number;
    contract_date_to?: number;
  };
  onTableChange: (pagination: any, filters: any, sorter: any) => void;
  onSortChange: (sortBy: string, order: string) => void;
  onFilterChange: (field: string, value: any) => void;
}

export const ContractsTable: React.FC<ContractsTableProps> = ({
  data = { total: 0, contracts: [] },
  loading,
  legalEntitiesData = [],
  contractStatusesData = [],
  currentPage,
  pageSize,
  sortBy,
  order,
  filters,
  onTableChange,
  onSortChange,
  onFilterChange,
}) => {
  const navigate = useNavigate();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { currentAppPermissions } = useCompany();

  const handleDownload = async (contract_id: string) => {
    if (!currentAppPermissions.includes("download_contract")) return;

    setDownloadingId(contract_id);
    try {
      const result = await downloadContract(contract_id);
      if (result) {
        const link = document.createElement("a");
        link.href = result;
        link.download = "";
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

  const columns = getContractsTableColumns({
    legalEntitiesData,
    contractStatusesData,
    navigate,
    handleDownload,
    downloadingId,
    sortBy,
    order,
    onSortChange,
    onFilterChange,
    filters,
    currentAppPermissions, // Передаем permissions вместо hasPermission
  });

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data.contracts}
        rowKey="contract_id"
        loading={loading}
        scroll={{ x: true }}
        pagination={
          data.total > 10
            ? {
                current: currentPage,
                pageSize: pageSize,
                total: data.total,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                showTotal: (total) => (
                  <Typography.Text>Всего: {total}</Typography.Text>
                ),
              }
            : false
        }
        onChange={onTableChange}
      />
    </div>
  );
};
