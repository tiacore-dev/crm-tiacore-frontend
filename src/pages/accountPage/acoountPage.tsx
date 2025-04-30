import React, { useEffect, useState } from "react";
import { refreshToken } from "../loginPage/auth";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { useDispatch } from "react-redux";
import { Button, Typography } from "antd";
import { useUserDetailsQuery } from "../../hooks/users/useUserQuery";
import { UserDetailsCard } from "../usersPage/components/userDetails";
import { EditOutlined } from "@ant-design/icons";
import { UserFormModal } from "../usersPage/components/userFormModal";
import { UserCompanyRelationsTable } from "../../components/userCompanyRelations/userCompanyRelationsTable";

export const AccountPage: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Аккаунт", to: "/account" },
      ])
    );
  }, [dispatch]);

  const [showEditModal, setShowEditModal] = useState(false);
  const selectedCompanyId =
    localStorage.getItem("selectedCompanyId") || undefined;
  const userId = localStorage.getItem("user_id");

  // Обрабатываем случай, когда userId равен null
  const {
    data: userDetails,
    isLoading,
    isError,
  } = useUserDetailsQuery(userId || "");

  if (!userId) {
    return <div>Пользователь не авторизован</div>;
  }

  return (
    <div className="main-container">
      <div
        style={{
          display: "flex",
          gap: "24px",
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: 1, marginTop: "16px", marginBottom: "16px" }}>
          <UserDetailsCard userDetails={userDetails} />
        </div>
        <div style={{ flex: 1 }}>
          <UserCompanyRelationsTable
            userId={userId}
            companyId={selectedCompanyId}
            fromAccount={true}
          />
        </div>
      </div>
      <Button
        onClick={() => {
          setShowEditModal(true);
        }}
      >
        <EditOutlined />
        Редактировать
      </Button>
      {showEditModal && (
        <UserFormModal
          visible={showEditModal}
          onCancel={() => setShowEditModal(false)}
          mode="edit"
          initialData={userDetails}
        />
      )}
    </div>
  );
};
