import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { BackButton } from "../../components/backButton";
import { Button, Spin, Space } from "antd";
import { useActsQuery } from "../../hooks/acts/useActsQuery";
import { useLegalEntitiesForSelection } from "../../hooks/legalEntities/useLegalEntityQuery";
import { useContractsForSelection } from "../../hooks/contracts/useContractQuery";
import { PlusOutlined, ClearOutlined } from "@ant-design/icons";
import { ActsTable } from "./components/actsTable";
import { ActFormModal } from "./components/actsFormModal";
import {
  setPage,
  setPageSize,
  setSortBy,
  setOrder,
  setContract,
  setBuyer,
  setSeller,
  setDateFrom,
  setDateTo,
  resetState,
  // actsSelector,
} from "../../redux/slices/actsSlice";
import { RootState } from "../../redux/store";

export const ActsPage: React.FC = () => {
  const dispatch = useDispatch();
  const {
    page,
    page_size,
    sort_by,
    order,
    contract,
    buyer,
    seller,
    act_date_from,
    act_date_to,
  } = useSelector((state: RootState) => state.acts);

  const [isModalVisible, setIsModalVisible] = useState(false);
  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Акты", to: "/acts" },
      ])
    );
  }, [dispatch]);

  const {
    data: acts_data,
    isLoading,
    isError,
  } = useActsQuery({
    page,
    page_size,
    sort_by,
    order,
    contract,
    buyer,
    seller,
    act_date_from,
    act_date_to,
  });
  const { data: legalEntitiesResponse } = useLegalEntitiesForSelection();
  const { data: contractsResponse } = useContractsForSelection();
  const handleTableChange = useCallback(
    (pagination: any) => {
      if (pagination.current !== page) {
        dispatch(setPage(pagination.current));
      }
      if (pagination.pageSize !== page_size) {
        dispatch(setPageSize(pagination.pageSize));
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

  const handleFilterChange = useCallback(
    (field: string, value: any) => {
      switch (field) {
        case "contract":
          dispatch(setContract(value || undefined));
          break;
        case "buyer":
          dispatch(setBuyer(value || undefined));
          break;
        case "seller":
          dispatch(setSeller(value || undefined));
          break;
        case "act_date_from":
          dispatch(setDateFrom(value || undefined));
          break;
        case "act_date_to":
          dispatch(setDateTo(value || undefined));
          break;
        default:
          break;
      }
    },
    [dispatch]
  );

  const handleResetFilters = useCallback(() => {
    dispatch(resetState());
  }, [dispatch]);

  const hasActiveFilters = useMemo(
    () =>
      contract !== undefined ||
      buyer !== undefined ||
      seller !== undefined ||
      act_date_from !== undefined ||
      act_date_to !== undefined ||
      sort_by !== undefined,
    [contract, buyer, seller, act_date_from, act_date_to, sort_by]
  );

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
                    Добавить акт
                  </Button>
                  <Button
                    onClick={handleResetFilters}
                    icon={<ClearOutlined />}
                    disabled={!hasActiveFilters}
                  >
                    Сбросить фильтры
                  </Button>
                </Space>

                <ActsTable
                  data={acts_data || { total: 0, acts: [] }}
                  loading={isLoading}
                  legalEntitiesData={legalEntitiesResponse?.entities || []}
                  contractsData={contractsResponse?.contracts || []}
                  currentPage={page}
                  pageSize={page_size}
                  sortBy={sort_by}
                  order={order}
                  filters={{
                    contract,
                    buyer,
                    seller,
                    act_date_from,
                    act_date_to,
                  }}
                  onTableChange={handleTableChange}
                  onSortChange={handleSortChange}
                  onFilterChange={handleFilterChange}
                />

                <ActFormModal
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
