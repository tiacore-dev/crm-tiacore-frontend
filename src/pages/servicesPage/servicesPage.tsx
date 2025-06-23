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
import { useCompany } from "../../context/companyContext";

export const ServicesPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { currentAppPermissions } = useCompany();

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
                  {currentAppPermissions.includes(
                    "add_user_company_relation"
                  ) && (
                    <Button
                      onClick={() => setIsModalVisible(true)}
                      icon={<PlusOutlined />}
                    >
                      Добавить новую услугу (в доработке)
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
