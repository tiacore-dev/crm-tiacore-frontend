import React, { useEffect, useState, useCallback } from "react";
import { useServiceMutations } from "../../hooks/services/useServiceMutations";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  servicesSelector,
  setPage,
  setPageSize,
  setSearch,
  setSort,
} from "../../redux/slices/servicesSlice";
import toast from "react-hot-toast";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { Pagination } from "../../components/Pagination/Pagination";
import { CreateServiceModal } from "./components/CreateServiceModal";
import { ServiceTable } from "./components/ServiceTable";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { useServiceQuery } from "../../hooks/services/useServiceQuery";

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentPage, pageSize, search, sortBy, order } = useSelector(servicesSelector);

  const [tempSearch, setTempSearch] = useState(search);
  const [isCreating, setIsCreating] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Услуги", to: "/services" },
      ])
    );
  }, [dispatch]);

  
  const { createMutation } = useServiceMutations();

  const {
    data: services_data,
    isLoading,
    isError,
  } = useServiceQuery();

  const handleCreateClick = useCallback(() => {
    setIsCreating(true);
  }, []);

  const handleCancelCreate = useCallback( () => {
    setIsCreating(false);
    setNewServiceName("");
  }, []);

  const handleCreateService = useCallback(() => {
    if (newServiceName.trim().length >= 3) {
      createMutation.mutate(
        { service_name: newServiceName },
        {
          onSuccess: () => {
            setIsCreating(false);
            setNewServiceName("");
          },
          onError: () => {
          },
        }
      );
    } else {
      toast.error("Название услуги должно содержать минимум 3 символа");
    }
  }, [newServiceName, createMutation]);

  const handleRowClick = useCallback ((service_id: string) => {
    navigate(`/services/${service_id}`);
  }, [navigate]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      dispatch(setPage(newPage));
    },
    [dispatch]
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      dispatch(setPageSize(newPageSize));
    },
    [dispatch]
  );

  const handleTempSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTempSearch(e.target.value); // Обновляем временное состояние поиска
    },
    [setTempSearch]
  );

  const handleSearch = useCallback(
    (searchTerm: string) => {
      dispatch(setSearch(searchTerm));
    },
    [dispatch]
  );

  const handleSortChange = useCallback(
    (newSortBy: string) => {
      dispatch(
        setSort({ sortBy: newSortBy, order: order === "asc" ? "desc" : "asc" })
      );
    },
    [dispatch, order]
  );

  const totalPages = services_data?.total ? Math.ceil(services_data?.total / pageSize) : 0;

  return (
    <div>
      {isLoading ? (
        <div>Загрузка...</div>
      ) : (
        <>
          {!isError && (
            <div>
              <SearchBar
                tempSearch={tempSearch}
                onTempSearchChange={handleTempSearchChange}
                onSearch={() => handleSearch(tempSearch)}
              />
              <div className="main-container">
                <button onClick={handleCreateClick}>Создать новую услугу</button>
                <ServiceTable
                  services={services_data?.services}
                  onRowClick={handleRowClick}
                  onSortChange={handleSortChange}
                />
  
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={services_data?.total || 0}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>
              {isCreating && (
                <CreateServiceModal
                  newServiceName={newServiceName}
                  setNewServiceName={setNewServiceName}
                  onCreate={handleCreateService}
                  onCancel={handleCancelCreate}
                  isCreatingLoading={createMutation.isPending}
                />
              )}
            </div>
          )}
          {isError && <button onClick={() => navigate(-1)}>Вернуться назад</button>}
        </>
      )}
    </div>
  );
};
