import React, { useCallback } from "react";
import { Input, Button } from "antd"; // Импорт компонентов Ant Design
import "./searchBar.css"; // Подключаем CSS

interface SearchBarProps {
  tempSearch: string;
  onTempSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  tempSearch,
  onTempSearchChange,
  onSearch,
}) => {
  const searchHandler = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  }, [onSearch]);

  return (
    <div className="search-bar">
      <Input
        placeholder="Поиск по названию услуги"
        value={tempSearch}
        onChange={onTempSearchChange}
        onKeyDown={searchHandler}
        style={{ marginRight: 8 }}
      />
      <Button type="primary" onClick={onSearch}>
        Поиск
      </Button>
    </div>
  );
};