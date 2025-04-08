import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Descriptions, Space, Spin } from "antd";
import { useBillsQuery } from "../../hooks/bills/useBillQuery";
import { useBillQuery } from "../../hooks/bills/useBillQuery";
import { useBillMutations } from "../../hooks/bills/useBillMutation";
import { BackButton } from "../../components/backButton";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { useDispatch } from "react-redux";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import dayjs from "dayjs";
import { BillCreateModal } from "./components/billsCreateModal";
import { useLegalEntitiesForSelection } from "../../hooks/legalEntities/useLegalEntityQuery";
import { useBankAccountsForSelection } from "../../hooks/bankAccounts/useBankAccountQuery";
import { useContractsForSelection } from "../../hooks/contracts/useContractQuery";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ExportOutlined } from "@ant-design/icons";

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

  const getEntityNameById = (id: string | undefined) => {
    return (
      legalEntitiesResponse?.entities.find(
        (entity) => entity.legal_entity_id === id
      )?.legal_entity_name || id
    );
  };
  const getBankNameById = (id: string | undefined) => {
    return (
      bankAccountsResponse?.bank_accounts.find(
        (bank) => bank.bank_account_id === id
      )?.bank_name || id
    );
  };
  const getContractNameById = (id: string | undefined) => {
    return (
      contractsResponse?.contracts.find(
        (contract) => contract.contract_id === id
      )?.contract_name || id
    );
  };

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
                {/* <Card> */}
                {/* <Descriptions bordered column={1}> */}
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Номер">
                    {bill.bill_number}
                  </Descriptions.Item>
                  <Descriptions.Item label="Дата">
                    {dayjs(bill.bill_date).format("DD.MM.YYYY")}
                  </Descriptions.Item>
                  <Descriptions.Item label="Банковский счёт">
                    {bill.bank_account && (
                      <Link to={`/bank_accounts/${bill.bank_account}`}>
                        <ExportOutlined />
                      </Link>
                    )}
                    {"  "}
                    {getBankNameById(bill.bank_account)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Контракт">
                    {bill.contract && (
                      <Link to={`/contracts/${bill.contract}`}>
                        <ExportOutlined />
                      </Link>
                    )}
                    {"  "}
                    {getContractNameById(bill.contract)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Заказчик">
                    {/* {bill.buyer && (
                      <Link to={`/legal_entities/${bill.buyer}`}>
                        <ExportOutlined />
                      </Link>
                    )}
                    {"  "} */}
                    {getEntityNameById(bill.buyer)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Исполнитель">
                    {/* {bill.seller && (
                      <Link to={`/legal_entities/${bill.seller}`}>
                        <ExportOutlined />
                      </Link>
                    )}
                    {"  "} */}
                    {getEntityNameById(bill.seller)}
                  </Descriptions.Item>
                </Descriptions>
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
