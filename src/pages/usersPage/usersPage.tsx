import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { BackButton } from "../../components/backButton";
import { Button, Spin } from "antd";
import { Pagination } from "../../components/pagination/pagination";
import { useUserQuery } from "../../hooks/users/useUserQuery";
import { UsersTable } from "./components/usersTable";
import { useNavigate } from "react-router-dom";
import { useUserMutations } from "../../hooks/users/useUserMutation";
import { UserCreateModal } from "./components/userCreateModal";
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

  const totalPages = users_data?.total
    ? Math.ceil(users_data?.total / pageSize)
    : 0;

  const handlePageChange = useCallback(
    (newPage: number) => {
      dispatch(setPage(newPage));
    },
    [dispatch]
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      dispatch(setPageSize(newPageSize));
    },
    [dispatch]
  );

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
                  type="primary"
                  onClick={handleCreateClick}
                  style={{ marginBottom: 16 }}
                >
                  Добавить пользователя
                </Button>
                <UsersTable
                  users={users_data?.users}
                  onRowClick={handleRowClick}
                  onSortChange={handleSortChange}
                  onFilterChange={handleFilterChange}
                  filters={filters} // Передаем фильтры в таблицу
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={users_data?.total || 0}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
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
