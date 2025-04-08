import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { BackButton } from "../../components/backButton";
import { Button, Spin } from "antd";
import { useBillsQuery } from "../../hooks/bills/useBillQuery";
import { useLegalEntitiesForSelection } from "../../hooks/legalEntities/useLegalEntityQuery";
import { useBankAccountsForSelection } from "../../hooks/bankAccounts/useBankAccountQuery";
import { useContractsForSelection } from "../../hooks/contracts/useContractQuery";
import { BillsTable } from "./components/billsTable";
import { BillCreateModal } from "./components/billsCreateModal";
import { PlusOutlined } from "@ant-design/icons";

export const BillsPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Счета", to: "/bills" },
      ])
    );
  }, [dispatch]);

  const { data: bills_data, isLoading, isError } = useBillsQuery();

  const { data: legalEntitiesResponse } = useLegalEntitiesForSelection();
  const { data: bankAccountsResponse } = useBankAccountsForSelection();
  const { data: contractsResponse } = useContractsForSelection();

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
                  <PlusOutlined /> Добавить счет
                </Button>

                <BillsTable
                  data={bills_data || { total: 0, bills: [] }}
                  loading={isLoading}
                  legalEntitiesData={legalEntitiesResponse?.entities || []}
                  bankAccountsData={bankAccountsResponse?.bank_accounts || []}
                  contractsData={contractsResponse?.contracts || []}
                />

                <BillCreateModal
                  visible={isModalVisible}
                  onCancel={() => setIsModalVisible(false)}
                  legalEntitiesData={legalEntitiesResponse?.entities || []}
                  bankAccountsData={bankAccountsResponse?.bank_accounts || []}
                  contractsData={contractsResponse?.contracts || []}
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

// };
