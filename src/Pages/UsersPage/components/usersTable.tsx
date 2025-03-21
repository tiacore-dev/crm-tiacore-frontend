import { IUser } from "../../../api/usersApi";
import "../../../components/table/table.css";
import React, { useCallback } from "react";
import type { TableColumnsType } from "antd";
import { Table } from "antd";
import { useTableSearch } from "../../../components/table/tableSearchFilter";
import { getPositionLabel } from "./userUtils";

export const UsersTable: React.FC<{
  users?: IUser[];
  onRowClick: (user_id: string) => void;
  onSortChange: (newSortBy: string) => void;
  onFilterChange: (newFilters: Record<string, any>) => void;
  filters?: Record<string, any>; // Добавляем пропс для фильтров
}> = ({ users, onRowClick, onSortChange, onFilterChange, filters }) => {
  const { getColumnSearchProps } = useTableSearch<IUser>();

  const columns: TableColumnsType<IUser> = [
    {
      title: "Имя",
      dataIndex: "full_name",
      key: "full_name",
      sorter: true,
      ...getColumnSearchProps("full_name", filters?.full_name),
      onHeaderCell: () => ({
        onClick: () => onSortChange("full_name"),
      }),
    },
    {
      title: "Логин",
      dataIndex: "username",
      key: "username",
      sorter: true,
      ...getColumnSearchProps("username", filters?.username),
      onHeaderCell: () => ({
        onClick: () => onSortChange("username"),
      }),
      filterSearch: false,
    },
    {
      title: "Позиция",
      dataIndex: "position",
      key: "position",
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => onSortChange("position"),
      }),
      filters: [
        {
          text: "Администратор",
          value: "admin",
        },
        {
          text: "Менеджер",
          value: "manager",
        },
        {
          text: "Пользователь",
          value: "user",
        },
      ],
      onFilter: (value, record) => record.position.startsWith(value as string),
      filterSearch: false,
      render: (position: string) => getPositionLabel(position),
      filteredValue: filters?.position || null, // Применяем фильтры из Redux
      // filterResetText: 'Сбросить',
    },
  ];

  const data = users?.map((user) => ({
    key: user.user_id,
    ...user,
  }));

  const handleTableChange = useCallback(
    (pagination: any, filters: any, sorter: any) => {
      onFilterChange(filters);
      if (sorter.field) {
        onSortChange(sorter.field);
      }
    },
    [onFilterChange, onSortChange]
  );

  return (
    <Table
      columns={columns}
      dataSource={data}
      onRow={(record) => ({
        onClick: () => onRowClick(record.user_id),
      })}
      rowClassName="clickable-row"
      pagination={false}
      onChange={handleTableChange}
    />
  );
};
