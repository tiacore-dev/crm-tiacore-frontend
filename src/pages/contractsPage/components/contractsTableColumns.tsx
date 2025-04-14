//contractsTableColumns.tsx
import { Button, Tag, Select, DatePicker } from "antd";
import { ColumnType } from "antd/es/table";
import { IContract } from "../../../api/contractsApi";
import { FileOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { SortOrder } from "antd/es/table/interface";

interface ContractsTableColumnsProps {
  legalEntitiesData: {
    legal_entity_id: string;
    legal_entity_name: string;
  }[];
  contractStatusesData: {
    contract_status_id: string;
    status_name: string;
  }[];
  navigate: ReturnType<typeof useNavigate>;
  handleDownload: (contract_id: string) => Promise<void>;
  downloadingId: string | null;
  sortBy?: string;
  order?: string;
  onSortChange?: (sortBy: string, order: string) => void;
  onFilterChange?: (field: string, value: any) => void;
  filters?: {
    buyer?: string;
    seller?: string;
    status?: string;
    contract_date_from?: number;
    contract_date_to?: number;
  };
}

export const getContractsTableColumns = ({
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
}: ContractsTableColumnsProps): ColumnType<IContract>[] => {
  const getLegalEntityName = (legalEntityId: string): string => {
    const legalEntity = legalEntitiesData.find(
      (c) => c.legal_entity_id === legalEntityId
    );
    return legalEntity ? legalEntity.legal_entity_name : legalEntityId;
  };

  const getContractStatusName = (contractStatusId: string): string => {
    const contractStatus = contractStatusesData.find(
      (c) => c.contract_status_id === contractStatusId
    );
    return contractStatus ? contractStatus.status_name : contractStatusId;
  };

  const getStatusDisplay = (status: string): string => {
    switch (status.toLowerCase()) {
      case "active":
        return "Активен";
      case "waiting":
        return "В процессе";
      default:
        return status;
    }
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
      sorter: true,
      sortOrder: getSortOrder("contract_name"),
      onHeaderCell: () => ({
        onClick: () => handleSortChange("contract_name"),
      }),
    },
    {
      title: "Дата",
      dataIndex: "contract_date",
      key: "contract_date",
      render: (timestamp: number) => dayjs(timestamp).format("DD.MM.YYYY"),
      sorter: true,
      sortOrder: getSortOrder("contract_date"),
      onHeaderCell: () => ({
        onClick: () => handleSortChange("contract_date"),
      }),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <div>
            <DatePicker
              placeholder="Дата от"
              allowClear
              format="DD.MM.YYYY"
              onChange={(date) =>
                onFilterChange?.(
                  "contract_date_from",
                  date ? date.valueOf() : undefined
                )
              }
              value={
                filters?.contract_date_from
                  ? dayjs(filters.contract_date_from)
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
                  "contract_date_to",
                  date ? date.valueOf() : undefined
                )
              }
              value={
                filters?.contract_date_to
                  ? dayjs(filters.contract_date_to)
                  : undefined
              }
            />
          </div>
        </div>
      ),
    },
    {
      title: "Заказчик",
      dataIndex: "buyer",
      key: "buyer",
      render: getLegalEntityName,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Select
            style={{ width: 200 }}
            placeholder="Выберите заказчика"
            allowClear
            showSearch
            options={legalEntitiesData.map((entity) => ({
              value: entity.legal_entity_id,
              label: entity.legal_entity_name,
            }))}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            onChange={(value) => onFilterChange?.("buyer", value)}
            value={filters?.buyer}
          />
        </div>
      ),
    },
    {
      title: "Исполнитель",
      dataIndex: "seller",
      key: "seller",
      render: getLegalEntityName,
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Select
            style={{ width: 200 }}
            placeholder="Выберите исполнителя"
            allowClear
            showSearch
            options={legalEntitiesData.map((entity) => ({
              value: entity.legal_entity_id,
              label: entity.legal_entity_name,
            }))}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            onChange={(value) => onFilterChange?.("seller", value)}
            value={filters?.seller}
          />
        </div>
      ),
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (contractStatusId: string) => {
        const displayStatus = getStatusDisplay(
          getContractStatusName(contractStatusId)
        );
        return (
          <Tag color={displayStatus === "Активен" ? "green" : "orange"}>
            {displayStatus}
          </Tag>
        );
      },
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Select
            style={{ width: 200 }}
            placeholder="Выберите статус"
            allowClear
            options={contractStatusesData.map((status) => ({
              value: status.contract_status_id,
              label: status.status_name,
            }))}
            onChange={(value) => onFilterChange?.("status", value)}
            value={filters?.status}
          />
        </div>
      ),
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
    },
  ];
};
