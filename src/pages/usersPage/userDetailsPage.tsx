import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUserDetails } from "../../api/usersApi";
import { useUserDetailsQuery } from "../../hooks/users/useUserQuery";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { Button, Spin } from "antd";
import { BackButton } from "../../components/backButton";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import { useUserMutations } from "../../hooks/users/useUserMutation";
import { UserDetails } from "./components/userDetails";
import { UserEditModal } from "./components/userEditModal";

export interface UserData {
  username: string;
  full_name: string;
  position: string;
}

export const UserDetailsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user_id } = useParams<{ user_id: string }>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [editedData, setEditedData] = useState<UserData | null>(null);

  const {
    data: userDetails,
    isLoading,
    isError,
  } = useUserDetailsQuery(user_id!);

  useEffect(() => {
    if (userDetails) {
      dispatch(
        setBreadcrumbs([
          { label: "Главная страница", to: "/home" },
          { label: "Пользователи", to: "/users" },
          { label: userDetails.full_name, to: `/users/${user_id}` },
        ])
      );
    }
  }, [dispatch, userDetails, user_id]);

  const { updateMutation, deleteMutation } = useUserMutations(user_id!);

  const handleDelete = useCallback(() => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        navigate("/users");
      },
      onError: () => {},
    });
  }, [deleteMutation, navigate]);

  const handleCancelEdit = useCallback(() => {
    setEditedData(userDetails);
    setIsEditing(false);
  }, [userDetails]);

  const handleSaveEdit = useCallback(() => {
    if (editedData) {
      updateMutation.mutate(editedData, {
        onSuccess: () => {
          setIsEditing(false);
          setEditedData(null);
          // Обновляем данные пользователя после успешного редактирования
          if (userDetails) {
            setEditedData({
              username: userDetails.username,
              full_name: userDetails.full_name,
              position: userDetails.position,
            });
          }
        },
        onError: () => {},
      });
    }
  }, [editedData, updateMutation, userDetails]);

  const handleEditChange = useCallback((field: string, value: string) => {
    setEditedData((prevData) => {
      if (prevData) {
        return {
          ...prevData,
          [field]: value,
        };
      }
      return null;
    });
  }, []);

  return (
    <div>
      {isLoading ? (
        <Spin size="large" className="center-spin" />
      ) : (
        <>
          {!isError && (
            <>
              <div className="main-container">
                <Button onClick={() => setIsEditing(true)}>
                  Редактировать
                </Button>
                <Button
                  danger
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{ margin: 8 }}
                >
                  Удалить
                </Button>
                <UserDetails
                  userName={userDetails?.username || ""}
                  userFullName={userDetails?.full_name || ""}
                  userPosition={userDetails?.position || ""}
                />
              </div>
              {isEditing && (
                <UserEditModal
                  editedData={userDetails}
                  onChange={handleEditChange}
                  onSave={handleSaveEdit}
                  onCancel={handleCancelEdit}
                  isUpdateLoading={updateMutation.isPending}
                />
              )}
              {showDeleteConfirm && (
                <ConfirmDeleteModal
                  onConfirm={handleDelete}
                  onCancel={() => setShowDeleteConfirm(false)}
                  isDeleteLoading={deleteMutation.isPending}
                />
              )}
            </>
          )}
          {isError && <BackButton />}
        </>
      )}
    </div>
  );
};
