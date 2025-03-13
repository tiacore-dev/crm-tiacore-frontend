import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import Breadcrumbs from "./Breadcrumbs";
import { fetchUsers, createUser } from "./api/usersApi"; // Импортируем запросы

const UsersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); // Состояние для выбора количества элементов
  const [search, setSearch] = useState(""); //_
  const [sortBy, setSortBy] = useState("user_name");
  const [order, setOrder] = useState("asc"); //_

  const {
    data: users_data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users", currentPage, pageSize, search, sortBy, order],
    queryFn: () => fetchUsers(search, sortBy, order, currentPage, pageSize),
  });

  return (
    <div>
      <Breadcrumbs
        paths={[
          { label: "Главная страница", to: "/" },
          { label: "Пользователи", to: "/users" },
        ]}
      />
      users
    </div>
  );
};

export default UsersPage;
