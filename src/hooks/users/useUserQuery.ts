//src\hooks\users\useUserQuery.ts
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { fetchUsers, fetchUserDetails, IUser } from "../../api/usersApi";
import { usersSelector } from "../../redux/slices/usersSlice";

export interface useUserQueryResponse {
  total: number;
  users: IUser[];
}

export const useUserQuery = () => {
  const { page, page_size } = useSelector(usersSelector);
  return useQuery<useUserQueryResponse>({
    queryKey: ["users"],
    queryFn: () => fetchUsers(page, page_size),
  });
};

export const useUserQueryAll = () => {
  return useQuery<useUserQueryResponse>({
    queryKey: ["users_all"],
    queryFn: () => fetchUsers(1, 100),
  });
};

export const useUserDetailsQuery = (user_id: string) => {
  return useQuery({
    queryKey: ["userDetails", user_id],
    queryFn: () => fetchUserDetails(user_id),
    retry: false,
  });
};
