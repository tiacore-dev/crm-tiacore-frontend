import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchUserDetails, updateUser, deleteUser } from "./api/usersApi"; // Импортируем запросы
import Breadcrumbs from "./Breadcrumbs";

const UserDetailsPage: React.FC = () => {
  const { user_id } = useParams<{ user_id: string }>();
  const {
    data: userDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userDetails", user_id],
    queryFn: () => fetchUserDetails(user_id!),
    retry: false,
  });
  return (
    <div>
      <Breadcrumbs
        paths={[
          { label: "Главная страница", to: "/" },
          { label: "Пользователи", to: "/users" },
          {
            label: userDetails?.user_name,
            to: `/users/${user_id}`,
          },
        ]}
      />
    </div>
  );
};
