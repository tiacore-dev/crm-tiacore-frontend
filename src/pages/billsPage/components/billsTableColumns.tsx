import { Button, Select, DatePicker } from "antd";
import { ColumnType } from "antd/es/table";
import { IBill } from "../../../api/billsApi";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { SortOrder } from "antd/es/table/interface";
import { SearchOutlined, CalendarOutlined } from "@ant-design/icons";
import {
  getEntityNameById,
  getBankNameById,
  getBankAccountNumberById,
  getContractNameById,
} from "../../../utils/infoById";
interface BillsTableColumnsProps {
  legalEntitiesData: {
    legal_entity_id: string;
    legal_entity_name: string;
  }[];
  bankAccountsData: {
    bank_account_id: string;
    account_number: string;
    bank_name: string;
  }[];
  contractsData: {
    contract_id: string;
    contract_name: string;
  }[];
  navigate: ReturnType<typeof useNavigate>;
  sortBy?: string;
  order?: string;
  onSortChange?: (sortBy: string, order: string) => void;
  onFilterChange?: (field: string, value: any) => void;
  filters?: {
    bank_account?: string;
    contract?: string;
    bill_date_from?: number;
    bill_date_to?: number;
  };
}

export const getBillsTableColumns = ({
  legalEntitiesData,
  bankAccountsData,
  contractsData,
  navigate,
  sortBy,
  order,
  onSortChange,
  onFilterChange,
  filters,
}: BillsTableColumnsProps): ColumnType<IBill>[] => {
  const getContractName = (contractId: string) =>
    getContractNameById(contractId, contractsData) || contractId;

  const getLegalEntityName = (legalEntityId: string) =>
    getEntityNameById(legalEntityId, legalEntitiesData) || legalEntityId;

  const getBankAccountName = (bankId: string) =>
    getBankNameById(bankId, bankAccountsData) || bankId;

  const getBankAccountNumber = (bankId: string) =>
    getBankAccountNumberById(bankId, bankAccountsData) || bankId;

  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";

  // const getCompanyName = (companyId: string) =>
  //   companiesData?.find(c => c.company_id === companyId)?.company_name || companyId;

  const handleSortChange = (key: string) => {
    if (!onSortChange) return;

    let newOrder: string;
    if (sortBy !== key) {
      newOrder = "asc";
    } else {
      newOrder = order === "asc" ? "desc" : "asc";
    }
    onSortChange(key, newOrder);
  };

  const getSortOrder = (key: string): SortOrder | undefined => {
    if (sortBy !== key) return undefined;
    return order === "asc" ? "ascend" : "descend";
  };

  return [
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
      sorter: true,
      sortOrder: getSortOrder("bill_number"),
      onHeaderCell: () => ({
        onClick: () => handleSortChange("bill_number"),
      }),
    },
    {
      title: "Дата",
      dataIndex: "bill_date",
      key: "bill_date",
      render: (date: number) => dayjs(date).format("DD.MM.YYYY"),
      sorter: true,
      sortOrder: getSortOrder("bill_date"),
      onHeaderCell: () => ({
        onClick: () => handleSortChange("bill_date"),
      }),
      filterIcon: <CalendarOutlined />,
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <div>
            <DatePicker
              placeholder="Дата от"
              allowClear
              format="DD.MM.YYYY"
              onChange={(date) =>
                onFilterChange?.(
                  "bill_date_from",
                  date ? date.valueOf() : undefined
                )
              }
              value={
                filters?.bill_date_from
                  ? dayjs(filters.bill_date_from)
                  : undefined
              }
            />
          </div>
          <div style={{ marginTop: 8 }}>
            <DatePicker
              placeholder="Дата до"
              allowClear
              format="DD.MM.YYYY"
              onChange={(date) =>
                onFilterChange?.(
                  "bill_date_to",
                  date ? date.valueOf() : undefined
                )
              }
              value={
                filters?.bill_date_to ? dayjs(filters.bill_date_to) : undefined
              }
            />
          </div>
        </div>
      ),
    },
    {
      title: "Банковский счёт",
      dataIndex: "bank_account",
      key: "bank_account",
      render: (bankId: string) => {
        const accountNumber = getBankAccountNumber(bankId);
        const bankName = getBankAccountName(bankId);

        return (
          <div>
            {accountNumber}
            <span
              style={{
                color: "#9f9f9f",
                fontSize: "0.95em",
                marginLeft: "8px",
              }}
            >
              ({bankName})
            </span>
          </div>
        );
      },
      filterIcon: <SearchOutlined />,
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Select
            style={{ width: 300 }}
            placeholder="Выберите счет"
            allowClear
            showSearch
            options={bankAccountsData.map((account) => ({
              value: account.bank_account_id,
              label: `${account.account_number} (${account.bank_name})`,
            }))}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            onChange={(value) => onFilterChange?.("bank_account", value)}
            value={filters?.bank_account}
          />
        </div>
      ),
    },
    {
      //????????????????????????????????????????????????????????????????
      title: "Договор",
      dataIndex: "contract",
      key: "contract",
      render: getContractName,
      filterIcon: <SearchOutlined />,

      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Select
            style={{ width: 200 }}
            placeholder="Выберите договор"
            allowClear
            showSearch
            options={contractsData.map((contract) => ({
              value: contract.contract_id,
              label: contract.contract_name,
            }))}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            onChange={(value) => onFilterChange?.("contract", value)}
            value={filters?.contract}
          />
        </div>
      ),
    },
    {
      title: "Заказчик",
      dataIndex: "buyer",
      key: "buyer",
      render: getLegalEntityName,
    },
    {
      title: "Исполнитель",
      dataIndex: "seller",
      key: "seller",
      render: getLegalEntityName,
    },
  ];
};
