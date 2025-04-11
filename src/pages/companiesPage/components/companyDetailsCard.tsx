import React from "react";
import { Table } from "antd";
import { ICompany } from "../../../api/companiesApi";

interface CompanyTableProps {
  data?: ICompany;
  loading?: boolean;
}

export const CompanyTable: React.FC<CompanyTableProps> = ({
  data,
  loading = false,
}) => {
  const tableData = data ? [data] : [];

  const columns = [
    {
      title: "Название компании", // Добавляем название колонки
      dataIndex: "company_name",
      key: "company_name",
      width: "33%", // Первая колонка занимает 1/3 ширины
      render: (text: string) => text || "-",
    },
    {
      title: "Описание компании", // Добавляем название колонки
      dataIndex: "description",
      key: "description",
      width: "67%", // Вторая колонка занимает 2/3 ширины
      render: (text: string) => text || "-",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      rowKey="company_id"
      loading={loading}
      pagination={false}
      bordered
      size="middle"
      style={{ width: "100%" }}
    />
  );
};
