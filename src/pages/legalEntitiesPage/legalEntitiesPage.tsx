import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { BackButton } from "../../components/buttons/backButton";
import { Button, Spin } from "antd";
import {
  useLegalEntitiesBuyers,
  useLegalEntitiesForSelection,
} from "../../hooks/legalEntities/useLegalEntityQuery";
import { LegalEntitiesTable } from "./components/legalEntitiesTable";
import { LegalEntityFormModal } from "./components/legalEntityFormModal";
import { PlusOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import { resetState } from "../../redux/slices/legalEntitiesSlice";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { useCompany } from "../../context/companyContext";
import { AddByInnKppModal } from "./components/aAddByInnKppModal";

export const LegalEntitiesPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddByInnKppModalVisible, setIsAddByInnKppModalVisible] =
    useState(false);
  const [isAddOrganizationModalVisible, setIsAddOrganizationModalVisible] =
    useState(false);
  const { search, company, entity_type } = useSelector(
    (state: RootState) => state.legalEntities
  );
  const { currentAppPermissions } = useCompany();
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";

  const buyersData = useLegalEntitiesBuyers();
  const selectionData = useLegalEntitiesForSelection();

  const {
    data: legal_entities_data,
    isLoading,
    isError,
  } = isSuperadmin ? selectionData : buyersData;

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Контрагенты", to: "/legal_entities" },
      ])
    );
  }, [dispatch]);

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
            <div>
              <div className="main-container">
                <Space style={{ marginBottom: 16 }}>
                  {isSuperadmin && (
                    <>
                      <Button
                        onClick={() => setIsModalVisible(true)}
                        icon={<PlusOutlined />}
                      >
                        Добавить контрагента (в доработке)
                      </Button>
                      <Button
                        onClick={() => setIsAddOrganizationModalVisible(true)}
                        icon={<PlusOutlined />}
                      >
                        Добавить организацию (в доработке)
                      </Button>
                    </>
                  )}
                  <Button
                    onClick={() => setIsAddByInnKppModalVisible(true)}
                    icon={<PlusOutlined />}
                  >
                    Добавить контрагента по ИНН/КПП
                  </Button>
                  <Button
                    onClick={handleResetFilters}
                    icon={<ClearOutlined />}
                    disabled={!search && !company && !entity_type}
                  >
                    Сбросить фильтры
                  </Button>
                </Space>

                <LegalEntitiesTable
                  data={legal_entities_data || { total: 0, entities: [] }}
                  loading={isLoading}
                  isSellers={false}
                  customNavigate={(id) =>
                    navigate(`/legal_entities/${id}`, {
                      state: { from: "legal_entities" },
                    })
                  }
                />
              </div>
              <LegalEntityFormModal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                mode="create"
                defaultRelationType="buyer"
              />
              <AddByInnKppModal
                visible={isAddByInnKppModalVisible}
                onCancel={() => setIsAddByInnKppModalVisible(false)}
                relationType="buyer"
              />
              <AddByInnKppModal
                visible={isAddOrganizationModalVisible}
                onCancel={() => setIsAddOrganizationModalVisible(false)}
                relationType="seller"
              />
            </div>
          )}
          {isError && <BackButton />}
        </>
      )}
    </div>
  );
};
