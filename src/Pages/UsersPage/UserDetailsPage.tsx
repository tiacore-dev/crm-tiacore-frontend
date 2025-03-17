import React from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUserDetails } from "../../api/usersApi"; // Импортируем запросы

export const UserDetailsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user_id } = useParams<{ user_id: string }>();
  // const userDetails = useSelector((state: RootState) => state.users.details);

  // useEffect(() => {
  //   dispatch(
  //     setBreadcrumbs([
  //       { label: "Главная страница", to: "/" },
  //       { label: "Пользователи", to: "/users" },
  //     ])
  //   );
  // }, [dispatch]);

  const {
    data: userDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userDetails", user_id],
    queryFn: () => fetchUserDetails(user_id!),
    retry: false,
  });

  return <div>{/* <Breadcrumbs /> */}</div>;
};
