import React from "react";
import { Button, Typography, Card } from "antd"; // Импорт компонентов Ant Design
import { getPositionLabel } from "./userUtils";

const { Title, Text } = Typography;

interface UserDetailsProps {
  userName: string;
  userFullName: string;
  userPosition: string;
}

export const UserDetails: React.FC<UserDetailsProps> = ({
  userName,
  userFullName,
  userPosition,
}) => {
  const positionLabel = getPositionLabel(userPosition);
  return (
    <Card title={userFullName} style={{ width: "100%", maxWidth: 600 }}>
      <div style={{ marginBottom: 16 }}>
        <Title level={5}>Логин:</Title>
        <Text>{userName}</Text>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Title level={5}>Ф.И.О.:</Title>
        <Text>{userFullName}</Text>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Title level={5}>Позиция:</Title>
        <Text>{positionLabel}</Text>
      </div>
    </Card>
  );
};
