//contractsPage.tsx
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { Button, Spin, Space } from "antd";
import { BackButton } from "../../components/buttons/backButton";
import { useContractQuery } from "../../hooks/contracts/useContractQuery";
import { ContractsTable } from "./components/contractsTable";
import { useLegalEntitiesForSelection } from "../../hooks/legalEntities/useLegalEntityQuery";
import { PlusOutlined, ClearOutlined } from "@ant-design/icons";
import { useContractStatuses } from "../../hooks/base/useBaseQuery";
import { ContractFormModal } from "./components/contractFormModal";
import {
  setPage,
  setOrder,
  setPageSize,
  setSortBy,
  setBuyer,
  setContractDateFrom,
  setContractDateTo,
  setSeller,
  setStatus,
  resetState,
  // contractsSelector,
} from "../../redux/slices/contractsSlice";
import { RootState } from "../../redux/store";
import { usePermissions } from "../../context/permissionsContext";

export const ContractsPage: React.FC = () => {
  const {
    seller,
    status,
    page,
    page_size,
    buyer,
    contract_date_from,
    contract_date_to,
    order,
    sort_by,
  } = useSelector((state: RootState) => state.contracts);

  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { hasPermission } = usePermissions(); // Добавьте этот хук

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Договоры", to: "/contracts" },
      ])
    );
  }, [dispatch]);

  const {
    data: contracts_data,
    isLoading,
    isError,
  } = useContractQuery({
    page,
    page_size,
    sort_by,
    order,
    buyer,
    seller,
    status,
    contract_date_from,
    contract_date_to,
  });

  const { data: legalEntitiesResponse } = useLegalEntitiesForSelection();
  const { data: contractStatusesResponse } = useContractStatuses();

  const handleTableChange = useCallback(
    (pagination: any, _filters: any, sorter: any) => {
      if (pagination.current !== page) {
        dispatch(setPage(pagination.current));
      }
      if (pagination.pageSize !== page_size) {
        dispatch(setPageSize(pagination.pageSize));
      }

      if (sorter && sorter.field && sorter.order) {
        const newSortBy = sorter.field;
        const newOrder = sorter.order === "ascend" ? "asc" : "desc";
        dispatch(setSortBy(newSortBy));
        dispatch(setOrder(newOrder));
      }
    },
    [dispatch, page, page_size]
  );

  const handleSortChange = useCallback(
    (sortBy: string, newOrder: string) => {
      dispatch(setSortBy(sortBy));
      dispatch(setOrder(newOrder));
    },
    [dispatch]
  );

  const handleFilterChange = (field: string, value: any) => {
    switch (field) {
      case "buyer":
        dispatch(setBuyer(value));
        break;
      case "seller":
        dispatch(setSeller(value));
        break;
      case "status":
        dispatch(setStatus(value));
        break;
      case "contract_date_from":
        dispatch(setContractDateFrom(value));
        break;
      case "contract_date_to":
        dispatch(setContractDateTo(value));
        break;
      default:
        break;
    }
  };

  const handleResetFilters = () => {
    dispatch(resetState());
  };

  const hasActiveFilters =
    buyer !== undefined ||
    seller !== undefined ||
    status !== undefined ||
    contract_date_from !== undefined ||
    contract_date_to !== undefined ||
    sort_by !== undefined;

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
                  {hasPermission("add_contract") && (
                    <Button
                      onClick={() => setIsModalVisible(true)}
                      icon={<PlusOutlined />}
                    >
                      Добавить договор
                    </Button>
                  )}
                  <Button
                    onClick={handleResetFilters}
                    icon={<ClearOutlined />}
                    disabled={!hasActiveFilters}
                  >
                    Сбросить фильтры
                  </Button>
                </Space>

                <ContractsTable
                  data={contracts_data || { total: 0, contracts: [] }}
                  loading={isLoading}
                  legalEntitiesData={legalEntitiesResponse?.entities || []}
                  contractStatusesData={
                    contractStatusesResponse?.contract_statuses || []
                  }
                  currentPage={page}
                  pageSize={page_size}
                  sortBy={sort_by}
                  order={order}
                  filters={{
                    buyer,
                    seller,
                    status,
                    contract_date_from,
                    contract_date_to,
                  }}
                  onTableChange={handleTableChange}
                  onSortChange={handleSortChange}
                  onFilterChange={handleFilterChange}
                />

                <ContractFormModal
                  mode="create"
                  visible={isModalVisible}
                  onCancel={() => setIsModalVisible(false)}
                  onSuccess={() => {
                    setIsModalVisible(false);
                  }}
                  // legalEntitiesData={legalEntitiesResponse?.entities || []}
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
