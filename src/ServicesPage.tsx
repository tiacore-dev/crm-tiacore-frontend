// src/pages/ServicesPage.tsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchServices, createService } from "./api/servicesApi"; // Импортируем запросы
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Breadcrumbs from "./Breadcrumbs";
import Pagination from "./components/Pagination";

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isCreating, setIsCreating] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); // Состояние для выбора количества элементов
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
  });

  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setIsCreating(false);
      setNewServiceName("");
      toast.success("Услуга успешно добавлена");
    },
    onError: () => {
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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Сбрасываем текущую страницу на первую
  };

  const totalPages = Math.ceil(services_data?.total / pageSize);

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setOrder(order === "asc" ? "desc" : "asc"); // Переключение порядка сортировки
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (isError) {
    return <div>Ошибка при загрузке</div>;
  }

  return (
    <div>
      <Breadcrumbs
        paths={[
          { label: "Главная страница", to: "/" },
          { label: "Услуги", to: "/services" },
        ]}
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSortChange("service_name")}>
              Название услуги
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
              Отменить
            </button>
          </div>
        </>
      )}

      {services_data?.total > pageSize && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={services_data.total}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
};

export default ServicesPage;
