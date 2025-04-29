import { ColumnType } from "antd/es/table";
import { ILegalEntity } from "../../../api/legalEntitiesApi";
import { Button, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface LegalEntitiesTableColumnsProps {
  // legalEntityTypes: {
  //   legal_entity_type_id: string;
  //   entity_name: string;
  // }[];
  navigate: ReturnType<typeof useNavigate>;
  search: string;
  entity_type: string;
  onSearchChange: (value: string) => void;
  onEntityTypeChange: (value: string) => void;
  isSellers: boolean;
}
export const getLegalEntitiesTableColumns = ({
  // legalEntityTypes,
  navigate,
  search,
  // entity_type,
  onSearchChange,
  // onEntityTypeChange,
  isSellers,
}: LegalEntitiesTableColumnsProps): ColumnType<ILegalEntity>[] => {
  // const getEntityType = (typeId?: string): string => {
  //   if (!typeId) return "Не указано";
  //   const type = legalEntityTypes.find(
  //     (c) => c.legal_entity_type_id === typeId
  //   );
  //   return type ? type.entity_name : typeId;
  // };

  const baseColumns: ColumnType<ILegalEntity>[] = [
    {
      title: "Название",
      dataIndex: "legal_entity_name",
      key: "legal_entity_name",
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      sorter: (a: ILegalEntity, b: ILegalEntity) =>
        a.legal_entity_name.localeCompare(b.legal_entity_name),
      sortDirections: ["ascend", "descend"],
      render: (text: string, record: ILegalEntity) => {
        // const entityType = getEntityType(record.entity_type);
        return (
          <Button
            type="link"
            onClick={() =>
              navigate(`/legal_entities/${record.legal_entity_id}`)
            }
          >
            {text}
            {/* <span style={{ color: "#888", fontSize: "0.9em" }}>
              ({entityType})
            </span> */}
          </Button>
        );
      },
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по названию"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
        </div>
      ),
      filteredValue: search ? [search] : null,
    },
    {
      title: "ИНН",
      dataIndex: "inn",
      key: "inn",
      width: 150,
    },
    {
      title: "КПП",
      dataIndex: "kpp",
      key: "kpp",
      width: 130,
      render: (kpp) => kpp || "—",
    },
    {
      title: "Адрес",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
      sorter: (a: ILegalEntity, b: ILegalEntity) =>
        a.address.localeCompare(b.address),
      sortDirections: ["ascend", "descend"],
    },
  ];

  const sellerSpecificColumns: ColumnType<ILegalEntity>[] = isSellers
    ? [
        {
          title: "Ставка НДС",
          dataIndex: "vat_rate",
          key: "vat_rate",
          render: (vat_rate) =>
            vat_rate ? `${vat_rate}%` : "НДС не облагается",
          width: 200,
        },
        {
          title: "Подписант",
          dataIndex: "signer",
          key: "signer",
          render: (signer) => signer || "Не указано",
        },
      ]
    : [];

  return [...baseColumns, ...sellerSpecificColumns];
};
