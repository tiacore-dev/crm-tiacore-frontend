import React from "react";
import { Table } from "antd";
import { ICompany } from "../../../api/companiesApi";
import "../../../components/table/table.css";

export const CompaniesTable: React.FC<{
  companies?: ICompany[];
  onRowClick: (company_id: string) => void;
  onSortChange: (newSortBy: string) => void;
}> = ({ companies, onRowClick, onSortChange }) => {
  const columns = [
    {
      title: "Название компании",
      dataIndex: "company_name",
      key: "company_name",
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => onSortChange("company_name"),
      }),
    },
    {
      title: "Описание компании",
      dataIndex: "description",
      key: "description",
    },
  ];

  const data = companies?.map((company) => ({
    key: company.company_id,
    ...company,
  }));

  return (
    <Table
      columns={columns}
      dataSource={data}
      onRow={(record) => ({
        onClick: () => onRowClick(record.company_id),
      })}
      rowClassName="clickable-row"
      pagination={false}
    />
  );
};
