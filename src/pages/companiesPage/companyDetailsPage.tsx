import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useCompanyDetailsQuery } from "../../hooks/companies/useCompanyQuery";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { Button, Spin } from "antd";
import { BackButton } from "../../components/backButton";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import { useCompanyMutations } from "../../hooks/companies/useCompanyMutation";
import { CompanyDetails } from "./components/companyDetails";
import { CompanyEditModal } from "./components/companyEditModal";

export interface CompanyData {
  company_name: string;
  description: string;
}

export const CompanyDetailsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { company_id } = useParams<{ company_id: string }>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { updateMutation, deleteMutation } = useCompanyMutations(company_id!);
  const [editedData, setEditedData] = useState<CompanyData | null>(null);

  const {
    data: companyDetails,
    isLoading,
    isError,
  } = useCompanyDetailsQuery(company_id!);

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
      onError: () => {},
    });
  }, [deleteMutation, navigate]);

  const handleEditChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setEditedData((prevData) => {
        if (prevData) {
          return {
            ...prevData,
            [name]: value,
          };
        }
        return null;
      });
    },
    []
  );

  const handleSaveEdit = useCallback(() => {
    if (editedData) {
      updateMutation.mutate(editedData, {
        onSuccess: () => {
          setIsEditing(false);
          setEditedData(null);
        },
        onError: () => {},
      });
    }
  }, [editedData, updateMutation]);

  const handleCancelEdit = useCallback(() => {
    if (companyDetails) {
      setEditedData({
        company_name: companyDetails.company_name,
        description: companyDetails.description,
      });
    }
    setIsEditing(false);
  }, [companyDetails]);

  const openEditModal = () => {
    if (companyDetails) {
      setEditedData({
        company_name: companyDetails.company_name,
        description: companyDetails.description,
      });
      setIsEditing(true);
    }
  };

  return (
    <div>
      {isLoading ? (
        <Spin size="large" className="center-spin" />
      ) : (
        <>
          {!isError && (
            <>
              <div className="main-container">
                <Button onClick={openEditModal}>Редактировать</Button>

                <Button
                  danger
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{ margin: 8 }}
                >
                  Удалить
                </Button>

                <CompanyDetails
                  companyName={companyDetails?.company_name || ""}
                  companyDescription={companyDetails?.description || ""}
                />
              </div>
              {isEditing && editedData && (
                <CompanyEditModal
                  editedData={editedData}
                  onChange={handleEditChange}
                  onSave={handleSaveEdit}
                  onCancel={handleCancelEdit}
                  isUpdateLoading={updateMutation.isPending}
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
