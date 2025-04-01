import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { Button, Spin } from "antd";
import { BackButton } from "../../components/backButton";
import { useTemplateQuery } from "../../hooks/templates/useTemplateQuery";
import { TemplatesTable } from "./components/templatesTable";
import { fetchCompanies } from "../../api/companiesApi";
import { useQuery } from "@tanstack/react-query";
import { TemplateCreateModal } from "./components/templateCreateModal";

export const TemplatesPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Шаблоны", to: "/templates" },
      ])
    );
  }, [dispatch]);

  const { data: templates_data, isLoading, isError } = useTemplateQuery();
  const { data: companiesResponse } = useQuery({
    queryKey: ["companiesForSelection"],
    queryFn: () => fetchCompanies({ page: 1, page_size: 100 }),
  });

  return (
    <div>
      {isLoading ? (
        <Spin size="large" className="center-spin" />
      ) : (
        <>
          {!isError && (
            <div>
              <div className="main-container">
                <Button
                  onClick={() => setIsModalVisible(true)}
                  style={{ marginBottom: 16 }}
                >
                  Добавить шаблон
                </Button>

                <TemplatesTable
                  data={templates_data || { total: 0, templates: [] }}
                  loading={isLoading}
                  companiesData={companiesResponse?.companies || []}
                />

                <TemplateCreateModal
                  visible={isModalVisible}
                  onCancel={() => setIsModalVisible(false)}
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
