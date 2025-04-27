import React from "react";
import { Typography, Card } from "antd"; // Импорт компонентов Ant Design
import { IUser } from "../../../api/usersApi";

const { Title, Text } = Typography;

interface UserDetailsProps {
  userDetails: IUser;
}

export const UserDetailsCard: React.FC<UserDetailsProps> = ({
  userDetails,
}) => {
  return (
    <>
      {!!userDetails && (
        <Card style={{ width: "100%", maxWidth: 600 }}>
          <div style={{ marginBottom: 16 }}>
            <Title level={5}>Email:</Title>
            <Text>{userDetails.username}</Text>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Title level={5}>Ф.И.О.:</Title>
            <Text>{userDetails.full_name}</Text>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Title level={5}>Позиция:</Title>
            <Text>{userDetails.position}</Text>
          </div>
        </Card>
      )}
    </>
  );
};
