// src/components/SearchBar.tsx
import React from "react";
import "./SearchBar.css"; // Подключаем CSS

interface SearchBarProps {
  tempSearch: string;
  onTempSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  tempSearch,
  onTempSearchChange,
  onSearch,
}) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Поиск по названию услуги"
        value={tempSearch}
        onChange={onTempSearchChange}
      />
      <button onClick={onSearch}>Поиск</button>
    </div>
  );
};

export default SearchBar;
