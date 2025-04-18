import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Space, Spin } from "antd";
import { useActQuery } from "../../hooks/acts/useActsQuery";
import { useActsMutations } from "../../hooks/acts/useActsMutation";
import { BackButton } from "../../components/backButton";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { useDispatch } from "react-redux";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import { ActFormModal } from "./components/actsFormModal";
import { useLegalEntitiesForSelection } from "../../hooks/legalEntities/useLegalEntityQuery";
import { useContractsForSelection } from "../../hooks/contracts/useContractQuery";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ActDetailsDescriptions } from "./components/actDetailsCard";
import { useActDetailsQuery } from "../../hooks/actDetails/actDetailQuery";
import { useServiceQuery } from "../../hooks/services/useServiceQuery";
import { ActDetailsTable } from "./components/actDetailsTable";
import { createMemoizedHelpers } from "../../utils/infoById";
import { GenerateTemplateButton } from "../../components/generateTemplateButton";

export const ActDetailsPage: React.FC = () => {
  const { act_id } = useParams<{ act_id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const { data: act, isLoading, isError } = useActQuery(act_id || "");
  const { data: legalEntitiesResponse } = useLegalEntitiesForSelection();
  const { data: contractsResponse } = useContractsForSelection();
  const { data: servicesResponse } = useServiceQuery();

  const servicesData =
    servicesResponse?.services.map((service) => ({
      service_id: service.service_id,
      service_name: service.service_name,
    })) || [];

  const {
    data: actDetails,
    isLoading: isLoadingDetails,
    isError: isErrorDetails,
  } = useActDetailsQuery(act_id);

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

  const handleDelete = useCallback(() => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        navigate("/acts");
      },
    });
  }, [deleteMutation, navigate]);

  const { getEntityNameById, getContractNameById } = createMemoizedHelpers(
    legalEntitiesResponse?.entities,
    contractsResponse?.contracts,
    undefined,
    undefined
  );

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
                  <GenerateTemplateButton
                    actId={act_id || ""}
                    entityType={"act"}
                  />
                </Space>

                <ActDetailsDescriptions
                  act={act}
                  getEntityNameById={getEntityNameById}
                  getContractNameById={getContractNameById}
                />
              </div>
              <div className="main-container">
                <ActDetailsTable
                  data={actDetails || { total: 0, act_details: [] }}
                  loading={isLoadingDetails}
                  servicesData={servicesData}
                  actId={act_id || ""}
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
