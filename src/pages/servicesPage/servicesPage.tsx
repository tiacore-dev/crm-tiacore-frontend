import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  servicesSelector,
  setPage,
  setPageSize,
  setSearch,
  resetState,
} from "../../redux/slices/servicesSlice";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { useServiceQuery } from "../../hooks/services/useServiceQuery";
import { Button, Space, Spin } from "antd";
import { BackButton } from "../../components/modals/backButton";
import { PlusOutlined, ClearOutlined } from "@ant-design/icons";
import { ServicesTable } from "./components/servicesTable";

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { page, page_size, search } = useSelector(servicesSelector);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Услуги", to: "/services" },
      ])
    );
  }, [dispatch]);

  const { data: services_data, isLoading, isError } = useServiceQuery();
  const handleResetFilters = () => {
    dispatch(resetState());
  };

  return (
    <div>
      {isLoading ? (
        <Spin size="large" className="center-spin" />
      ) : (
        <>
          {!isError && (
            <div className="main-container">
              <Space style={{ marginBottom: 16 }}>
                <Button
                  onClick={() => setIsModalVisible(true)}
                  icon={<PlusOutlined />}
                >
                  Добавить новую услугу
                </Button>
                <Button
                  onClick={handleResetFilters}
                  icon={<ClearOutlined />}
                  disabled={!search}
                >
                  Сбросить фильтры
                </Button>
              </Space>
              <ServicesTable
                data={services_data || { total: 0, services: [] }}
                loading={isLoading}
              />
            </div>
          )}
          {isError && <BackButton />}
        </>
      )}
    </div>
  );
};
