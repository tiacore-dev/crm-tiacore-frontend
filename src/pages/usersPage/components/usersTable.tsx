import { IUser } from "../../../api/usersApi";
import React from "react";
import type { TableColumnsType } from "antd";
import { Button, Input, Table, Typography } from "antd";
import {
  usersSelector,
  setFullName,
  setPage,
  setPageSize,
  setPosition,
  setUserName,
} from "../../../redux/slices/usersSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";

interface UsersTableProps {
  data: {
    total: number;
    users: IUser[];
  };
  loading: boolean;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  data = { total: 0, users: [] },
  loading,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { username, full_name, position, page, page_size } =
    useSelector(usersSelector);

  const columns: TableColumnsType<IUser> = [
    {
      title: "Имя",
      dataIndex: "full_name",
      key: "full_name",
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      sorter: (a: IUser, b: IUser) => a.full_name.localeCompare(b.full_name),
      sortDirections: ["ascend", "descend"],
      render: (text: string, record: IUser) => (
        <Button
          type="link"
          onClick={() => navigate(`/users/${record.user_id}`)}
        >
          {text}
        </Button>
      ),
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по имени"
            value={full_name}
            onChange={(e) => dispatch(setFullName(e.target.value))}
            style={{ width: 200 }}
            allowClear
          />
        </div>
      ),
      filteredValue: full_name ? [full_name] : null,
    },
    {
      title: "Логин",
      dataIndex: "username",
      key: "username",
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      sorter: (a: IUser, b: IUser) => a.username.localeCompare(b.username),
      sortDirections: ["ascend", "descend"],
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск логину"
            value={username}
            onChange={(e) => dispatch(setUserName(e.target.value))}
            style={{ width: 200 }}
            allowClear
          />
        </div>
      ),
      filteredValue: username ? [username] : null,
    },
    {
      title: "Позиция",
      dataIndex: "position",
      key: "position",
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      sorter: (a: IUser, b: IUser) => a.position.localeCompare(b.position),
      sortDirections: ["ascend", "descend"],
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск позиции"
            value={position}
            onChange={(e) => dispatch(setPosition(e.target.value))}
            style={{ width: 200 }}
            allowClear
          />
        </div>
      ),
      filteredValue: position ? [position] : null,
    },
  ];

  // Фильтрация данных
  const filteredData = data.users.filter((user) => {
    const matchesUsername = username
      ? user.username.toLowerCase().includes(username.toLowerCase())
      : true;
    const matchesFullName = full_name
      ? user.full_name.toLowerCase().includes(full_name.toLowerCase())
      : true;
    const matchesPosition = position
      ? user.position.toLowerCase().includes(position.toLowerCase())
      : true;

    return matchesUsername && matchesFullName && matchesPosition;
  });

  return (
    <Table
      columns={columns}
      dataSource={filteredData} // Передаем все отфильтрованные данные
      rowKey="user_id"
      loading={loading}
      pagination={{
        current: page,
        pageSize: page_size,
        total: filteredData.length,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50", "100"],
        showTotal: (total) => <Typography.Text>Всего: {total}</Typography.Text>,
        onChange: (newPage, newPageSize) => {
          if (newPageSize !== page_size) {
            dispatch(setPageSize(newPageSize));
          }
          dispatch(setPage(newPage));
        },
      }}
    />
  );
};
