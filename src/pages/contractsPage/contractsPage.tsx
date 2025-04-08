import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { Button, Spin } from "antd";
import { BackButton } from "../../components/backButton";
import { useContractQuery } from "../../hooks/contracts/useContractQuery";
import { ContractsTable } from "./components/contractsTable";
import { ContractCreateModal } from "./components/createContractModal";
import { useLegalEntitiesForSelection } from "../../hooks/legalEntities/useLegalEntityQuery";
import { PlusOutlined } from "@ant-design/icons";

export const ContractsPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Договоры", to: "/contracts" },
      ])
    );
  }, [dispatch]);

  const { data: contracts_data, isLoading, isError } = useContractQuery();
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
                  <PlusOutlined /> Добавить договор
                </Button>

                <ContractsTable
                  data={contracts_data || { total: 0, contracts: [] }}
                  loading={isLoading}
                  legalEntitiesData={legalEntitiesResponse?.entities || []}
                />

                <ContractCreateModal
                  visible={isModalVisible}
                  onCancel={() => setIsModalVisible(false)}
                  legalEntitiesData={legalEntitiesResponse?.entities || []}
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
