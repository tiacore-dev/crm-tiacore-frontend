// src/pages/ServiceDetailsPage.tsx
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchServiceDetails,
  updateService,
  deleteService,
} from "./api/servicesApi"; // Импортируем запросы
import Breadcrumbs from "./Breadcrumbs";
import toast from "react-hot-toast";

const ServiceDetailsPage: React.FC = () => {
  const { service_id } = useParams<{ service_id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  useEffect(() => {
    if (isEditing && serviceDetails) {
      setEditedData(serviceDetails);
    }
  }, [isEditing, serviceDetails]);

  const deleteMutation = useMutation({
    mutationFn: () => deleteService(service_id!),
    onSuccess: () => {
      toast.success("Услуга успешно удалена");
      navigate(-1);
    },
    onError: () => {
      toast.error("Ошибка при удалении услуги");
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => updateService(service_id!, editedData),
    onSuccess: () => {
      queryClient.setQueryData(["serviceDetails", service_id], editedData);
      setIsEditing(false);
      toast.success("Услуга успешно обновлена");
    },
    onError: () => {
      toast.error("Ошибка при обновлении данных");
    },
  });

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
      updateMutation.mutate();
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
            <>
              <div className="modal-overlay" onClick={handleCancelEdit}></div>
              <div className="modal">
                <h3>Редактирование услуги</h3>
                <label>
                  Название услуги:
                  <input
                    type="text"
                    name="service_name"
                    value={editedData?.service_name || ""}
                    onChange={handleEditChange}
                  />
                </label>
                <div>
                  <button onClick={handleSaveEdit}>Сохранить</button>
                  <button onClick={handleCancelEdit} className="red-button">
                    Отменить
                  </button>
                </div>
              </div>
            </>
          )}

          {showConfirm && (
            <>
              <div
                className="modal-overlay"
                onClick={() => setShowConfirm(false)}
              ></div>
              <div className="modal">
                <p>Вы уверены, что хотите удалить услугу?</p>
                <button onClick={handleDelete} className="red-button">
                  Да, удалить
                </button>
                <button onClick={() => setShowConfirm(false)}>Отмена</button>
              </div>
            </>
          )}
        </>
      )}
      {isError && <button onClick={() => navigate(-1)}>Вернуться назад</button>}
    </div>
  );
};

export default ServiceDetailsPage;
