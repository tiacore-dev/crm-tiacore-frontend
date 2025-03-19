import React from "react";
import { Button, Typography, Table } from "antd"; // Импорт компонентов Ant Design

interface ServiceDetailsProps {
  serviceName: string;
  onEdit: () => void;
}

export const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  serviceName,
  onEdit,
}) => {
  const columns = [
    {
      title: "Название услуги",
      dataIndex: "serviceName",
      key: "serviceName",
    },
  ];

  const data = [
    {
      key: "1",
      serviceName: serviceName,
    },
  ];

  return (
    <div>
      <Typography.Title level={3}>Детали услуги</Typography.Title>
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  );
};

//ЗАСУНУТЬ КНОПКУ УДАЛИТЬ В КАРТОЧКУ ПОЛЬЗОВАТЕЛЯ
