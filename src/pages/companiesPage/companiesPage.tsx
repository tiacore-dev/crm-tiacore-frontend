import React, { useEffect, useState, useCallback } from "react";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { BackButton } from "../../components/backButton";
import { useCompanyQuery } from "../../hooks/companies/useCompanyQuery";
import { Spin, Button, Space } from "antd";
import { CompanyFormModal } from "./components/companyFormModal";
import { CompaniesTable } from "./components/companiesTable";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined, ClearOutlined } from "@ant-design/icons";

import {
  companiesSelector,
  resetState,
} from "../../redux/slices/companiesSlice";

export const CompaniesPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { search, page, page_size } = useSelector(companiesSelector);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Компании", to: "/companies" },
      ])
    );
  }, [dispatch]);

  const { data: companies_data, isLoading, isError } = useCompanyQuery();

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
                    Добавить компанию
                  </Button>
                  <Button
                    onClick={handleResetFilters}
                    icon={<ClearOutlined />}
                    disabled={!search}
                  >
                    Сбросить фильтры
                  </Button>
                </Space>
                <CompaniesTable
                  data={companies_data || { total: 0, companies: [] }}
                  loading={isLoading}
                />
                <CompanyFormModal
                  visible={isModalVisible}
                  onCancel={() => setIsModalVisible(false)}
                  mode="create"
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
