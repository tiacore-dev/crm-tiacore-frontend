import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { Button, Space, Spin } from "antd";
import { BackButton } from "../../components/modals/backButton";
import { PlusOutlined, ClearOutlined } from "@ant-design/icons";
import { BankAccountsTable } from "./components/bankAccountsTable";
import { useBankAccountQuery } from "../../hooks/bankAccounts/useBankAccountQuery";
import { useLegalEntitiesForSelection } from "../../hooks/legalEntities/useLegalEntityQuery";
import {
  bankAccountsSelector,
  resetState,
} from "../../redux/slices/bankAccountsSlice";

export const BankAccountsPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { account_number, legal_entity, bank_name } =
    useSelector(bankAccountsSelector);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Банковские счета", to: "/bank_accounts" },
      ])
    );
  }, [dispatch]);

  const { data: bankAccountsData, isLoading, isError } = useBankAccountQuery();
  const { data: legalEntitiesResponse } = useLegalEntitiesForSelection();

  const handleResetFilters = () => {
    dispatch(resetState());
  };

  const hasActiveFilters =
    account_number !== "" || legal_entity !== "" || bank_name !== "";

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
                  Добавить банковский счет
                </Button>
                {hasActiveFilters && (
                  <Button onClick={handleResetFilters} icon={<ClearOutlined />}>
                    Сбросить фильтры
                  </Button>
                )}
              </Space>
              <BankAccountsTable
                data={bankAccountsData || { total: 0, bank_accounts: [] }}
                loading={isLoading}
                legalEntitiesData={legalEntitiesResponse?.entities || []}
              />
            </div>
          )}
          {isError && <BackButton />}
        </>
      )}
    </div>
  );
};
