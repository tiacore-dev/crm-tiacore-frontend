import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { BackButton } from "../../components/backButton";
import { Button, Spin } from "antd";
import {
  useLegalEntitiesForSelection,
  useLegalEntityQuery,
} from "../../hooks/legalEntities/useLegalEntityQuery";
import { LegalEntitiesTable } from "./components/legalEntitiesTable";
import { LegalEntityFormModal } from "./components/legalEntityFormModal";
import { PlusOutlined } from "@ant-design/icons";
import { useEntityTypes } from "../../hooks/base/useBaseQuery";
import { legalEntitiesSelector } from "../../redux/slices/legalEntitiesSlice";
import { useCompaniesForSelection } from "../../hooks/companies/useCompanyQuery";
import { Space } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import { resetState } from "../../redux/slices/legalEntitiesSlice";

export const LegalEntitiesPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { search, company, entity_type } = useSelector(legalEntitiesSelector);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Юридические лица", to: "/legal_entities" },
      ])
    );
  }, [dispatch]);

  const { data: companiesResponse } = useCompaniesForSelection();

  const {
    data: legal_entities_data,
    isLoading,
    isError,
  } = useLegalEntitiesForSelection();

  const { data: legalEntityTypes } = useEntityTypes();

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
                  <Button
                    onClick={() => setIsModalVisible(true)}
                    icon={<PlusOutlined />}
                  >
                    Добавить юр. лицо
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
                  legalEntityTypes={legalEntityTypes?.legal_entity_types || []}
                  companiesData={companiesResponse?.companies || []}
                />
              </div>
              <LegalEntityFormModal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                legalEntityTypes={legalEntityTypes?.legal_entity_types || []}
                companiesDate={companiesResponse?.companies || []}
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
