import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useCompanyDetailsQuery } from "../../hooks/companies/useCompanyQuery";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { Button, Spin } from "antd";
import { BackButton } from "../../components/backButton";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";

export interface CompanyData {
  company_name: string;
  full_name: string;
  position: string;
}

export const UserDetailsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { company_id } = useParams<{ company_id: string }>();

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
          { label: "Компании", to: "/companys" },
          { label: companyDetails.company_name, to: `/companys/${company_id}` },
        ])
      );
    }
  }, [dispatch, companyDetails, company_id]);

  return (
    <div>
      {isLoading ? (
        <Spin size="large" className="center-spin" />
      ) : (
        <>
          {!isError && (
            <>
              <div className="main-container"></div>
            </>
          )}
          {isError && <BackButton />}
        </>
      )}
    </div>
  );
};
