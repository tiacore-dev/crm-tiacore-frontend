// src/pages/ServiceDetailsPage.tsx
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { fetchServiceDetails } from "./api/servicesApi"; // Импортируем запросы
import Breadcrumbs from "./Breadcrumbs";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal"; // Импортируем модалку удаления
import EditServiceModal from "./components/EditModals"; // Импортируем модалку редактирования
import { useServiceMutations } from "./hooks/useServiceMutations"; // Импортируем мутации

const ServiceDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { service_id } = useParams<{ service_id: string }>();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);

  const {
    data: serviceDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["serviceDetails", service_id],
    queryFn: () => fetchServiceDetails(service_id!),
    retry: false,
  });

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
    setShowConfirm(false);
    deleteMutation.mutate();
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
      updateMutation.mutate(editedData);
    } else {
      toast.error("Название услуги должно содержать минимум 3 символа");
    }
  };

  return (
    <div>
      <Breadcrumbs
        paths={[
          { label: "Главная страница", to: "/" },
          { label: "Услуги", to: "/services" },
          {
            label: serviceDetails?.service_name,
            to: `/services/${service_id}`,
          },
        ]}
      />
      {!isError && (
        <>
          <h1>Детали услуги:</h1>
          <div>
            <p>
              <strong>Название услуги:</strong> {serviceDetails?.service_name}
            </p>
            <button onClick={() => setIsEditing(true)}>Редактировать</button>
          </div>

          <button onClick={() => setShowConfirm(true)} className="red-button">
            Удалить
          </button>

          {isEditing && (
            <EditServiceModal
              editedData={editedData}
              onChange={handleEditChange}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          )}

          {showConfirm && (
            <ConfirmDeleteModal
              onConfirm={handleDelete}
              onCancel={() => setShowConfirm(false)}
            />
          )}
        </>
      )}
      {isError && <button onClick={() => navigate(-1)}>Вернуться назад</button>}
    </div>
  );
};

export default ServiceDetailsPage;
