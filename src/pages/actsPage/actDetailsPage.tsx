import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Descriptions, Space, Spin } from "antd";
import { useActQuery } from "../../hooks/acts/useActsQuery";
import { useActsMutations } from "../../hooks/acts/useActsMutation";
import { BackButton } from "../../components/modals/backButton";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { useDispatch } from "react-redux";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import dayjs from "dayjs";
import { ActFormModal } from "./components/actsFormModal";
import { useLegalEntitiesForSelection } from "../../hooks/legalEntities/useLegalEntityQuery";
import { useContractsForSelection } from "../../hooks/contracts/useContractQuery";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ActDetailsDescriptions } from "./components/actDetailsCard";

export const ActDetailsPage: React.FC = () => {
  const { act_id } = useParams<{ act_id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const { data: act, isLoading, isError } = useActQuery(act_id || "");

  const { data: legalEntitiesResponse } = useLegalEntitiesForSelection();
  const { data: contractsResponse } = useContractsForSelection();

  const { deleteMutation } = useActsMutations(
    act_id || "",
    act?.act_number || "",
    act?.act_date || 0,
    act?.contract || "",
    act?.buyer || "",
    act?.seller || ""
  );

  useEffect(() => {
    if (act) {
      dispatch(
        setBreadcrumbs([
          { label: "Главная страница", to: "/home" },
          { label: "Акты", to: "/acts" },
          {
            label: act.act_number,
            to: `/acts/${act_id}`,
          },
        ])
      );
    }
  }, [act, dispatch, act_id]);

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        navigate("/acts");
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
          {!isError && act && (
            <>
              <div className="main-container">
                <Space style={{ marginBottom: 16 }}>
                  <Button onClick={() => setShowEditModal(true)}>
                    <EditOutlined />
                    Редактировать
                  </Button>
                  <Button danger onClick={() => setShowDeleteConfirm(true)}>
                    <DeleteOutlined /> Удалить
                  </Button>
                </Space>
                <ActDetailsDescriptions
                  act={act}
                  getEntityNameById={getEntityNameById}
                  getContractNameById={getContractNameById}
                />
              </div>

              {showEditModal && (
                <ActFormModal
                  visible={showEditModal}
                  onCancel={() => setShowEditModal(false)}
                  legalEntitiesData={legalEntitiesResponse?.entities || []}
                  contractsData={contractsResponse?.contracts || []}
                  onSuccess={() => {
                    setShowEditModal(false);
                  }}
                  mode="edit"
                  initialData={act}
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
