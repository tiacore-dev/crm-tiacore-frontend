import { IUser } from "../../../api/usersApi";
import "../../../components/table/table.css";
import React, { useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";

type DataIndex = keyof IUser;

export const UsersTable: React.FC<{
  users?: IUser[];
  onRowClick: (user_id: string) => void;
  onSortChange: (newSortBy: string) => void;
}> = ({ users, onRowClick, onSortChange }) => {
  const getPositionLabel = (position: string) => {
    switch (position) {
      case "admin":
        return "Администратор";
      case "manager":
        return "Менеджер";
      case "user":
        return "Пользователь";
      default:
        return position;
    }
  };

  const [searchText, setSearchText] = useState(""); //Состояние для хранения текста, который вводится в поле поиска.
  const [searchedColumn, setSearchedColumn] = useState(""); //Состояние для хранения имени колонки, по которой производится поиск.
  const searchInput = useRef<InputRef>(null); //Референс на поле ввода для управления фокусом.
  //Функции для поиска и сброса
  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (
    clearFilters: () => void,
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    clearFilters();
    setSearchText("");
    handleSearch([], confirm, dataIndex);
  };
  //Функция для получения свойств колонки с поиском
  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<IUser> => ({
    //Кастомный dropdown для фильтрации. Включает поле ввода и кнопки для поиска, сброса, фильтрации и закрытия.
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Поиск
          </Button>
          <Button
            onClick={() =>
              clearFilters && handleReset(clearFilters, confirm, dataIndex)
            }
            size="small"
            style={{ width: 90 }}
          >
            Сбросить
          </Button>
        </Space>
      </div>
    ),
    //Иконка фильтра, которая меняет цвет, если фильтр активен.
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    // проверяет, содержит ли значение в колонке строку поиска.
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    // автоматический фокус на поле ввода при открытии.
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) => text,
  });

  const columns: TableColumnsType<IUser> = [
    {
      title: "Имя",
      dataIndex: "full_name",
      key: "full_name",
      sorter: true,
      ...getColumnSearchProps("full_name"),
      onHeaderCell: () => ({
        onClick: () => onSortChange("full_name"),
      }),
    },
    {
      title: "Логин",
      dataIndex: "username",
      key: "username",
      sorter: true,
      ...getColumnSearchProps("username"),
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
