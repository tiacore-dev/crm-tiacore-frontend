import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { BackButton } from "../../components/backButton";
import { Button, Spin } from "antd";
import { useBankAccountQuery } from "../../hooks/bankAccounts/useBankAccountQuery";
import { BankAccountsTable } from "./components/bankAccountsTable";
import { BankAccountCreateModal } from "./components/bankAccountCreateModal";
import { useLegalEntitiesForSelection } from "../../hooks/legalEntities/useLegalEntityQuery";
import { PlusOutlined } from "@ant-design/icons";
export const BankAccountsPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Банковские данные", to: "/bank_accounts" },
      ])
    );
  }, [dispatch]);

  const {
    data: bank_accounts_data,
    isLoading,
    isError,
  } = useBankAccountQuery();

  const { data: legalEntitiesResponse } = useLegalEntitiesForSelection();

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
                  <PlusOutlined /> Добавить банковский счёт
                </Button>

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
            </div>
          )}
          {isError && <BackButton />}
        </>
      )}
    </div>
  );
};
