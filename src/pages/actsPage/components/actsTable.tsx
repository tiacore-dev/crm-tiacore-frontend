import { Table, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { IAct } from "../../../api/actsApi";
import { getActsTableColumns } from "./atcsTableColumns";
import { useMemo } from "react";

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
  currentPage: number;
  pageSize: number;
  sortBy?: string;
  order?: string;
  filters?: {
    contract?: string;
    buyer?: string;
    seller?: string;
    act_date_from?: number;
    act_date_to?: number;
  };
  onTableChange: (pagination: any, filters: any, sorter: any) => void;
  onSortChange: (sortBy: string, order: string) => void;
  onFilterChange: (field: string, value: any) => void;
}

export const ActsTable: React.FC<ActsTableProps> = ({
  data = { total: 0, acts: [] },
  loading,
  legalEntitiesData = [],
  contractsData = [],
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

  const columns = useMemo(
    () =>
      getActsTableColumns({
        legalEntitiesData,
        contractsData,
        navigate,
        sortBy,
        order,
        onSortChange,
        onFilterChange,
        filters,
      }),
    [
      legalEntitiesData,
      contractsData,
      navigate,
      sortBy,
      order,
      onSortChange,
      onFilterChange,
      filters,
    ]
  );

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data.acts}
        rowKey="act_id"
        loading={loading}
        scroll={{ x: true }}
        pagination={
          data.total > 10
            ? {
                current: currentPage,
                pageSize: pageSize,
                total: data.total,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50"],
                showTotal: (total) => (
                  <Typography.Text>Всего: {total}</Typography.Text>
                ),
              }
            : false
        }
        onChange={onTableChange}
        onRow={(record) => ({
          onClick: () => navigate(`/acts/${record.act_id}`),
          style: { cursor: "pointer" },
        })}
      />
    </div>
  );
};
