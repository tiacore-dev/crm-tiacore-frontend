import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "./axiosConfig";
// import { AxiosError } from "axios"; // Импортируем AxiosError из axios
import { toast, ToastContainer } from "react-toastify";
import Breadcrumbs from "./Breadcrumbs";

import "react-toastify/dist/ReactToastify.css";

const fetchServiceDetails = async (service_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  // try {
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
  // } catch (error) {
  //   const axiosError = error as AxiosError;
  //   if (axiosError.response && axiosError.response.status === 500) {
  //     toast.error("Ошибка при загрузке страницы");
  //     console.log("500");
  //   } else {
  //     toast.error("Неизвестная ошибка");
  //   }
  //   throw error; // Пробрасываем ошибку дальше
  // }
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
  const queryClient = useQueryClient();

  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);

  const {
    data: serviceDetails,
    isLoading,
    isError,
    // error,
  } = useQuery({
    queryKey: ["serviceDetails", service_id],
    queryFn: () => fetchServiceDetails(service_id!),
    retry: false,
  });

  // useEffect(() => {
  //   if (isError) {
  //     toast.error("Ошибка при загрузке данных услуги");
  //     console.error("Error loading data:", error);
  //   }
  // }, [isError, error]);

  useEffect(() => {
    if (isEditing && serviceDetails) {
      setEditedData(serviceDetails);
    }
  }, [isEditing, serviceDetails]);

  const deleteMutation = useMutation({
    mutationFn: () => deleteService(service_id!),
    onSuccess: () => {
      toast.success("Услуга успешно удалена");
      navigate(-1); // После удаления вернуться назад
    },
    onError: (error) => {
      toast.error("Ошибка при удалении услуги");
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => updateService(service_id!, editedData),
    onSuccess: () => {
      queryClient.setQueryData(["serviceDetails", service_id], editedData);
      setIsEditing(false); // Выключаем режим редактирования после успешного обновления
      toast.success("Услуга успешно обновлена");
    },
    onError: (error) => {
      toast.error("Ошибка при обновлении данных");
    },
  });

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  // const showErrorLastTry = () => {
  //   toast.error("Ошибка при загрузке данных!!!!");
  // };

  if (isError) {
    navigate(-1); // После удаления вернуться назад
    // showErrorLastTry();
    // return <div>"FIBGRF"</div>; // Возвращаем null???
    return null;
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
    updateMutation.mutate();
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <Breadcrumbs
        paths={[
          { label: "Главная страница", to: "/" },
          { label: "Услуги", to: "/services" },
          // { label: "service_name", to: "/services/${service_id}" },
          {
            label: serviceDetails?.service_name,
            to: `/services/${service_id}`,
          },
        ]}
      />
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
    </div>
  );
};

export default ServiceDetailsPage;
