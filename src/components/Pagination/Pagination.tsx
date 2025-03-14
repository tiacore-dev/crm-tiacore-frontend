import "./Pagination.css"; // Подключаем CSS

import React from "react";

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
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Количество видимых страниц вокруг текущей
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Корректируем startPage, если endPage достиг конца
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Добавляем первую страницу
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("prevEllipsis"); // Кнопка для шага назад
      }
    }

    // Добавляем страницы вокруг текущей
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Добавляем последнюю страницу
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("nextEllipsis"); // Кнопка для шага вперёд
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const handleEllipsisClick = (direction: "prev" | "next") => {
    const step = 5; // Шаг для перехода
    if (direction === "prev") {
      onPageChange(Math.max(1, currentPage - step));
    } else {
      onPageChange(Math.min(totalPages, currentPage + step));
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = Number(e.target.value);
    onPageSizeChange(newPageSize); // Передаём новое значение pageSize в родительский компонент
  };

  return (
    <div className="pagination">
      {/* Кнопки пагинации */}
      {totalItems > pageSize && (
        <div>
          {/* Кнопка "Назад" отображается только если текущая страница не первая */}
          {currentPage > 1 && (
            <button onClick={() => onPageChange(currentPage - 1)}>{"<"}</button>
          )}

          {getPageNumbers().map((page, index) =>
            page === "prevEllipsis" ? (
              <button
                key={index}
                onClick={() => handleEllipsisClick("prev")}
                className="ellipsis"
              >
                ...
              </button>
            ) : page === "nextEllipsis" ? (
              <button
                key={index}
                onClick={() => handleEllipsisClick("next")}
                className="ellipsis"
              >
                ...
              </button>
            ) : (
              <button
                key={index}
                onClick={() => onPageChange(page as number)}
                className={currentPage === page ? "active" : ""}
              >
                {page}
              </button>
            )
          )}

          {/* Кнопка "Вперёд" отображается только если текущая страница не последняя */}
          {currentPage < totalPages && (
            <button onClick={() => onPageChange(currentPage + 1)}>{">"}</button>
          )}
        </div>
      )}
      {/* Выбор количества элементов на странице */}
      <div className="page-size-selector">
        <label>
          <select value={pageSize} onChange={handlePageSizeChange}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={40}>40</option>
            <option value={60}>60</option>
            <option value={80}>80</option>
            <option value={100}>100</option>
          </select>
        </label>
      </div>
    </div>
  );
};
