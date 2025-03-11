import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // Импортируем useQueryClient
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "./axiosConfig";

const fetchServiceDetails = async (service_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.get(
    `${url}/api/services/${service_id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const updateService = async (service_id: string, updatedData: any) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.patch(
    `${url}/api/services/${service_id}`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const deleteService = async (service_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");

  await axiosInstance.delete(`${url}/api/services/${service_id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};

const ServiceDetailsPage: React.FC = () => {
  const { service_id } = useParams<{ service_id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Используем useQueryClient

  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

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
      setEditedData(serviceDetails);
    }
  }, [serviceDetails]);

  const deleteMutation = useMutation({
    mutationFn: () => deleteService(service_id!),
    onSuccess: () => {
      navigate(-1); // После удаления вернуться назад
    },
    onError: (error) => {
      setErrorMessage("Ошибка при удалении");
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => updateService(service_id!, editedData),
    onSuccess: () => {
      queryClient.setQueryData(["serviceDetails", service_id], editedData);
      setIsEditing(false); // Выключаем режим редактирования после успешного обновления
    },
    onError: (error) => {
      setErrorMessage("Ошибка при обновлении данных");
    },
  });

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (isError) {
    return (
      <div>
        <p>Ошибка при получении данных</p>
        <button onClick={() => navigate(-1)}>Вернуться назад</button>
      </div>
    );
  }
  //_______________Delete

  const handleDelete = () => {
    setShowConfirm(false);
    deleteMutation.mutate();
  };

  //_______________Edit
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleCancelEdit = () => {
    setEditedData(serviceDetails);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    updateMutation.mutate();
  };
  //_______________

  return (
    <div>
      <button onClick={() => navigate(-1)}>Вернуться назад</button>
      <h1>Детали услуги:</h1>
      {isEditing ? (
        <div>
          <label>
            Название услуги:
            <input
              type="text"
              name="service_name"
              value={editedData?.service_name}
              onChange={handleEditChange}
            />
          </label>
          <div>
            <button onClick={handleSaveEdit}>Сохранить</button>
            <button onClick={handleCancelEdit}>Отменить</button>
          </div>
        </div>
      ) : (
        <div>
          <p>
            <strong>Название услуги:</strong> {serviceDetails?.service_name}
          </p>
          <button onClick={() => setIsEditing(true)}>Редактировать</button>
        </div>
      )}
      <button onClick={() => setShowConfirm(true)}>Удалить</button>
      {showConfirm && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            textAlign: "center",
            zIndex: 1000,
          }}
        >
          <p>Вы уверены, что хотите удалить услугу?</p>
          <button onClick={() => handleDelete()}>Да, удалить</button>
          <button onClick={() => setShowConfirm(false)}>Отмена</button>
        </div>
      )}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default ServiceDetailsPage;
