// src/pages/legalEntitiesBuyersPage/LegalEntitiesBuyersPage.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumbs } from "../../../redux/slices/breadcrumbsSlice";
// import { BackButton } from "../../components/buttons/backButton";
import { Button, Space, Spin } from "antd";
import { useLegalEntitiesBuyers } from "../../../hooks/legalEntities/useLegalEntity_Query";
import { PlusOutlined, ClearOutlined } from "@ant-design/icons";
import { resetState } from "../../../redux/slices/legalEntityBuyersSlice";
import { RootState } from "../../../redux/store";
import { LegalEntitiesBuyersTable } from "./buyersTable";
import { CreateLegalEntityModal } from "./createLegalEntityModal";
import { useCompany } from "../../../context/companyContext";
// import { CreateBuyerModal } from "./components/createBuyerModal";

export const LegalEntitiesBuyersPage: React.FC = () => {
  const dispatch = useDispatch();
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const { currentAppPermissions } = useCompany();

  const { short_name, inn, kpp } = useSelector(
    (state: RootState) => state.legalEntitiesBuyers
  );
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Контрагенты", to: "/buyers" },
      ])
    );
  }, [dispatch]);

  const {
    data: buyersData,
    isLoading,
    isError,
    refetch,
  } = useLegalEntitiesBuyers();

  const handleResetFilters = () => {
    dispatch(resetState());
  };

  const handleSuccess = () => {
    refetch();
  };

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
                  {/* {isSuperadmin && (
                    <Button
                      icon={<PlusOutlined />}
                      // onClick={() => setModalVisible(true)}
                    >
                      Добавить контрагента вручную
                    </Button>
                  )} */}

                  {(isSuperadmin ||
                    (currentAppPermissions.includes("add_legal_entity") &&
                      currentAppPermissions.includes(
                        "add_legal_entity_company_relation"
                      ))) && (
                    <Button
                      icon={<PlusOutlined />}
                      onClick={() => setModalVisible(true)}
                    >
                      Добавить контрагента
                    </Button>
                  )}
                  <Button
                    onClick={handleResetFilters}
                    icon={<ClearOutlined />}
                    disabled={!short_name && !inn && !kpp}
                  >
                    Сбросить фильтры
                  </Button>
                </Space>
                <LegalEntitiesBuyersTable
                  data={buyersData || { total: 0, entities: [] }}
                  loading={isLoading}
                />
              </div>
            </div>
          )}
          {/* {isError && <BackButton />} */}
        </>
      )}

      <CreateLegalEntityModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSuccess={handleSuccess}
        relationType="buyer"
        title="Добавить покупателя"
        buttonText="Добавить покупателя"
      />
    </div>
  );
};
