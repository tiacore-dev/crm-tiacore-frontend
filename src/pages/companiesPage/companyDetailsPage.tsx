import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useCompanyDetailsQuery } from "../../hooks/companies/useCompanyQuery";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { Button, Space, Spin, Typography } from "antd";
import { BackButton } from "../../components/buttons/backButton";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import { useCompanyMutations } from "../../hooks/companies/useCompanyMutation";
import { CompanyCard } from "./components/companyDetailsCard";
import { CompanyFormModal } from "./components/companyFormModal";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
// import { UserCompanyRelationsTable } from "../../components/userCompanyRelations/userCompanyRelationsTable";
// import { LegalEntitiesTable } from "../legalEntitiesPage/components/legalEntitiesTable";
// import { useLegalEntitiesSellers } from "../../hooks/legalEntities/useLegalEntityQuery";
// import { LegalEntityFormModal } from "../legalEntitiesPage/components/legalEntityFormModal";
// import { usePermissions } from "../../context/permissionsContext";
import { useCompany } from "../../context/companyContext";
import { LegalEntitiesSellersTable } from "../legalEntitiesPage/sellers/sellersTable";
import { useLegalEntitiesSellers } from "../../hooks/legalEntities/useLegalEntityQuery";
import { CreateLegalEntityModal } from "../legalEntitiesPage/buyersPage/createLegalEntityModal";

export const CompanyDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { company_id } = useParams<{ company_id: string }>();
  const [showEditModal, setShowEditModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { currentAppPermissions } = useCompany();
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const {
    data: sellersData,
    isLoading: isLoadingSellers,
    isError: isErrorSellers,
    refetch: refetchSellers,
  } = useLegalEntitiesSellers(company_id);

  const {
    data: companyDetails,
    isLoading,
    isError,
    refetch,
  } = useCompanyDetailsQuery(company_id!);

  // const { data: legalEntitiesData } = useLegalEntitiesSellers(company_id);

  const { deleteMutation } = useCompanyMutations(
    company_id || "",
    companyDetails?.company_name || "",
    companyDetails?.description || ""
  );

  useEffect(() => {
    if (companyDetails) {
      dispatch(
        setBreadcrumbs([
          { label: "Главная страница", to: "/home" },
          { label: "Компании", to: "/companies" },
          {
            label: companyDetails.company_name,
            to: `/companies/${company_id}`,
          },
        ])
      );
    }
  }, [dispatch, companyDetails, company_id]);

  const handleDelete = useCallback(() => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        navigate("/companies");
      },
    });
  }, [deleteMutation, navigate]);

  const handleEditSuccess = useCallback(() => {
    setShowEditModal(false);
    refetch();
  }, [refetch]);
  const handleSuccess = () => {
    refetch();
  };
  return (
    <div>
      {isLoading ? (
        <Spin size="large" className="center-spin" />
      ) : (
        <>
          {!isError && companyDetails && (
            <>
              <div className="main-container">
                <Space style={{ marginBottom: 16 }}>
                  {(isSuperadmin ||
                    currentAppPermissions.includes("edit_company")) && (
                    <Button
                      onClick={() => {
                        setShowEditModal(true);
                      }}
                      icon={<EditOutlined />}
                    >
                      Редактировать
                    </Button>
                  )}

                  {(isSuperadmin ||
                    currentAppPermissions.includes("delete_company")) && (
                    <Button
                      danger
                      onClick={() => setShowDeleteConfirm(true)}
                      icon={<DeleteOutlined />}
                    >
                      Удалить
                    </Button>
                  )}
                </Space>
                <CompanyCard data={companyDetails} loading={isLoading} />
                {/* <UserCompanyRelationsTable companyId={company_id} /> */}
                <div>
                  <LegalEntitiesSellersTable
                    data={sellersData || { total: 0, entities: [] }}
                    loading={isLoadingSellers}
                    companyId={company_id}
                    companyName={companyDetails.company_name}
                  />
                  {/* <LegalEntitiesTable
                    data={legalEntitiesData || { total: 0, entities: [] }}
                    loading={isLoading}
                    isSellers={true}
                    customNavigate={(id) =>
                      navigate(`/legal_entities/${id}`, {
                        state: {
                          from: "company",
                          companyId: company_id,
                          companyName: companyDetails.company_name,
                        },
                      })
                    }
                  /> */}
                </div>
              </div>
              {showEditModal && (
                <CompanyFormModal
                  visible={showEditModal}
                  onCancel={() => setShowEditModal(false)}
                  onSuccess={handleEditSuccess}
                  mode="edit"
                  initialData={companyDetails}
                />
              )}
              {showDeleteConfirm && (
                <ConfirmDeleteModal
                  onConfirm={handleDelete}
                  onCancel={() => setShowDeleteConfirm(false)}
                  isDeleteLoading={deleteMutation.isPending}
                />
              )}
              {/* <CreateLegalEntityModal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                // mode="create"
                defaultRelationType="seller"
              /> */}
              <CreateLegalEntityModal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onSuccess={handleSuccess}
                relationType="seller"
                title="Добавить организацию"
                buttonText="Добавить организацию"
              />
            </>
          )}
          {isError && <BackButton />}
        </>
      )}
    </div>
  );
};
