import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import {
// servicesSelector,
// setPage,
// setPageSize,
// setSearch,
// resetState,
// } from "../../redux/slices/servicesSlice";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { useServiceQuery } from "../../hooks/services/useServiceQuery";
import { Button, Space, Spin } from "antd";
import { BackButton } from "../../components/backButton";
import { PlusOutlined } from "@ant-design/icons";
import { ServicesTable } from "./components/servicesTable";
import { ServiceCreateModal } from "./components/serviceFormModal";

export const ServicesPage: React.FC = () => {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const { page, page_size, search } = useSelector(servicesSelector);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Услуги", to: "/services" },
      ])
    );
  }, [dispatch]);

  const { data: services_data, isLoading, isError } = useServiceQuery();

  return (
    <div>
      {isLoading ? (
        <Spin size="large" className="center-spin" />
      ) : (
        <>
          {!isError && (
            <div>
              <div className="main-container">
                <Space style={{ marginBottom: 16 }}>
                  <Button
                    onClick={() => setIsModalVisible(true)}
                    icon={<PlusOutlined />}
                  >
                    Добавить новую услугу
                  </Button>
                </Space>
                <ServicesTable
                  data={services_data || { total: 0, services: [] }}
                  loading={isLoading}
                />
              </div>
              <ServiceCreateModal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                mode="create"
              />
            </div>
          )}
          {isError && <BackButton />}
        </>
      )}
    </div>
  );
};
