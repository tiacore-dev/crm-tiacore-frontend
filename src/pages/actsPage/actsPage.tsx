import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { BackButton } from "../../components/backButton";
import { Button, Spin } from "antd";
import { useActsQuery } from "../../hooks/acts/useActsQuery";
import { useLegalEntitiesForSelection } from "../../hooks/legalEntities/useLegalEntityQuery";
import { useContractsForSelection } from "../../hooks/contracts/useContractQuery";
import { PlusOutlined } from "@ant-design/icons";
import { ActsTable } from "./components/actsTable";
import { ActCreateModal } from "./components/actsCreateModal";

export const ActsPage: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Акты", to: "/acts" },
      ])
    );
  }, [dispatch]);
  // return <div>acts</div>;
  // };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data: acts_data, isLoading, isError } = useActsQuery();

  const { data: legalEntitiesResponse } = useLegalEntitiesForSelection();
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
                  <PlusOutlined /> Добавить акт
                </Button>

                <ActsTable
                  data={acts_data || { total: 0, acts: [] }}
                  loading={isLoading}
                  legalEntitiesData={legalEntitiesResponse?.entities || []}
                  contractsData={contractsResponse?.contracts || []}
                />

                <ActCreateModal
                  visible={isModalVisible}
                  onCancel={() => setIsModalVisible(false)}
                  legalEntitiesData={legalEntitiesResponse?.entities || []}
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
