import React from "react";
import { Typography, Card } from "antd"; // Импорт компонентов Ant Design

const { Title, Text } = Typography;

interface CompanyDetailsProps {
  companyName: string;
  companyDescription: string;
}

export const CompanyDetails: React.FC<CompanyDetailsProps> = ({
  companyName,
  companyDescription,
}) => {
  return (
    <Card title={companyDescription} style={{ width: "100%", maxWidth: 600 }}>
      <div style={{ marginBottom: 16 }}>
        <Title level={5}>Название:</Title>
        <Text>{companyName}</Text>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Title level={5}>Описание:</Title>
        <Text>{companyDescription}</Text>
      </div>
    </Card>
  );
};
