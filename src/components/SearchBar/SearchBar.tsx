import React, { useCallback } from "react";
import "./SearchBar.css"; // Подключаем CSS

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
  }, [])

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Поиск по названию услуги"
        value={tempSearch}
        onChange={onTempSearchChange}
        onKeyDown={searchHandler}
      />
      <button onClick={onSearch}>Поиск</button>
    </div>
  );
};
