import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Descriptions, Space, Spin } from "antd";
import { useBankcAccountDetailsQuery } from "../../hooks/bankAccounts/useBankAccountQuery";
import { useBankAccountMutations } from "../../hooks/bankAccounts/useBankAccountMutation";
import { BackButton } from "../../components/backButton";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { useDispatch } from "react-redux";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import { BankAccountCreateModal } from "./components/bankAccountCreateModal";
import { useLegalEntitiesForSelection } from "../../hooks/legalEntities/useLegalEntityQuery";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
export const BankAccountDetailsPage: React.FC = () => {
  const { bank_account_id } = useParams<{ bank_account_id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    data: bank_account,
    isLoading,
    isError,
  } = useBankcAccountDetailsQuery(bank_account_id || "");

  const { data: legalEntitiesResponse } = useLegalEntitiesForSelection();

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
          { label: "Банковские аккаунты", to: "/bank_accounts" },
          {
            label: bank_account.account_number,
            to: `/bank_accounts/${bank_account_id}`,
          },
        ])
      );
    }
  }, [bank_account, dispatch, bank_account_id]);

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        navigate("/bank_accounts");
      },
    });
  };

  const getEntityNameById = (id: string | undefined) => {
    return (
      legalEntitiesResponse?.entities.find(
        (entity) => entity.legal_entity_id === id
      )?.legal_entity_name || id
    );
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
                {/* <Card> */}
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
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Номер">
                    {bank_account.account_number}
                  </Descriptions.Item>
                  <Descriptions.Item label="Юр. лицо">
                    {getEntityNameById(bank_account.legal_entity)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Банк">
                    {bank_account.bank_name}
                  </Descriptions.Item>
                  <Descriptions.Item label="БИК">
                    {bank_account.bank_bic}
                  </Descriptions.Item>
                  <Descriptions.Item label="Корреспондентский счет">
                    {bank_account.bank_corr_account}
                  </Descriptions.Item>
                </Descriptions>
              </div>

              {showEditModal && (
                <BankAccountCreateModal
                  visible={showEditModal}
                  onCancel={() => setShowEditModal(false)}
                  legalEntitiesData={legalEntitiesResponse?.entities || []}
                  onSuccess={() => {
                    setShowEditModal(false);
                  }}
                  mode="edit"
                  initialData={bank_account}
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
