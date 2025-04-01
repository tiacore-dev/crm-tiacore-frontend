// src/pages/legalEntitiesPage/components/LegalEntitiesTable.tsx
import React, { useState, useCallback } from "react";
import { Table, Tag, Button, Space, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ILegalEntity } from "../../../api/legalEntitiesApi";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { ConfirmDeleteModal } from "../../../components/modals/confirmDeleteModal";
import { useLegalEntityMutations } from "../../../hooks/legalEntities/useLegalEntityMutation";
import { LegalEntityEditModal } from "./legalEntityEditModal";
import { useQueryClient } from "@tanstack/react-query"; // Добавьте этот импорт

interface LegalEntitiesTableProps {
  data: {
    total: number;
    entities: ILegalEntity[];
  };
  loading: boolean;
  companiesData?: {
    company_id: string;
    company_name: string;
  }[]; // Добавляем пропс с данными компаний
}

export const LegalEntitiesTable: React.FC<LegalEntitiesTableProps> = ({
  data = { total: 0, entities: [] }, // Значение по умолчанию
  loading,
  companiesData = [], // Значение по умолчанию
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ILegalEntity | null>(
    null
  );
  const [editedData, setEditedData] = useState<ILegalEntity | null>(null);
  const queryClient = useQueryClient(); // Добавьте эту строку

  const { updateMutation, deleteMutation } = useLegalEntityMutations(
    selectedRecord?.legal_entity_id,
    selectedRecord?.legal_entity_name,
    selectedRecord?.inn,
    selectedRecord?.kpp,
    selectedRecord?.vat_rate,
    selectedRecord?.address,
    selectedRecord?.entity_type,
    selectedRecord?.signer,
    selectedRecord?.company,
    selectedRecord?.description,
    setIsEditing
  );

  const columns: ColumnsType<ILegalEntity> = [
    {
      title: "Название",
      dataIndex: "legal_entity_name",
      key: "legal_entity_name",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: FilterDropdownProps) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по названию"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button onClick={() => confirm()} size="small">
              Поиск
            </Button>
            <Button
              onClick={() => {
                if (clearFilters) {
                  clearFilters();
                }
                confirm();
              }}
              size="small"
            >
              Сбросить
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) =>
        record.legal_entity_name.includes(
          (value as string | number).toString()
        ),
    },
    {
      title: "ИНН",
      dataIndex: "inn",
      key: "inn",
    },
    {
      title: "КПП",
      dataIndex: "kpp",
      key: "kpp",
      width: 120,
    },
    {
      title: "Ставка НДС",
      dataIndex: "vat_rate",
      key: "vat_rate",
      render: (vat_rate) => `${vat_rate}%`,
      width: 100,
    },
    {
      title: "Адрес",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
    },
    {
      title: "Тип",
      dataIndex: "entity_type",
      key: "entity_type",
    },
    {
      title: "Подписавший",
      dataIndex: "signer",
      key: "signer",
    },
    {
      title: "Компания",
      key: "company",
      render: (_, record) => {
        // Находим компанию по ID
        const company = companiesData.find(
          (c) => c.company_id === record.company
        );
        return company?.company_name || record.company;
      },
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => {
              setSelectedRecord(record);
              setEditedData(record); // Устанавливаем конкретную запись
              setIsEditing(true);
            }}
          >
            Редактировать
          </Button>
          <Button
            type="link"
            danger
            onClick={() => {
              setSelectedRecord(record);
              setShowDeleteConfirm(true);
            }}
          >
            Удалить
          </Button>
        </Space>
      ),
    },
  ];

  const handleDelete = useCallback(() => {
    deleteMutation.mutate(undefined, {
      // Передаем undefined, так как ID уже в хуке
      onSuccess: () => {
        setShowDeleteConfirm(false);
        setSelectedRecord(null);
        queryClient.invalidateQueries({ queryKey: ["legalEntities"] });
      },
    });
  }, [deleteMutation]);

  const handleEditChange = useCallback((field: string, value: string) => {
    setEditedData((prevData) => {
      if (prevData) {
        return {
          ...prevData,
          [field]: value,
        };
      }
      return null;
    });
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!editedData) return;

    updateMutation.mutate(editedData, {
      onSuccess: () => {
        setIsEditing(false);
        setSelectedRecord(null);
        queryClient.invalidateQueries({ queryKey: ["legalEntities"] });
      },
    });
  }, [updateMutation, editedData, queryClient]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditedData(null);
  }, []);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data?.entities || []}
        rowKey="legal_entity_id"
        loading={loading}
      />
      {isEditing && editedData && (
        <LegalEntityEditModal
          editedData={editedData}
          onChange={handleEditChange}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          isUpdateLoading={updateMutation.isPending}
        />
      )}
      {showDeleteConfirm && selectedRecord && (
        <ConfirmDeleteModal
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setSelectedRecord(null);
          }}
          isDeleteLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};
