import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { useServiceQuery } from "../../hooks/services/useServiceQuery";
import { Button, Space, Spin } from "antd";
import { BackButton } from "../../components/buttons/backButton";
import { PlusOutlined } from "@ant-design/icons";
import { ServicesTable } from "./components/servicesTable";
import { ServiceCreateModal } from "./components/serviceFormModal";
import { usePermissions } from "../../context/permissionsContext";

export const ServicesPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { hasPermission } = usePermissions(); // Добавьте этот хук

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
                  {hasPermission("add_service") && (
                    <Button
                      onClick={() => setIsModalVisible(true)}
                      icon={<PlusOutlined />}
                    >
                      Добавить новую услугу
                    </Button>
                  )}
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
