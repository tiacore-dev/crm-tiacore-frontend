import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { fetchUsers,  fetchUserDetails, IUser } from "../../api/usersApi";
import { usersSelector } from "../../redux/slices/usersSlice";

interface useUserQueryResponse {
    users: IUser[],
    total: number
}

export const useUserQuery = () => {
    const { currentPage, pageSize, search, sortBy, order } = useSelector(usersSelector);
    return useQuery<useUserQueryResponse>({
        queryKey: ["users", currentPage, pageSize, search, sortBy, order],
        queryFn: () => fetchUsers(search, sortBy, order, currentPage, pageSize),
      })    
}

export const useUserDetailsQuery = (user_id: string) => {
    return useQuery({
        queryKey: ["userDetails", user_id],
        queryFn: () => fetchUserDetails(user_id),
        retry: false,
    })
}
