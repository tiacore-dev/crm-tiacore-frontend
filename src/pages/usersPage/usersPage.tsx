import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { BackButton } from "../../components/backButton";
import { Button, Spin } from "antd";
import { useUserQuery } from "../../hooks/users/useUserQuery";
import { UsersTable } from "./components/usersTable";
import { useNavigate } from "react-router-dom";
import { useUserMutations } from "../../hooks/users/useUserMutation";
import { UserCreateModal } from "./components/userCreateModal";
import { useFilteredUsers } from "../../hooks/users/useFilteredUsers"; // Импортируем хук для фильтрации

import {
  usersSelector,
  setPage,
  setPageSize,
  setSearch,
  setSort,
  setFilters,
} from "../../redux/slices/usersSlice";

export const UsersPage: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newPosition, setNewPosition] = useState("");
  const { createMutation } = useUserMutations();

  const { currentPage, pageSize, search, sortBy, order, filters } =
    useSelector(usersSelector);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Пользователи", to: "/users" },
      ])
    );
  }, [dispatch]);

  const { data: users_data, isLoading, isError } = useUserQuery();
  const { filteredUsers, paginatedUsers, totalFilteredCount } =
    useFilteredUsers({
      users: users_data?.users,
      filters,
      currentPage,
      pageSize,
    });

  const handleRowClick = useCallback(
    (user_id: string) => {
      navigate(`/users/${user_id}`);
    },
    [navigate]
  );

  const handleSortChange = useCallback(
    (newSortBy: string) => {
      dispatch(
        setSort({ sortBy: newSortBy, order: order === "asc" ? "desc" : "asc" })
      );
    },
    [dispatch, order]
  );

  const handleCreateClick = useCallback(() => {
    setIsCreating(true);
  }, []);

  const handleFilterChange = useCallback(
    (newFilters: Record<string, any>) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const handleCreateUser = useCallback(() => {
    createMutation.mutate(
      {
        username: newUserName,
        password: newPassword,
        full_name: newFullName,
        position: newPosition,
      },
      {
        onSuccess: (data) => {
          setIsCreating(false);
          setNewUserName("");
          setNewPassword("");
          setNewFullName("");
          setNewPosition("");
        },
      }
    );
  }, [newUserName, newPassword, newFullName, newPosition, createMutation]);

  const handleCancelCreate = useCallback(() => {
    setIsCreating(false);
    setNewUserName("");
  }, []);

  return (
    <div>
      {isLoading ? (
        <Spin size="large" className="center-spin" />
      ) : (
        <>
          {!isError && (
            <div>
              <div className="main-container">
                <Button
                  onClick={handleCreateClick}
                  style={{ marginBottom: 16 }}
                >
                  Добавить пользователя
                </Button>
                <Button
                  onClick={() => handleFilterChange({})}
                  style={{ marginLeft: 8, marginBottom: 16 }}
                >
                  Сбросить фильтры
                </Button>
                <UsersTable
                  users={paginatedUsers} // Используем отфильтрованные и пагинированные данные
                  onRowClick={handleRowClick}
                  onSortChange={handleSortChange}
                  onFilterChange={handleFilterChange}
                  filters={filters}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalItems={totalFilteredCount || 0} // Используем общее количество отфильтрованных пользователей
                  onPageChange={(page) => dispatch(setPage(page))}
                  onPageSizeChange={(size) => dispatch(setPageSize(size))}
                />
              </div>
              {isCreating && (
                <UserCreateModal
                  newUserName={newUserName}
                  newPassword={newPassword}
                  newFullName={newFullName}
                  newPosition={newPosition}
                  setNewUserName={setNewUserName}
                  setNewPassword={setNewPassword}
                  setNewFullName={setNewFullName}
                  setNewPosition={setNewPosition}
                  onCreate={handleCreateUser}
                  onCancel={handleCancelCreate}
                  isCreatingLoading={createMutation.isPending}
                />
              )}
            </div>
          )}
          {isError && <BackButton />}
        </>
      )}
    </div>
  );
};
