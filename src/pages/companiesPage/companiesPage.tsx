import React, { useEffect, useState, useCallback } from "react";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { BackButton } from "../../components/backButton";
import { useCompanyQuery } from "../../hooks/companies/useCompanyQuery";
import { Spin, Button } from "antd";
import { CompanyCreateModal } from "./components/companyCreateModal";
import { useCompanyMutations } from "../../hooks/companies/useCompanyMutation";
import { CompaniesTable } from "./components/companiesTable";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Pagination } from "../../components/pagination/pagination";
import { SearchBar } from "../../components/searchBar/searchBar";

import {
  companiesSelector,
  setPage,
  setPageSize,
  setSearch,
  setSort,
} from "../../redux/slices/companiesSlice";

export const CompaniesPage: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const { createMutation } = useCompanyMutations();

  const { currentPage, pageSize, search, sortBy, order } =
    useSelector(companiesSelector);
  const [tempSearch, setTempSearch] = useState(search);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Компании", to: "/companies" },
      ])
    );
  }, [dispatch]);

  const { data: companies_data, isLoading, isError } = useCompanyQuery();

  const handleCreateClick = useCallback(() => {
    setIsCreating(true);
  }, []);

  const handleCreateCompany = useCallback(() => {
    createMutation.mutate(
      {
        company_name: newCompanyName,
        description: newDescription,
      },
      {
        onSuccess: (data) => {
          setIsCreating(false);
          setNewCompanyName("");
          setNewDescription("");
        },
      }
    );
  }, [newCompanyName, newDescription]);

  const handleCancelCreate = useCallback(() => {
    setIsCreating(false);
    setNewCompanyName("");
  }, []);

  const handleRowClick = useCallback(
    (service_id: string) => {
      navigate(`/services/${service_id}`);
    },
    [navigate]
  );

  const handleSortChange = useCallback(
    (newSortBy: string) => {
      dispatch(
        setSort({ sortBy: newSortBy, order: order === "asc" ? "desc" : "asc" })
      );
    },
    [dispatch, order]
  );
  //++++++++++++++++++++++++++++++++++++++++++++++

  const totalPages = companies_data?.total
    ? Math.ceil(companies_data?.total / pageSize)
    : 0;

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
  //++++++++++++++++++++++++++++++++++++++++++++++
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
  const handleResetSearch = useCallback(() => {
    setTempSearch("");
    dispatch(setSearch(""));
  }, [dispatch]);
  return (
    <div>
      {isLoading ? (
        <Spin size="large" className="center-spin" />
      ) : (
        <>
          {!isError && (
            <div>
              {" "}
              <SearchBar
                tempSearch={tempSearch}
                onTempSearchChange={handleTempSearchChange}
                onSearch={() => handleSearch(tempSearch)}
                onResetSearch={handleResetSearch} // Передаем функцию сброса
              />
              <div className="main-container">
                <Button
                  type="primary"
                  onClick={handleCreateClick}
                  style={{ marginBottom: 16 }}
                >
                  Добавить компанию
                </Button>
                <CompaniesTable
                  companies={companies_data?.companies}
                  onRowClick={handleRowClick}
                  onSortChange={handleSortChange}
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={companies_data?.total || 0}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>
              {isCreating && (
                <CompanyCreateModal
                  newCompanyName={newCompanyName}
                  newDescription={newDescription}
                  setNewCompanyName={setNewCompanyName}
                  setNewDescription={setNewDescription}
                  onCreate={handleCreateCompany}
                  onCancel={handleCancelCreate}
                  isCreatingLoading={createMutation.isPending}
                />
              )}
            </div>
          )}
          {isError && <BackButton />}
        </>
      )}
    </div>
  );
};
