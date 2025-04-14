import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Space, Spin } from "antd";
import { useBillQuery } from "../../hooks/bills/useBillQuery";
import { useBillMutations } from "../../hooks/bills/useBillMutation";
import { BackButton } from "../../components/backButton";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { useDispatch } from "react-redux";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import { BillCreateModal } from "./components/billsFormModal";
import { useLegalEntitiesForSelection } from "../../hooks/legalEntities/useLegalEntityQuery";
import { useBankAccountsForSelection } from "../../hooks/bankAccounts/useBankAccountQuery";
import { useContractsForSelection } from "../../hooks/contracts/useContractQuery";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { BillDetailsCard } from "./components/billDetailsCard";
import {
  createMemoizedHelpers,
  getBankAccountNumberById,
} from "../../utils/infoById";
import { useCompaniesForSelection } from "../../hooks/companies/useCompanyQuery";
export const BillDetailsPage: React.FC = () => {
  const { bill_id } = useParams<{ bill_id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { data: bill, isLoading, isError } = useBillQuery(bill_id || "");
  const { data: legalEntitiesResponse } = useLegalEntitiesForSelection();
  const { data: bankAccountsResponse } = useBankAccountsForSelection();
  const { data: contractsResponse } = useContractsForSelection();
  const { data: companiesResponse } = useCompaniesForSelection();

  const { deleteMutation } = useBillMutations(
    bill_id || "",
    bill?.bill_number || "",
    bill?.bill_date || 0,
    bill?.bank_account || "",
    bill?.contract || "",
    bill?.buyer || "",
    bill?.seller || ""
  );

  useEffect(() => {
    if (bill) {
      dispatch(
        setBreadcrumbs([
          { label: "Главная страница", to: "/home" },
          { label: "Счета", to: "/bills" },
          {
            label: bill.bill_number,
            to: `/bills/${bill_id}`,
          },
        ])
      );
    }
  }, [bill, dispatch, bill_id]);

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        navigate("/bills");
      },
    });
  };

  const {
    getEntityNameById,
    getContractNameById,
    getBankAccountNumberById,
    getBankNameById,
  } = createMemoizedHelpers(
    legalEntitiesResponse?.entities,
    contractsResponse?.contracts,
    bankAccountsResponse?.bank_accounts,
    companiesResponse?.companies
  );

  return (
    <div>
      {isLoading ? (
        <Spin size="large" className="center-spin" />
      ) : (
        <>
          {!isError && bill && (
            <>
              <div className="main-container">
                <Space style={{ marginBottom: 16 }}>
                  <Button
                    onClick={() => {
                      setShowEditModal(true);
                    }}
                  >
                    {" "}
                    <EditOutlined />
                    Редактировать
                  </Button>
                  <Button danger onClick={() => setShowDeleteConfirm(true)}>
                    <DeleteOutlined /> Удалить
                  </Button>
                </Space>

                <BillDetailsCard
                  bill={bill}
                  getEntityNameById={getEntityNameById}
                  getContractNameById={getContractNameById}
                  getBankNameById={getBankNameById}
                  getBankNumberById={getBankAccountNumberById}
                />
              </div>

              {showEditModal && (
                <BillCreateModal
                  visible={showEditModal}
                  onCancel={() => setShowEditModal(false)}
                  legalEntitiesData={legalEntitiesResponse?.entities || []}
                  bankAccountsData={bankAccountsResponse?.bank_accounts || []}
                  contractsData={contractsResponse?.contracts || []}
                  onSuccess={() => {
                    setShowEditModal(false);
                  }}
                  mode="edit"
                  initialData={bill}
                />
              )}
              {showDeleteConfirm && (
                <ConfirmDeleteModal
                  onConfirm={handleDelete}
                  onCancel={() => setShowDeleteConfirm(false)}
                  isDeleteLoading={deleteMutation.isPending}
                />
              )}
            </>
          )}
          {isError && <BackButton />}
        </>
      )}
    </div>
  );
};
