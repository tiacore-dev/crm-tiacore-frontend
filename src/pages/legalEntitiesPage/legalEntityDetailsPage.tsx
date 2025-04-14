import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useLegalEntityDetailsQuery } from "../../hooks/legalEntities/useLegalEntityQuery";
import { useLegalEntityMutations } from "../../hooks/legalEntities/useLegalEntityMutation";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { Button, Space, Spin } from "antd";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import { BackButton } from "../../components/backButton";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { LegalEntityFormModal } from "./components/legalEntityFormModal";
import { useEntityTypes } from "../../hooks/base/useBaseQuery";
import { useCompaniesForSelection } from "../../hooks/companies/useCompanyQuery";
import { LegalEntityDetailsCard } from "./components/legalEntityDetailsCard";

export const LegalEntityDetailsPage: React.FC = () => {
  const { legal_entity_id } = useParams<{ legal_entity_id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data: legalEntityTypes } = useEntityTypes();
  const { data: companiesResponse } = useCompaniesForSelection();

  const {
    data: legal_entity,
    isLoading,
    isError,
  } = useLegalEntityDetailsQuery(legal_entity_id || "");

  const { deleteMutation } = useLegalEntityMutations(
    legal_entity_id || "",
    legal_entity?.legal_entity_name || "",
    legal_entity?.inn || "",
    legal_entity?.kpp || "",
    legal_entity?.vat_rate || "",
    legal_entity?.address || "",
    legal_entity?.entity_type || "",
    legal_entity?.signer || "",
    legal_entity?.company || "",
    legal_entity?.description || ""
  );

  useEffect(() => {
    if (legal_entity) {
      dispatch(
        setBreadcrumbs([
          { label: "Главная страница", to: "/home" },
          { label: "Юридические лица", to: "/legal_entities" },
          {
            label: legal_entity.legal_entity_name,
            to: `/legal_entities/${legal_entity_id}`,
          },
        ])
      );
    }
  }, [legal_entity, dispatch, legal_entity_id]);

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        navigate("/legal_entities");
      },
    });
  };

  return (
    <div>
      {isLoading ? (
        <Spin size="large" className="center-spin" />
      ) : (
        <>
          {!isError && legal_entity && (
            <>
              <div className="main-container">
                <Space style={{ marginBottom: 16 }}>
                  <Button
                    onClick={() => {
                      setIsModalVisible(true);
                    }}
                  >
                    <EditOutlined />
                    Редактировать
                  </Button>
                  <Button danger onClick={() => setShowDeleteConfirm(true)}>
                    <DeleteOutlined /> Удалить
                  </Button>
                </Space>

                <LegalEntityDetailsCard
                  legal_entity={legal_entity}
                  companiesData={companiesResponse?.companies || []}
                  legalEntityTypes={legalEntityTypes?.legal_entity_types || []}
                />
              </div>

              {isModalVisible && (
                <LegalEntityFormModal
                  visible={isModalVisible}
                  onCancel={() => setIsModalVisible(false)}
                  legalEntityTypes={legalEntityTypes?.legal_entity_types || []}
                  companiesDate={companiesResponse?.companies || []}
                  onSuccess={() => {
                    setIsModalVisible(false);
                  }}
                  mode="edit"
                  initialData={legal_entity}
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
