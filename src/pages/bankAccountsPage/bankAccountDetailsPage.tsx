import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Space, Spin } from "antd";
import { useBankcAccountDetailsQuery } from "../../hooks/bankAccounts/useBankAccountQuery";
import { useBankAccountMutations } from "../../hooks/bankAccounts/useBankAccountMutation";
import { BackButton } from "../../components/backButton";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { useDispatch } from "react-redux";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import { BankAccountCreateModal } from "./components/bankAccountFormModal";
import {
  useLegalEntitiesForSelection,
  useLegalEntityDetailsQuery,
} from "../../hooks/legalEntities/useLegalEntityQuery";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { BankAccountDetailsDescriptions } from "./components/bankAccountDetailsCard";
import { getEntityNameById } from "../../utils/infoById";

export const BankAccountDetailsPage: React.FC = () => {
  const { bank_account_id } = useParams<{ bank_account_id: string }>();
  const { legal_entity_id } = useParams<{ legal_entity_id: string }>();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    data: bank_account,
    isLoading,
    isError,
  } = useBankcAccountDetailsQuery(bank_account_id!);
  const {
    data: legalEntityData,
    isLoading: isLoadingEntity,
    isError: isErrorEntity,
    refetch,
  } = useLegalEntityDetailsQuery(legal_entity_id || "");
  // const { data: legalEntitiesResponse } = useLegalEntitiesForSelection();

  const { deleteMutation } = useBankAccountMutations(
    bank_account_id || "",
    bank_account?.legal_entity || "",
    bank_account?.bank_name || "",
    bank_account?.account_number || "",
    bank_account?.bank_bic || "",
    bank_account?.bank_corr_account || ""
  );

  useEffect(() => {
    if (bank_account) {
      dispatch(
        setBreadcrumbs([
          { label: "Главная страница", to: "/home" },
          { label: "Контрагенты", to: "/legal_entities" },
          {
            label: legalEntityData.legal_entity_name,
            to: `/legal_entities/${legal_entity_id}`,
          },
          {
            label: bank_account.account_number,
            to: `/legal_entities/${legal_entity_id}/${bank_account_id}`,
          },
        ])
      );
    }
  }, [bank_account, dispatch, bank_account_id, legalEntityData]);

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        navigate("/bank_accounts");
      },
    });
  };

  return (
    <div>
      {isLoading ? (
        <Spin size="large" className="center-spin" />
      ) : (
        <>
          {!isError && bank_account && (
            <>
              <div className="main-container">
                <Space style={{ marginBottom: 16 }}>
                  <Button
                    onClick={() => {
                      setShowEditModal(true);
                    }}
                  >
                    <EditOutlined />
                    Редактировать
                  </Button>
                  <Button danger onClick={() => setShowDeleteConfirm(true)}>
                    <DeleteOutlined /> Удалить
                  </Button>
                </Space>
                <BankAccountDetailsDescriptions
                  bank_account={bank_account}
                  legalEntitiesData={legalEntityData}
                />
              </div>
              <BankAccountCreateModal
                visible={showEditModal}
                onCancel={() => setShowEditModal(false)}
                legalEntitiesData={{
                  legal_entity_id: legal_entity_id || "",
                  legal_entity_name: legalEntityData.legal_entity_name,
                }}
                onSuccess={() => {
                  setShowEditModal(false);
                }}
                mode="edit"
                initialData={bank_account}
              />
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
