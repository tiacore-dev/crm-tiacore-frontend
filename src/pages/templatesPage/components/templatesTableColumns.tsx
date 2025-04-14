//templatestablecolumns
import { Button, Input, Select } from "antd";
import { ColumnType } from "antd/es/table";
import { ITemplate } from "../../../api/templatesApi";
import { NavigateFunction } from "react-router-dom";
import { FileOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import { getCompanyNameById } from "../../../utils/infoById";

export const getTemplateColumns = (
  companiesData: { company_id: string; company_name: string }[] = [],
  navigate: NavigateFunction,
  search: string,
  company: string,
  onSearchChange: (value: string) => void,
  onCompanyChange: (value: string) => void,
  downloadingId: string | null,
  onDownload: (template_id: string) => void
): ColumnType<ITemplate>[] => {
  return [
    {
      title: "Название шаблона",
      dataIndex: "template_name",
      key: "template_name",
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      sorter: (a: ITemplate, b: ITemplate) =>
        a.template_name.localeCompare(b.template_name),
      sortDirections: ["ascend", "descend"],
      render: (text: string, record: ITemplate) => (
        <Button
          type="link"
          onClick={() => navigate(`/templates/${record.template_id}`)}
        >
          {text}
        </Button>
      ),
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по названию"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ width: 200 }}
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
      render: (companyId: string) =>
        getCompanyNameById(companyId, companiesData) || companyId,
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
      title: "Тип",
      dataIndex: "entity",
      key: "entity",
      sorter: (a: ITemplate, b: ITemplate) => a.entity.localeCompare(b.entity),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Файл",
      dataIndex: "s3_key",
      key: "s3_key",
      render: (_: string, record: ITemplate) => {
        if (!record.s3_key) return "-";
        const fileName = record.s3_key.split("/").pop() || "Файл";

        return (
          <Button
            type="link"
            onClick={() => onDownload(record.template_id)}
            loading={downloadingId === record.template_id}
            icon={<FileOutlined />}
          >
            {fileName}
          </Button>
        );
      },
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
      render: (text: string) => text || "-",
    },
  ];
};
