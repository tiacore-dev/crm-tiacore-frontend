import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { ServiceDetails } from "./components/serviceDetails";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import { ServiceEditModal } from "./components/serviceEditModal";
import { useServiceMutations } from "../../hooks/services/useServiceMutations";
import { Button, Spin } from "antd";
import { BackButton } from "../../components/backButton";
import { useServiceDetailsQuery } from "../../hooks/services/useServiceQuery";

export const ServiceDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { service_id } = useParams<{ service_id: string }>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);
  const dispatch = useDispatch();

  const {
    data: serviceDetails,
    isLoading,
    isError,
  } = useServiceDetailsQuery(service_id!);

  useEffect(() => {
    if (serviceDetails) {
      dispatch(
        setBreadcrumbs([
          { label: "Главная страница", to: "/home" },
          { label: "Услуги", to: "/services" },
          { label: serviceDetails.service_name, to: `/services/${service_id}` },
        ])
      );
    }
  }, [dispatch, serviceDetails, service_id]);

  const { updateMutation, deleteMutation } = useServiceMutations(
    service_id!,
    setIsEditing
  );

  useEffect(() => {
    if (isEditing && serviceDetails) {
      setEditedData(serviceDetails);
    }
  }, [isEditing, serviceDetails]);

  const handleDelete = useCallback(() => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        navigate("/services");
      },
      onError: () => {},
    });
  }, [deleteMutation, navigate]);

  const handleEditChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setEditedData((prevData: any) => ({ ...prevData, [name]: value }));
    },
    []
  );

  const handleCancelEdit = useCallback(() => {
    setEditedData(serviceDetails);
    setIsEditing(false);
  }, [serviceDetails]);

  const handleSaveEdit = useCallback(() => {
    updateMutation.mutate(editedData, {
      onSuccess: () => {
        setIsEditing(false);
      },
      onError: () => {},
    });
  }, [editedData, updateMutation]);

  return (
    <div>
      {isLoading ? (
        <Spin size="large" className="center-spin" />
      ) : (
        <>
          {!isError && (
            <>
              <div className="main-container">
                <Button type="primary" onClick={() => setIsEditing(true)}>
                  Редактировать
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{ margin: 8 }}
                >
                  Удалить
                </Button>
                <ServiceDetails
                  serviceName={serviceDetails?.service_name || ""}
                  onEdit={() => setIsEditing(true)}
                />
              </div>
              {isEditing && (
                <ServiceEditModal
                  editedData={editedData} // Передаем данные услуги
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
