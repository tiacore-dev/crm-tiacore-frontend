import React, {useEffect} from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUserDetails } from "../../api/usersApi"; // Импортируем запросы
import { useUserDetailsQuery } from "../../hooks/users/useUserQuery";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { Button, Spin } from "antd";
import { BackButton } from "../../components/backButton";


export const UserDetailsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user_id } = useParams<{ user_id: string }>();

  
  
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
                  { label: "Услуги", to: "/users" },
                  { label: userDetails.username, to: `/users/${user_id}` },
              ])
          );
      }
  }, [dispatch, userDetails, user_id]);

  return (
    <div>
        {isLoading ? (
            <Spin size="large" className="center-spin" />
        ) : (
            <>
                {/* {!isError && (
                    <>
                        <div className="main-container">
                            <ServiceDetails
                                serviceName={serviceDetails?.service_name || ""}
                                onEdit={() => setIsEditing(true)}
                            />
                            <Button
                                type="primary"
                                danger
                                onClick={() => setShowDeleteConfirm(true)}
                                style={{ marginTop: 16 }}
                            >
                                Удалить
                            </Button>
                        </div>
                        {isEditing && (
                            <EditServiceModal
                                editedData={editedData}
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
                )} */}
                {isError && <BackButton />}
            </>
        )}
    </div>
);};
