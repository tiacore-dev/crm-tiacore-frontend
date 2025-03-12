import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axiosConfig";
import { useNavigate } from "react-router-dom";
// import "react-toastify/dist/ReactToastify.css";
import toast from "react-hot-toast";
import Breadcrumbs from "./Breadcrumbs";

const fetchServices = async (
  search: string,
  sort_by: string,
  order: string,
  page: number,
  page_size: number
) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.get(`${url}/api/services/all`, {
    params: {
      search,
      sort_by,
      order,
      page,
      page_size,
    },
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

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState(""); //_
  const [sortBy, setSortBy] = useState("service_name");
  const [order, setOrder] = useState("asc"); //_

  const {
    data: services_data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["services", currentPage, pageSize, search, sortBy, order],
    queryFn: () => fetchServices(search, sortBy, order, currentPage, pageSize),
    // keepPreviousData: true, // Сохраняем предыдущие данные при изменении страницы
  });

  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setIsCreating(false);
      setNewServiceName("");
      toast.success("Услуга успешно добавлена");
    },
    onError: (error) => {
      toast.error("Ошибка при добавлении услуги");
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
    if (newServiceName.trim().length >= 3) {
      createMutation.mutate({ service_name: newServiceName });
    } else {
      toast.error("Название услуги должно содержать минимум 3 символа");
    }
  };

  const handleRowClick = (service_id: string) => {
    navigate(`/services/${service_id}`);
  };
  //_______________________________________________________________________
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setOrder(order === "asc" ? "desc" : "asc"); // Переключение порядка сортировки
  };

  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearch(e.target.value);
  //   setCurrentPage(1); // Сброс страницы при изменении поискового запроса
  // };
  //_______________________________________________________________________

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (isError) {
    return <div>Ошибка при загрузке</div>;
  }

  return (
    <div>
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
      <Breadcrumbs
        paths={[
          { label: "Главная страница", to: "/" },
          { label: "Услуги", to: "/services" },
        ]}
      />

      {/* Поиск */}
      {/* <div>
        <input
          type="text"
          placeholder="Поиск по услуге"
          value={search}
          onChange={handleSearchChange}
        />
      </div> */}

      <table>
        <thead>
          <tr>
            <th>
              <button onClick={() => handleSortChange("service_name")}>
                Название услуги
              </button>
            </th>
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
            <button onClick={handleCancelCreate} className="red-button">
              Отменить{" "}
            </button>
          </div>
        </>
      )}

      {/* Пагинация */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Предыдущая
        </button>
        <span>Страница {currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={services_data?.services.length < pageSize}
        >
          Следующая
        </button>
      </div>
    </div>
  );
};

export default ServicesPage;
