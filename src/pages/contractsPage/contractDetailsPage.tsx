import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Space, Spin } from "antd";
import { useContractDetailsQuery } from "../../hooks/contracts/useContractQuery";
import { useContractMutations } from "../../hooks/contracts/useContractMutation";
import { BackButton } from "../../components/backButton";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { useDispatch } from "react-redux";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import { downloadContract } from "../../api/contractsApi";
import { useLegalEntitiesForSelection } from "../../hooks/legalEntities/useLegalEntityQuery";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useContractStatuses } from "../../hooks/base/useBaseQuery";
import { ContractDetailsCard } from "./components/contractDetailsCard";
import { ContractFormModal } from "./components/contractFormModal";
import { getEntityNameById, getContractStatusById } from "../../utils/infoById";

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
  const { data: contractStatusesResponse } = useContractStatuses();

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

  const getEntityName = (id: string | undefined) => {
    return getEntityNameById(id, legalEntitiesResponse?.entities) || id;
  };

  const getStatusName = (id: string) => {
    return (
      getContractStatusById(id, contractStatusesResponse?.contract_statuses) ||
      id
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
                    <EditOutlined />
                    Редактировать
                  </Button>
                  <Button danger onClick={() => setShowDeleteConfirm(true)}>
                    <DeleteOutlined /> Удалить
                  </Button>
                </Space>

                <ContractDetailsCard
                  contract={contract}
                  getEntityNameById={getEntityName}
                  getContractStatusById={getStatusName}
                  handleDownload={handleDownload}
                />
              </div>

              {showEditModal && (
                <ContractFormModal
                  mode="edit"
                  visible={showEditModal}
                  onCancel={() => setShowEditModal(false)}
                  onSuccess={() => {
                    setShowEditModal(false);
                  }}
                  contractData={contract}
                  legalEntitiesData={legalEntitiesResponse?.entities || []}
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
