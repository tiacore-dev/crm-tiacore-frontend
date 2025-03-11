import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axiosConfig";
import { useNavigate } from "react-router-dom";

const fetchServices = async () => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.get(`${url}/api/services/all`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

const createService = async (newService: { service_name: string }) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.post(
    `${url}/api/services/add`,
    newService,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isCreating, setIsCreating] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    data: services_data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setIsCreating(false);
      setNewServiceName("");
    },
    onError: (error) => {
      setErrorMessage("Ошибка при создании услуги");
    },
  });

  const handleCreateClick = () => {
    setIsCreating(true);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setNewServiceName("");
  };

  const handleCreateService = () => {
    if (newServiceName.trim()) {
      createMutation.mutate({ service_name: newServiceName });
    } else {
      setErrorMessage("Название услуги не может быть пустым");
    }
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (isError) {
    return <div>Ошибка при загрузке</div>;
  }

  const handleRowClick = (service_id: string) => {
    navigate(`/services/${service_id}`);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Название услуги</th>
            <th>
              <button onClick={handleCreateClick}>Создать новую услугу</button>
            </th>
          </tr>
        </thead>
        <tbody>
          {services_data?.services.map((service: any) => (
            <tr
              key={service.service_id}
              onClick={() => handleRowClick(service.service_id)}
              style={{ cursor: "pointer" }}
            >
              <td>{service.service_name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {isCreating && (
        <>
          <div className="modal-overlay" onClick={handleCancelCreate}></div>
          <div className="modal">
            <h3>Создание новой услуги</h3>
            <input
              type="text"
              placeholder="Введите название услуги"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
            />
            <button onClick={handleCreateService}>Создать</button>
            <button onClick={handleCancelCreate}>Отменить</button>
            {errorMessage && <p>{errorMessage}</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default ServicesPage;
