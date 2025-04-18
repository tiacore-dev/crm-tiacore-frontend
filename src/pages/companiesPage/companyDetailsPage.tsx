import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useCompanyDetailsQuery } from "../../hooks/companies/useCompanyQuery";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { Button, Space, Spin } from "antd";
import { BackButton } from "../../components/backButton";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import { useCompanyMutations } from "../../hooks/companies/useCompanyMutation";
import { CompanyCard } from "./components/companyDetailsCard"; // Изменен импорт
import { CompanyFormModal } from "./components/companyFormModal";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { UserCompanyRelationsTable } from "../../components/relations/relationsTable";

export const CompanyDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { company_id } = useParams<{ company_id: string }>();
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    data: companyDetails,
    isLoading,
    isError,
    refetch,
  } = useCompanyDetailsQuery(company_id!);

  const { deleteMutation, updateMutation } = useCompanyMutations(
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
    refetch(); // Обновляем данные после успешного редактирования
  }, [refetch]);
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
                  <Button
                    onClick={() => {
                      setShowEditModal(true);
                    }}
                    icon={<EditOutlined />}
                  >
                    Редактировать
                  </Button>
                  <Button
                    danger
                    onClick={() => setShowDeleteConfirm(true)}
                    icon={<DeleteOutlined />}
                  >
                    Удалить
                  </Button>
                </Space>{" "}
                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: "0 0 300px" }}>
                    <CompanyCard data={companyDetails} loading={isLoading} />{" "}
                  </div>
                  <div style={{ flex: 1 }}>
                    {/* <UserCompanyRelationsTable companyId={company_id} /> */}
                  </div>
                </div>
              </div>{" "}
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
            </>
          )}
          {isError && <BackButton />}
        </>
      )}
    </div>
  );
};
