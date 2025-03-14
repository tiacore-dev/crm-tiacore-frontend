// src/pages/ServiceDetailsPage.tsx
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { fetchServiceDetails } from "./api/servicesApi"; // Импортируем запросы
import Breadcrumbs from "./Breadcrumbs";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { setBreadcrumbs } from "./redux/slices/breadcrumbsSlice";
import ServiceDetails from "./components/ServiceDetails"; // Импортируем новый компонент
import ConfirmDeleteModal from "./components/ConfirmDeleteModal"; // Импортируем модалку удаления
import EditServiceModal from "./components/EditModals"; // Импортируем модалку редактирования
import { useServiceMutations } from "./hooks/useServiceMutations"; // Импортируем мутации

const ServiceDetailsPage: React.FC = () => {
  // const [breadcrumbs, setBreadcrumbs] = useState([
  //   { label: "Главная страница", to: "/" },
  //   { label: "Услуги", to: "/services" },
  // ]);

  const navigate = useNavigate();
  const { service_id } = useParams<{ service_id: string }>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false); // Состояние загрузки при создании услуги
  const [isDeleteLoading, setIsDeleteLoading] = useState(false); // Состояние загрузки при создании услуги
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
    setIsDeleteLoading(true); // Устанавливаем состояние загрузки перед удалением

    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setIsDeleteLoading(false);
        setShowDeleteConfirm(false);
        navigate("/services"); // Перенаправляем на список услуг
      },
      onError: () => {
        setIsDeleteLoading(false);
      },
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
      setIsUpdateLoading(true);
      // updateMutation.mutate(editedData);
      //______________________________________________________________
      updateMutation.mutate(editedData, {
        onSuccess: () => {
          setIsUpdateLoading(false);
          setIsEditing(false);
        },
        onError: () => {
          setIsUpdateLoading(false);
        },
      });
      //______________________________________________________________
    } else {
      toast.error("Название услуги должно содержать минимум 3 символа");
    }
  };

  return (
    <div>
      {!isError && (
        <>
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

          {isEditing && (
            <EditServiceModal
              editedData={editedData}
              onChange={handleEditChange}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
              isUpdateLoading={isUpdateLoading}
            />
          )}

          {showDeleteConfirm && (
            <ConfirmDeleteModal
              onConfirm={handleDelete}
              onCancel={() => setShowDeleteConfirm(false)}
              isDeleteLoading={isDeleteLoading}
            />
          )}
        </>
      )}
      {isError && <button onClick={() => navigate(-1)}>Вернуться назад</button>}
    </div>
  );
};

export default ServiceDetailsPage;
