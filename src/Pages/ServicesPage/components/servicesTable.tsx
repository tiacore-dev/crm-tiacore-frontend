import React from "react";
import { Table } from "antd";
import { IService } from "../../../api/servicesApi";
import "../../../components/table/table.css";

export const ServicesTable: React.FC<{
  services?: IService[];
  onRowClick: (service_id: string) => void;
  onSortChange: (newSortBy: string) => void;
}> = ({ services, onRowClick, onSortChange }) => {
  const columns = [
    {
      title: "Название услуги",
      dataIndex: "service_name",
      key: "service_name",
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => onSortChange("service_name"),
      }),
    },
  ];

  const data = services?.map((service) => ({
    key: service.service_id,
    ...service,
  }));

  return (
    <Table
      columns={columns}
      dataSource={data}
      onRow={(record) => ({
        onClick: () => onRowClick(record.service_id),
      })}
      rowClassName="clickable-row"
      pagination={false}
    />
  );
};
