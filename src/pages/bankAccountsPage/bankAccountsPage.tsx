import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { BackButton } from "../../components/modals/backButton";
import { Button, Spin, Space } from "antd";
import { useBankAccountQuery } from "../../hooks/bankAccounts/useBankAccountQuery";
import { BankAccountsTable } from "./components/bankAccountsTable";
import { BankAccountCreateModal } from "./components/bankAccountFormModal";
import { useLegalEntitiesForSelection } from "../../hooks/legalEntities/useLegalEntityQuery";
import { PlusOutlined, ClearOutlined } from "@ant-design/icons";
import {
  bankAccountsSelector,
  resetState,
} from "../../redux/slices/bankAccountsSlice";
import { useSelector } from "react-redux";

export const BankAccountsPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { legal_entity, bank_name, page, page_size } =
    useSelector(bankAccountsSelector);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Банковские счета", to: "/bank_accounts" },
      ])
    );
  }, [dispatch]);

  const {
    data: bank_accounts_data,
    isLoading,
    isError,
  } = useBankAccountQuery();

  const { data: legalEntitiesResponse } = useLegalEntitiesForSelection();

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
                  Добавить банковский счёт
                </Button>
                <Button
                  onClick={handleResetFilters}
                  icon={<ClearOutlined />}
                  disabled={!legal_entity && !bank_name}
                >
                  Сбросить фильтры
                </Button>
              </Space>

              <BankAccountsTable
                data={bank_accounts_data || { total: 0, bank_accounts: [] }}
                loading={isLoading}
                legalEntitiesData={legalEntitiesResponse?.entities || []}
              />

              <BankAccountCreateModal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                legalEntitiesData={legalEntitiesResponse?.entities || []}
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
