// src/pages/ServicesPage.tsx
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchServices } from "./api/servicesApi";
import { useServiceMutations } from "./hooks/useServiceMutations";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import {
  setPage,
  setPageSize,
  setSearch,
  setSort,
} from "./redux/slices/servicesSlice";
import toast from "react-hot-toast";
import Breadcrumbs from "./Breadcrumbs";
import Pagination from "./components/Pagination";
import CreateServiceModal from "./components/CreateServiceModal";

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPage, pageSize, search, sortBy, order } = useSelector(
    (state: RootState) => state.services
  );

  const [tempSearch, setTempSearch] = useState(""); // Временное состояние для поиска

  const [isCreating, setIsCreating] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");

  const {
    data: services_data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["services", currentPage, pageSize, search, sortBy, order],
    queryFn: () => fetchServices(search, sortBy, order, currentPage, pageSize),
  });

  const { createMutation } = useServiceMutations();

  useEffect(() => {
    // Сохраняем параметры фильтрации и сортировки в Redux при изменении
    dispatch(setPage(currentPage));
    dispatch(setPageSize(pageSize));
    dispatch(setSearch(search));
    dispatch(setSort({ sortBy, order }));
  }, [dispatch, currentPage, pageSize, search, sortBy, order]);

  const handleCreateClick = () => {
    setIsCreating(true);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setNewServiceName("");
  };

  const handleCreateService = () => {
    if (newServiceName.trim().length >= 3) {
      createMutation.mutate(
        { service_name: newServiceName },
        {
          onSuccess: () => {
            setIsCreating(false);
            setNewServiceName("");
          },
        }
      );
    } else {
      toast.error("Название услуги должно содержать минимум 3 символа");
    }
  };

  const handleRowClick = (service_id: string) => {
    navigate(`/services/${service_id}`);
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    dispatch(setPageSize(newPageSize));
  };

  const handleTempSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempSearch(e.target.value); // Обновляем временное состояние поиска
  };

  const handleSearch = (searchTerm: string) => {
    dispatch(setSearch(searchTerm));
  };

  const handleSortChange = (newSortBy: string) => {
    dispatch(
      setSort({ sortBy: newSortBy, order: order === "asc" ? "desc" : "asc" })
    );
  };

  const totalPages = Math.ceil(services_data?.total / pageSize);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <Breadcrumbs
        paths={[
          { label: "Главная страница", to: "/" },
          { label: "Услуги", to: "/services" },
        ]}
      />
      {!isError && (
        <>
          <div>
            <input
              type="text"
              placeholder="Поиск по названию услуги"
              value={tempSearch}
              onChange={handleTempSearchChange}
            />
            <button onClick={() => handleSearch(tempSearch)}>Поиск</button>
          </div>
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSortChange("service_name")}>
                  Название услуги
                </th>
                <th>
                  <button onClick={handleCreateClick}>
                    Создать новую услугу
                  </button>
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
            <CreateServiceModal
              newServiceName={newServiceName}
              setNewServiceName={setNewServiceName}
              onCreate={handleCreateService}
              onCancel={handleCancelCreate}
            />
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
        </>
      )}
      {isError && <button onClick={() => navigate(-1)}>Вернуться назад</button>}
    </div>
  );
};

export default ServicesPage;
