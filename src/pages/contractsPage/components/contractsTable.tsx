import { Table, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { IContract } from "../../../api/contractsApi";
import { useState } from "react";
import { downloadContract } from "../../../api/contractsApi";
import { getContractsTableColumns } from "./contractsTableColumns";
import { useSelector, useDispatch } from "react-redux";
import {
  contractsSelector,
  setPage,
  setPageSize,
  setSortBy,
  setOrder,
} from "../../../redux/slices/contractsSlice";

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
  onSortChange?: (sortBy: string, order: string) => void;
  onFilterChange?: (field: string, value: any) => void;
  filters?: {
    buyer?: string;
    seller?: string;
    status?: string;
    contract_date_from?: number;
    contract_date_to?: number;
  };
  sortBy?: string;
  order?: string;
}

export const ContractsTable: React.FC<ContractsTableProps> = ({
  data = { total: 0, contracts: [] },
  loading,
  legalEntitiesData = [],
  contractStatusesData = [],
  onSortChange,
  onFilterChange,
  filters,
  sortBy,
  order,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { page, page_size } = useSelector(contractsSelector);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (contract_id: string) => {
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

  const handleSort = (sortBy: string, order: string) => {
    dispatch(setSortBy(sortBy));
    dispatch(setOrder(order));
    if (onSortChange) onSortChange(sortBy, order);
  };

  const handleFilter = (field: string, value: any) => {
    if (onFilterChange) onFilterChange(field, value);
  };

  const columns = getContractsTableColumns({
    legalEntitiesData,
    contractStatusesData,
    navigate,
    handleDownload,
    downloadingId,
    sortBy,
    order,
    onSortChange: handleSort,
    onFilterChange: handleFilter,
    filters,
  });

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data.contracts}
        rowKey="contract_id"
        loading={loading}
        pagination={{
          current: page,
          pageSize: page_size,
          total: data.total,
          showSizeChanger: true,
          pageSizeOptions: ["2", "10", "20", "50", "100"],
          showTotal: (total) => (
            <Typography.Text>Всего: {total}</Typography.Text>
          ),
          onChange: (newPage, newPageSize) => {
            if (newPageSize !== page_size) {
              dispatch(setPageSize(newPageSize));
            }
            dispatch(setPage(newPage));
          },
        }}
      />
    </div>
  );
};
