// src/pages/legalEntityDetailsPage/LegalEntityDetailsPage.tsx
import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../../redux/slices/breadcrumbsSlice";
import { Spin, Descriptions, Typography, Button, Space, Card } from "antd";
import { useLegalEntityDetailsQuery } from "../../../hooks/legalEntities/useLegalEntity_Query";
import { useDeleteLegalEntity } from "../../../hooks/legalEntities/useLegalEntityMutation";
import { ConfirmDeleteModal } from "../../../components/modals/confirmDeleteModal";
import { BankAccountsTable } from "../../bankAccountsPage/components/bankAccountsTable";
import { useBankAccountQuery } from "../../../hooks/bankAccounts/useBankAccountQuery";

const { Title } = Typography;

export const SellerDetailsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { legal_entity_id } = useParams<{ legal_entity_id: string }>();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const {
    data: legalEntity,
    isLoading: isLegalEntityLoading,
    isError: isLegalEntityError,
  } = useLegalEntityDetailsQuery(legal_entity_id || "", {
    enabled: !!legal_entity_id,
  });

  // Запрос для получения банковских счетов
  const {
    data: bankAccountsData,
    isLoading: isBankAccountsLoading,
    isError: isBankAccountsError,
  } = useBankAccountQuery({
    legal_entity: legal_entity_id || "",
    // enabled: !!legal_entity_id,
  });

  const deleteMutation = useDeleteLegalEntity();
  const location = useLocation();
  const { state: locationState } = location;

  React.useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Компании", to: "/companies" },
        {
          label: locationState.companyName || "Компания",
          to: `/companies/${locationState.companyId}`,
        },
        {
          label: legalEntity?.short_name || "Детали",
          to: `/legal-entities/${legal_entity_id}`,
        },
      ])
    );
  }, [dispatch, legalEntity, legal_entity_id, locationState]);

  const handleDelete = () => {
    if (!legal_entity_id) return;

    deleteMutation.mutate(legal_entity_id, {
      onSuccess: () => {
        navigate(-1);
      },
    });
  };

  if (isLegalEntityLoading) {
    return <Spin size="large" className="center-spin" />;
  }

  if (isLegalEntityError || !legalEntity) {
    return (
      <div>
        <div>Не удалось загрузить данные организации</div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <Space direction="vertical" style={{ width: "100%" }}>
        <Card>
          <Space style={{ marginBottom: 16 }}>
            <Button danger onClick={() => setDeleteModalVisible(true)}>
              Удалить
            </Button>
          </Space>

          <Descriptions bordered column={1}>
            <Descriptions.Item label="Полное название">
              {legalEntity.full_name || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Короткое название">
              {legalEntity.short_name}
            </Descriptions.Item>
            <Descriptions.Item label="ИНН">{legalEntity.inn}</Descriptions.Item>
            <Descriptions.Item label="КПП">
              {legalEntity.kpp || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="ОГРН">
              {legalEntity.ogrn}
            </Descriptions.Item>
            <Descriptions.Item label="ОПФ">
              {legalEntity.opf || "-"}
            </Descriptions.Item>
            {/* <Descriptions.Item label="Ставка НДС">
              {legalEntity.vat_rate !== 0
                ? `${legalEntity.vat_rate}%`
                : "НДС не облагается"}
            </Descriptions.Item> */}
            <Descriptions.Item label="Адрес">
              {legalEntity.address}
            </Descriptions.Item>
            <Descriptions.Item label="Подписант">
              {legalEntity.signer || "-"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Добавьте таблицу банковских счетов */}
        <Card title="Банковские счета">
          <BankAccountsTable
            data={{
              total: bankAccountsData?.total || 0,
              bank_accounts: bankAccountsData?.bank_accounts || [],
            }}
            loading={isBankAccountsLoading}
            legalEntitiesData={{
              legal_entity_id: legal_entity_id || "",
              short_name: legalEntity.short_name,
            }}
          />
        </Card>
      </Space>

      {deleteModalVisible && (
        <ConfirmDeleteModal
          onConfirm={handleDelete}
          onCancel={() => setDeleteModalVisible(false)}
          isDeleteLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};
