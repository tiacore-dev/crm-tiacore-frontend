import { Table, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { IBill } from "../../../api/billsApi";
import { getBillsTableColumns } from "./billsTableColumns";

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
    account_number: string;
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
    bank_account?: string;
    contract?: string;
    bill_date_from?: number;
    bill_date_to?: number;
  };
  onTableChange: (pagination: any, filters: any, sorter: any) => void;
  onSortChange: (sortBy: string, order: string) => void;
  onFilterChange: (field: string, value: any) => void;
}

export const BillsTable: React.FC<BillsTableProps> = ({
  data = { total: 0, bills: [] },
  loading,
  legalEntitiesData = [],
  bankAccountsData = [],
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

  const columns = getBillsTableColumns({
    legalEntitiesData,
    bankAccountsData,
    contractsData,
    navigate,
    sortBy,
    order,
    onSortChange,
    onFilterChange,
    filters,
  });

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data.bills}
        rowKey="bill_id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: data.total,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total) => (
            <Typography.Text>Всего: {total}</Typography.Text>
          ),
        }}
        onChange={onTableChange}
      />
    </div>
  );
};
