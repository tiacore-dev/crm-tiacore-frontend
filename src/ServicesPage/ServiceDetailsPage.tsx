import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { fetchServiceDetails } from "../api/servicesApi"; // Импортируем запросы
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../redux/slices/breadcrumbsSlice";
import { ServiceDetails } from "./components/ServiceDetails"; // Импортируем новый компонент
import { ConfirmDeleteModal } from "../components/Modals/ConfirmDeleteModal"; // Импортируем модалку удаления
import { EditServiceModal } from "./components/ServiceEditModals"; // Импортируем модалку редактирования
import { useServiceMutations } from "../hooks/useServiceMutations"; // Импортируем мутации

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
  } = useQuery({
    queryKey: ["serviceDetails", service_id],
    queryFn: () => fetchServiceDetails(service_id!),
    retry: false,
  });

  useEffect(() => {
    if (serviceDetails) {
      dispatch(
        setBreadcrumbs([
          { label: "Главная страница", to: "/" },
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

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        navigate("/services");
      },
      onError: () => {},
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleCancelEdit = () => {
    setEditedData(serviceDetails);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (editedData?.service_name.trim().length >= 3) {
      updateMutation.mutate(editedData, {
        onSuccess: () => {
          setIsEditing(false);
        },
        onError: () => {},
      });
    } else {
      toast.error("Название услуги должно содержать минимум 3 символа");
    }
  };

  return (
    <div>
      {!isError && (
        <>
          {" "}
          <div className="main-container">
            <ServiceDetails
              serviceName={serviceDetails?.service_name || ""}
              onEdit={() => setIsEditing(true)}
            />
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="red-button"
            >
              Удалить
            </button>
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
      )}
      {isError && <button onClick={() => navigate(-1)}>Вернуться назад</button>}
    </div>
  );
};
