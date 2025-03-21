//src\hooks\users\useUserQuery.ts
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { fetchUsers, fetchUserDetails, IUser } from "../../api/usersApi";
import { usersSelector } from "../../redux/slices/usersSlice";

interface useUserQueryResponse {
  users: IUser[];
  total: number;
}

export const useUserQuery = () => {
  const { currentPage, pageSize, sortBy, order } = useSelector(usersSelector);
  return useQuery<useUserQueryResponse>({
    queryKey: ["users", currentPage, pageSize, sortBy, order],
    // queryFn: () => fetchUsers(sortBy, order),
    queryFn: () => fetchUsers(sortBy, order, 1, 100),
  });
};

export const useUserDetailsQuery = (user_id: string) => {
  return useQuery({
    queryKey: ["userDetails", user_id],
    queryFn: () => fetchUserDetails(user_id),
    retry: false,
  });
};
