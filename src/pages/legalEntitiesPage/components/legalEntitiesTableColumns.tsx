import { ColumnType } from "antd/es/table";
import { ILegalEntity } from "../../../api/legalEntitiesApi";
import { Button, Input, Select, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface LegalEntitiesTableColumnsProps {
  legalEntityTypes: {
    legal_entity_type_id: string;
    entity_name: string;
  }[];
  companiesData: {
    company_id: string;
    company_name: string;
  }[];
  navigate: ReturnType<typeof useNavigate>;
  search: string;
  company: string;
  entity_type: string;
  onSearchChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onEntityTypeChange: (value: string) => void;
}

export const getLegalEntitiesTableColumns = ({
  legalEntityTypes,
  companiesData,
  navigate,
  search,
  company,
  entity_type,
  onSearchChange,
  onCompanyChange,
  onEntityTypeChange,
}: LegalEntitiesTableColumnsProps): ColumnType<ILegalEntity>[] => {
  const getCompanyName = (companyId: string): string => {
    const company = companiesData.find((c) => c.company_id === companyId);
    return company ? company.company_name : companyId;
  };

  const getEntityType = (typeId: string): string => {
    const type = legalEntityTypes.find(
      (c) => c.legal_entity_type_id === typeId
    );
    return type ? type.entity_name : typeId;
  };

  return [
    {
      title: "Название (Тип)",
      dataIndex: "legal_entity_name",
      key: "legal_entity_name",
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      sorter: (a: ILegalEntity, b: ILegalEntity) =>
        a.legal_entity_name.localeCompare(b.legal_entity_name),
      sortDirections: ["ascend", "descend"],
      render: (text: string, record: ILegalEntity) => {
        const entityType = getEntityType(record.entity_type);
        return (
          <Button
            type="link"
            onClick={() =>
              navigate(`/legal_entities/${record.legal_entity_id}`)
            }
          >
            {text}{" "}
            <span style={{ color: "#888", fontSize: "0.9em" }}>
              ({entityType})
            </span>
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
      title: "Компания",
      dataIndex: "company",
      key: "company",
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      sorter: (a: ILegalEntity, b: ILegalEntity) =>
        getCompanyName(a.company).localeCompare(getCompanyName(b.company)),
      sortDirections: ["ascend", "descend"],
      render: getCompanyName,
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Select
            showSearch
            allowClear
            placeholder="Фильтр по компании"
            value={company || undefined}
            onChange={(value) => onCompanyChange(value || "")}
            style={{ width: 200 }}
            options={companiesData.map((c) => ({
              label: c.company_name,
              value: c.company_id,
            }))}
            filterOption={(input, option) =>
              (option?.label as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        </div>
      ),
      filteredValue: company ? [company] : null,
    },
    {
      title: "ИНН",
      dataIndex: "inn",
      key: "inn",
      width: 150,
      sorter: (a: ILegalEntity, b: ILegalEntity) => a.inn.localeCompare(b.inn),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "КПП",
      dataIndex: "kpp",
      key: "kpp",
      width: 130,
      sorter: (a: ILegalEntity, b: ILegalEntity) => a.kpp.localeCompare(b.kpp),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Ставка НДС",
      dataIndex: "vat_rate",
      key: "vat_rate",
      render: (vat_rate) => `${vat_rate}%`,
      width: 110,
      sorter: (a: ILegalEntity, b: ILegalEntity) => a.vat_rate - b.vat_rate,
      sortDirections: ["ascend", "descend"],
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
    {
      title: "Подписавший",
      dataIndex: "signer",
      key: "signer",
      sorter: (a: ILegalEntity, b: ILegalEntity) =>
        a.signer.localeCompare(b.signer),
      sortDirections: ["ascend", "descend"],
    },
  ];
};
