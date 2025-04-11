import { Button, DatePicker, Select } from "antd";
import { ColumnType } from "antd/es/table";
import { IAct } from "../../../api/actsApi";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { SortOrder } from "antd/es/table/interface";
import { SearchOutlined, CalendarOutlined } from "@ant-design/icons";

interface ActsTableColumnsProps {
  legalEntitiesData: {
    legal_entity_id: string;
    legal_entity_name: string;
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
    act_date_from?: number;
    act_date_to?: number;
  };
}

export const getActsTableColumns = ({
  legalEntitiesData,
  contractsData,
  navigate,
  sortBy,
  order,
  onSortChange,
  onFilterChange,
  filters,
}: ActsTableColumnsProps): ColumnType<IAct>[] => {
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
      title: "Номер акта",
      dataIndex: "act_number",
      key: "act_number",
      render: (text: string, record: IAct) => (
        <Button type="link" onClick={() => navigate(`/acts/${record.act_id}`)}>
          {text}
        </Button>
      ),
      sorter: true,
      sortOrder: getSortOrder("act_number"),
      onHeaderCell: () => ({
        onClick: () => handleSortChange("act_number"),
      }),
    },
    {
      title: "Дата",
      dataIndex: "act_date",
      key: "act_date",
      render: (date: number) => dayjs(date).format("DD.MM.YYYY"),
      sorter: true,
      sortOrder: getSortOrder("act_date"),
      onHeaderCell: () => ({
        onClick: () => handleSortChange("act_date"),
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
                  "act_date_from",
                  date ? date.valueOf() : undefined
                )
              }
              value={
                filters?.act_date_from
                  ? dayjs(filters.act_date_from)
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
                  "act_date_to",
                  date ? date.valueOf() : undefined
                )
              }
              value={
                filters?.act_date_to ? dayjs(filters.act_date_to) : undefined
              }
            />
          </div>
        </div>
      ),
    },
    {
      title: "Договор",
      dataIndex: "contract",
      key: "contract",
      render: (contractId?: string) =>
        contractId ? getContractName(contractId) : "-",
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
      render: (legalEntityId: string) => getLegalEntityName(legalEntityId),
    },
    {
      title: "Исполнитель",
      dataIndex: "seller",
      key: "seller",
      render: (legalEntityId: string) => getLegalEntityName(legalEntityId),
    },
  ];
};
