import React from "react";
import { Pagination as AntPagination, Select } from "antd"; // Импорт компонентов Ant Design
import "./pagination.css"; // Подключаем CSS

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number; // Общее количество элементов
  pageSize: number; // Текущее количество элементов на странице
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void; // Обработчик изменения pageSize
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const handlePageSizeChange = (value: number) => {
    onPageSizeChange(value); // Передаём новое значение pageSize в родительский компонент
  };

  return (
    <div className="pagination">
      {/* Компонент Pagination из Ant Design */}
      <AntPagination
        current={currentPage}
        total={totalItems}
        pageSize={pageSize}
        onChange={onPageChange}
        showSizeChanger={false}
        style={{ marginBottom: 16 }}
      />

      {/* Выбор количества элементов на странице */}
      <div className="page-size-selector">
        {/* <span>Элементов на странице: </span> */}
        <Select
          value={pageSize}
          onChange={handlePageSizeChange}
          style={{ width: 100 }}
        >
          <Select.Option value={10}>10</Select.Option>
          <Select.Option value={20}>20</Select.Option>
          <Select.Option value={40}>40</Select.Option>
          <Select.Option value={60}>60</Select.Option>
          <Select.Option value={80}>80</Select.Option>
          <Select.Option value={100}>100</Select.Option>
        </Select>
      </div>
    </div>
  );
};