import React from "react";
import { Table } from "antd"; // Импорт компонентов Ant Design
import { IUser } from "../../../api/usersApi";
import "../../../components/table.css"

export const UsersTable: React.FC<{
  users?: IUser[];
  onRowClick: (user_id: string) => void;
  onSortChange: (newSortBy: string) => void;
}> = ({ users, onRowClick, onSortChange }) => {
  const columns = [
    {
      title: "Логин",
      dataIndex: "username",
      key: "username",
      sorter: true, 
      onHeaderCell: () => ({
        onClick: () => onSortChange("username"),
      }),
    },
    {
        title: "Имя",
        dataIndex: "full_name",
        key: "full_name",
        sorter: true, 
        onHeaderCell: () => ({
          onClick: () => onSortChange("full_name"),
        }),
      },
      {
        title: "Позиция",
        dataIndex: "position",
        key: "position",
        sorter: true, 
        onHeaderCell: () => ({
          onClick: () => onSortChange("position"),
        }),
      },
  ];

  const data = users?.map((user) => ({
    key: user.user_id,
    ...user,
  }));

  return (
    <Table
      columns={columns}
      dataSource={data}
      onRow={(record) => ({
        onClick: () => onRowClick(record.user_id),
      })}
      rowClassName="clickable-row"
      pagination={false} // Отключаем пагинацию
    />
  );
};