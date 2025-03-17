import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../../api/usersApi"; // Импортируем запросы
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";

export const UsersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); 
  const [search, setSearch] = useState(""); 
  const [sortBy, setSortBy] = useState("user_name");
  const [order, setOrder] = useState("asc"); 
  const [isCreating, setIsCreating] = useState(false);

  const dispatch = useDispatch();


  const handleCreateClick = () => {
    setIsCreating(true);
  };

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Пользователи", to: "/users" },
      ])
    );
  }, [dispatch]);

  const {
    data: users_data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users", currentPage, pageSize, search, sortBy, order],
    queryFn: () => fetchUsers(search, sortBy, order, currentPage, pageSize),
  });



  return <div>
    <div className="main-container">
    <button onClick={handleCreateClick}>Создать новую услугу</button>
    users
    </div>
              {/* {isCreating && (
                <CreateUserModal
                  newUserName={newUserName}
                  setNewUserName={setNewUserName}
                  onCreate={handleCreateUser}
                  onCancel={handleCancelCreate}
                  isCreatingLoading={createMutation.isPending}
                />
              )} */}
    </div>;
};
