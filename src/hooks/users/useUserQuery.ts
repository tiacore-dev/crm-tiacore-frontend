//src\hooks\users\useUserQuery.ts
import { useQuery } from "@tanstack/react-query";
// import { useSelector } from "react-redux";
import { fetchUsers, fetchUserDetails, IUser } from "../../api/usersApi";
import { useCompany } from "../../context/companyContext";
import { useNavigate } from "react-router-dom";

export interface useUserQueryResponse {
  total: number;
  users: IUser[];
}

export const useUserQueryAll = () => {
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  return useQuery<useUserQueryResponse>({
    queryKey: ["users_all", selectedCompanyId],
    queryFn: () => fetchUsers(selectedCompanyId),
  });
};

export const useUserDetailsQuery = (user_id: string) => {
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  const navigate = useNavigate();

  return useQuery({
    queryKey: ["userDetails", user_id],
    queryFn: () => {
      return fetchUserDetails(user_id, selectedCompanyId).catch((error) => {
        if (error.response?.status === 404) {
          navigate("/404", { replace: true }); // Перенаправление с заменой в истории
        }
        throw error; // Продолжаем пробрасывать ошибку
      });
    },
    retry: false,
  });
};
