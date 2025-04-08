import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Descriptions, Space, Spin, Tag } from "antd";
import { useContractDetailsQuery } from "../../hooks/contracts/useContractQuery";
import { useContractMutations } from "../../hooks/contracts/useContractMutation";
import { BackButton } from "../../components/backButton";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { useDispatch } from "react-redux";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import { downloadContract } from "../../api/contractsApi";
import { FileOutlined } from "@ant-design/icons";
import { ContractEditModal } from "./components/contractEditModal";
import { useLegalEntitiesForSelection } from "../../hooks/legalEntities/useLegalEntityQuery";
import dayjs from "dayjs";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface LegalEntity {
  legal_entity_id: string;
  legal_entity_name: string;
}

export const ContractDetailsPage: React.FC = () => {
  const { contract_id } = useParams<{ contract_id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const {
    data: contract,
    isLoading,
    isError,
  } = useContractDetailsQuery(contract_id || "");

  const { data: legalEntitiesResponse } = useLegalEntitiesForSelection();

  const { deleteMutation } = useContractMutations(
    contract_id || "",
    contract?.contract_name || "",
    contract?.contract_date || 0,
    contract?.buyer || "",
    contract?.seller || "",
    contract?.s3_key || "",
    contract?.file || "",
    contract?.status || ""
  );

  useEffect(() => {
    if (contract) {
      dispatch(
        setBreadcrumbs([
          { label: "Главная страница", to: "/home" },
          { label: "Договоры", to: "/contracts" },
          { label: contract.contract_name, to: `/contracts/${contract_id}` },
        ])
      );
    }
  }, [contract, dispatch, contract_id]);

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        navigate("/contracts");
      },
    });
  };

  const handleDownload = async () => {
    if (!contract_id) return;
    setDownloading(true);
    try {
      const result = await downloadContract(contract_id);
      if (result) {
        const link = document.createElement("a");
        link.href = result;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } finally {
      setDownloading(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "Активен";
      case "waiting":
        return "В процессе";
      default:
        return status;
    }
  };

  const getEntityNameById = (id: string | undefined) => {
    return (
      legalEntitiesResponse?.entities.find(
        (entity: LegalEntity) => entity.legal_entity_id === id
      )?.legal_entity_name || id
    );
  };

  return (
    <div>
      {isLoading ? (
        <Spin size="large" className="center-spin" />
      ) : (
        <>
          {!isError && contract && (
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
                {/* <Card title={`Название: ${contract.contract_name}`}> */}
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Название">
                    {contract.contract_name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Дата">
                    {dayjs(contract.contract_date).format("DD.MM.YYYY") || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Исполнитель">
                    {getEntityNameById(contract.seller)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Заказчик">
                    {getEntityNameById(contract.buyer)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Файл">
                    {contract.s3_key ? (
                      <Button
                        type="link"
                        onClick={handleDownload}
                        loading={downloading}
                        icon={<FileOutlined />}
                      >
                        {contract.s3_key.split("/").pop()}
                      </Button>
                    ) : (
                      "Файл отсутствует"
                    )}
                  </Descriptions.Item>

                  <Descriptions.Item label="Статус">
                    <Tag
                      color={
                        contract.status.toLowerCase() === "active"
                          ? "green"
                          : "orange"
                      }
                    >
                      {getStatusDisplay(contract.status)}{" "}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Коментарий">
                    {contract.comment}
                  </Descriptions.Item>
                </Descriptions>

                {/* </Card> */}
              </div>

              {/* Модальное окно редактирования */}
              {showEditModal && (
                <ContractEditModal
                  open={showEditModal}
                  onCancel={() => {
                    setShowEditModal(false);
                  }}
                  onSuccess={() => {
                    setShowEditModal(false);
                  }}
                  contractData={contract}
                  entitiesData={legalEntitiesResponse?.entities || []}
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
