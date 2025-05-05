//templatespage
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { Button, Spin, Space } from "antd"; // Добавлен Space для группировки кнопок
import { BackButton } from "../../components/backButton";
import { useTemplateQuery } from "../../hooks/templates/useTemplateQuery";
import { TemplatesTable } from "./components/templatesTable";
import { PlusOutlined, ClearOutlined } from "@ant-design/icons"; // Добавлен ClearOutlined
import { useCompaniesForSelection } from "../../hooks/companies/useCompanyQuery";
import { TemplateFormModal } from "./components/templateFormModal";
// import { templatesSelector } from "../../redux/slices/templatesSlice";
import { useSelector } from "react-redux";
import { resetState } from "../../redux/slices/templatesSlice"; // Импорт нового действия
import { RootState } from "../../redux/store";
export const TemplatesPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { search, company } = useSelector(
    (state: RootState) => state.templates
  );

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Шаблоны", to: "/templates" },
      ])
    );
  }, [dispatch]);

  const { data: templates_data, isLoading, isError } = useTemplateQuery();
  const { data: companiesResponse } = useCompaniesForSelection();

  const handleResetFilters = () => {
    dispatch(resetState());
  };

  // Проверяем, есть ли активные фильтры
  const hasActiveFilters = search || company;

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
                    Добавить шаблон
                  </Button>
                  <Button
                    onClick={handleResetFilters}
                    icon={<ClearOutlined />}
                    disabled={!hasActiveFilters}
                  >
                    Сбросить фильтры
                  </Button>
                </Space>

                <TemplatesTable
                  data={templates_data?.templates || []}
                  loading={isLoading}
                  companiesData={companiesResponse?.companies || []}
                />

                <TemplateFormModal
                  mode="create"
                  visible={isModalVisible}
                  onCancel={() => setIsModalVisible(false)}
                  onSuccess={() => {
                    setIsModalVisible(false);
                  }}
                  companiesData={companiesResponse?.companies || []}
                />
              </div>
            </div>
          )}
          {isError && <BackButton />}
        </>
      )}
    </div>
  );
};
