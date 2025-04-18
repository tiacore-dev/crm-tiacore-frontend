import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { BackButton } from "../../components/backButton";
import { Button, Spin, Space } from "antd"; // Добавляем Space для группировки кнопок
import { useBillsQuery } from "../../hooks/bills/useBillQuery";
import { useLegalEntitiesForSelection } from "../../hooks/legalEntities/useLegalEntityQuery";
import { useBankAccountsForSelection } from "../../hooks/bankAccounts/useBankAccountQuery";
import { useContractsForSelection } from "../../hooks/contracts/useContractQuery";
import { BillsTable } from "./components/billsTable";
import { BillCreateModal } from "./components/billsFormModal";
import { PlusOutlined, ClearOutlined } from "@ant-design/icons"; // Добавляем иконку очистки
import {
  billsSelector,
  setPage,
  setPageSize,
  setSortBy,
  setOrder,
  setBankAccount,
  setContract,
  setDateFrom,
  setDateTo,
  resetState,
} from "../../redux/slices/billsSlice";
import { RootState } from "../../redux/store";

export const BillsPage: React.FC = () => {
  const dispatch = useDispatch();
  const {
    page,
    page_size,
    sort_by,
    order,
    bank_account,
    contract,
    bill_date_from,
    bill_date_to,
  } = useSelector((state: RootState) => state.bills);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Счета", to: "/bills" },
      ])
    );
  }, [dispatch]);

  const {
    data: bills_data,
    isLoading,
    isError,
  } = useBillsQuery({
    page,
    page_size,
    sort_by,
    order,
    bank_account,
    contract,
    bill_date_from,
    bill_date_to,
  });
  const { data: legalEntitiesResponse } = useLegalEntitiesForSelection();
  const { data: bankAccountsResponse } = useBankAccountsForSelection();
  const { data: contractsResponse } = useContractsForSelection();

  const handleTableChange = (pagination: any) => {
    if (pagination.current !== page) {
      dispatch(setPage(pagination.current));
    }
    if (pagination.pageSize !== page_size) {
      dispatch(setPageSize(pagination.pageSize));
    }
  };

  const handleSortChange = (sortBy: string, newOrder: string) => {
    dispatch(setSortBy(sortBy));
    dispatch(setOrder(newOrder));
  };

  const handleFilterChange = (field: string, value: any) => {
    switch (field) {
      case "bank_account":
        dispatch(setBankAccount(value || undefined)); // undefined если значение сброшено
        break;
      case "contract":
        dispatch(setContract(value || undefined));
        break;
      case "bill_date_from":
        dispatch(setDateFrom(value || undefined));
        break;
      case "bill_date_to":
        dispatch(setDateTo(value || undefined));
        break;
      default:
        break;
    }
  };

  const handleResetFilters = () => {
    dispatch(resetState()); // Сбрасываем все фильтры и сортировку
  };

  // Проверяем, есть ли активные фильтры
  const hasActiveFilters =
    bank_account !== undefined ||
    contract !== undefined ||
    bill_date_from !== undefined ||
    bill_date_to !== undefined ||
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
                  <Button
                    onClick={() => setIsModalVisible(true)}
                    icon={<PlusOutlined />}
                  >
                    Добавить счет
                  </Button>
                  <Button
                    onClick={handleResetFilters}
                    icon={<ClearOutlined />}
                    disabled={!hasActiveFilters}
                  >
                    Сбросить фильтры
                  </Button>
                </Space>

                <BillsTable
                  data={bills_data || { total: 0, bills: [] }}
                  loading={isLoading}
                  legalEntitiesData={legalEntitiesResponse?.entities || []}
                  bankAccountsData={bankAccountsResponse?.bank_accounts || []}
                  contractsData={contractsResponse?.contracts || []}
                  currentPage={page}
                  pageSize={page_size}
                  sortBy={sort_by}
                  order={order}
                  filters={{
                    bank_account,
                    contract,
                    bill_date_from,
                    bill_date_to,
                  }}
                  onTableChange={handleTableChange}
                  onSortChange={handleSortChange}
                  onFilterChange={handleFilterChange}
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
