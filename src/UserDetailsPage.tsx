import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { setBreadcrumbs } from "./redux/slices/breadcrumbsSlice";
import Breadcrumbs from "./Breadcrumbs";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserDetails, updateUser, deleteUser } from "./api/usersApi"; // Импортируем запросы

const UserDetailsPage: React.FC = () => {
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
