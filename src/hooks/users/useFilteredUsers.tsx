// src/pages/useFilteredUsers.tsx
import { useMemo } from "react";
import { IUser } from "../../api/usersApi";

interface UseFilteredUsersProps {
  users: IUser[] | undefined;
  filters: Record<string, any>;
  currentPage: number;
  pageSize: number;
}

export const useFilteredUsers = ({
  users,
  filters,
  currentPage,
  pageSize,
}: UseFilteredUsersProps) => {
  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users.filter((user) => {
      const matchesPosition =
        !filters.position ||
        filters.position.length === 0 ||
        filters.position.includes(user.position);
      const matchesUsername =
        !filters.username ||
        filters.username.length === 0 ||
        user.username.toLowerCase().includes(filters.username[0].toLowerCase());
      const matchesFullName =
        !filters.full_name ||
        filters.full_name.length === 0 ||
        user.full_name
          .toLowerCase()
          .includes(filters.full_name[0].toLowerCase());

      return matchesPosition && matchesUsername && matchesFullName;
    });
  }, [users, filters]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, currentPage, pageSize]);

  const totalFilteredCount = filteredUsers.length;
  //   console.log(filteredUsers);
  return {
    filteredUsers,
    paginatedUsers,
    totalFilteredCount,
  };
};
