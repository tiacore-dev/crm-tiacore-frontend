// import { useState, useRef } from "react";
// import { SearchOutlined } from "@ant-design/icons";
// import type { InputRef, TableColumnType } from "antd";
// import { Button, Input, Space } from "antd";
// import type { FilterDropdownProps } from "antd/es/table/interface";

export const useTableSearch = <T extends object>() => {
  //   const [searchText, setSearchText] = useState(""); // Состояние для хранения текста поиска
  //   const [searchedColumn, setSearchedColumn] = useState(""); // Состояние для хранения имени колонки, по которой производится поиск
  //   const searchInput = useRef<InputRef>(null); // Референс на поле ввода для управления фокусом
  //   // Функция для обработки поиска
  //   const handleSearch = (
  //     selectedKeys: string[],
  //     confirm: FilterDropdownProps["confirm"],
  //     dataIndex: keyof T
  //   ) => {
  //     confirm();
  //     setSearchText(selectedKeys[0]);
  //     setSearchedColumn(dataIndex as string);
  //   };
  //   // Функция для сброса поиска
  //   const handleReset = (
  //     clearFilters: () => void,
  //     confirm: FilterDropdownProps["confirm"],
  //     dataIndex: keyof T
  //   ) => {
  //     clearFilters();
  //     setSearchText("");
  //     handleSearch([], confirm, dataIndex);
  //   };
  //   // Функция для получения свойств колонки с поиском
  //   const getColumnSearchProps = (dataIndex: keyof T): TableColumnType<T> => ({
  //     filterDropdown: ({
  //       setSelectedKeys,
  //       selectedKeys,
  //       confirm,
  //       clearFilters,
  //     }) => (
  //       <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
  //         <Input
  //           ref={searchInput}
  //           placeholder={`Search ${dataIndex as string}`}
  //           value={selectedKeys[0]}
  //           onChange={(e) =>
  //             setSelectedKeys(e.target.value ? [e.target.value] : [])
  //           }
  //           onPressEnter={() =>
  //             handleSearch(selectedKeys as string[], confirm, dataIndex)
  //           }
  //           style={{ marginBottom: 8, display: "block" }}
  //         />
  //         <Space>
  //           <Button
  //             type="primary"
  //             onClick={() =>
  //               handleSearch(selectedKeys as string[], confirm, dataIndex)
  //             }
  //             icon={<SearchOutlined />}
  //             size="small"
  //             style={{ width: 90 }}
  //           >
  //             Поиск
  //           </Button>
  //           <Button
  //             onClick={() =>
  //               clearFilters && handleReset(clearFilters, confirm, dataIndex)
  //             }
  //             size="small"
  //             style={{ width: 90 }}
  //           >
  //             Сбросить
  //           </Button>
  //         </Space>
  //       </div>
  //     ),
  //     filterIcon: (filtered: boolean) => (
  //       <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
  //     ),
  //     onFilter: (value, record) =>
  //       record[dataIndex]
  //         ?.toString()
  //         .toLowerCase()
  //         .includes((value as string).toLowerCase()),
  //     filterDropdownProps: {
  //       onOpenChange(open) {
  //         if (open) {
  //           setTimeout(() => searchInput.current?.select(), 100);
  //         }
  //       },
  //     },
  //     render: (text) => text,
  //   });
  //   return {
  //     searchText,
  //     searchedColumn,
  //     getColumnSearchProps,
  //   };
};
