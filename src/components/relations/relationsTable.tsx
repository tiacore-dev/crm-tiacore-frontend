import {
  Table,
  Tag,
  Typography,
  Spin,
  Space,
  Menu,
  Dropdown,
  Button,
} from "antd";
import {
  useUserRelationsQuery,
  useCompanyRelationsQuery,
} from "../../hooks/userCompanyRelations/useUserCompanyRelationsQuery";
import { useUserRoles } from "../../hooks/base/useBaseQuery";
import type { IUserCompanyRelation } from "../../api/userCompanyRelationsApi";
import { useCompanyQuery } from "../../hooks/companies/useCompanyQuery";
import { getCompanyNameById } from "../../utils/infoById";
import { useUserQueryAll } from "../../hooks/users/useUserQuery";
import { getUserNameById } from "../../utils/infoById";
import { Link } from "react-router-dom";
import {
  ExportOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useUserCompanyRelationsMutations } from "../../hooks/userCompanyRelations/useUserCompanyRelationsMutations";
import { ConfirmDeleteModal } from "../modals/confirmDeleteModal";
import { RelationFormModal } from "./relationFormModal";

const { Text } = Typography;

interface UserCompanyRelationsTableProps {
  userId?: string;
  companyId?: string;
}
export const UserCompanyRelationsTable = ({
  userId,
  companyId,
}: UserCompanyRelationsTableProps) => {
  // Получаем список всех ролей
  const { data: rolesData, isLoading: rolesLoading } = useUserRoles();

  // Получаем список всех компаний
  const { data: companiesData, isLoading: companiesLoading } =
    useCompanyQuery();

  const { data: usersData, isLoading: usersLoading } = useUserQueryAll();

  // Получаем данные отношений
  const userRelations = useUserRelationsQuery(userId);
  const companyRelations = useCompanyRelationsQuery(companyId);

  // Выбираем нужные данные
  const { data, isLoading, isError } = userId
    ? userRelations
    : companyRelations;

  // Состояния для модальных окон
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedRelation, setSelectedRelation] =
    useState<IUserCompanyRelation | null>(null);
  const [editingRelation, setEditingRelation] =
    useState<IUserCompanyRelation | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Мутации для удаления
  const { deleteMutation } = useUserCompanyRelationsMutations(
    "",
    "",
    "",
    "",
    () => {}
  );

  // Проверяем состояние загрузки
  const isTotalLoading =
    isLoading || rolesLoading || companiesLoading || usersLoading;

  // Проверяем наличие данных
  const hasData = data?.relations && data.relations.length > 0;

  const handleCreate = () => {
    setEditingRelation(null);
    setIsEditModalVisible(true);
  };

  const handleEdit = (relation: IUserCompanyRelation) => {
    setEditingRelation(relation);
    setIsEditModalVisible(true);
  };

  const handleDelete = (relation: IUserCompanyRelation) => {
    setSelectedRelation(relation);
    setShowDeleteConfirm(true);
  };

  const handleSuccess = () => {
    if (userId) userRelations.refetch();
    else if (companyId) companyRelations.refetch();
    setIsEditModalVisible(false);
    setEditingRelation(null);
  };

  const confirmDelete = () => {
    if (selectedRelation) {
      deleteMutation.mutate(selectedRelation.user_company_id, {
        onSuccess: () => setShowDeleteConfirm(false),
      });
    }
  };

  const menu = (relation: IUserCompanyRelation) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={() => handleEdit(relation)}
      >
        Редактировать
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        onClick={() => handleDelete(relation)}
        danger
      >
        Удалить
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: userId ? "Компания" : "Пользователь",
      dataIndex: userId ? "company_id" : "user_id",
      key: userId ? "company" : "user",
      render: (id: string) => (
        <Space>
          <Link to={userId ? `/companies/${id}` : `/users/${id}`}>
            <ExportOutlined />
          </Link>
          {userId
            ? getCompanyName(id)
            : getUserNameById(id, usersData?.users) || id}
        </Space>
      ),
    },
    {
      title: "Роль",
      dataIndex: "role_id",
      key: "role",
      render: (roleId: string) => <Tag color="blue">{getRoleName(roleId)}</Tag>,
    },
    {
      title: " ",
      key: "actions",
      width: 48,
      render: (_: any, record: IUserCompanyRelation) => (
        <Dropdown overlay={menu(record)} trigger={["click"]}>
          <Button
            type="text"
            icon={<MoreOutlined />}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      ),
    },
  ];

  const getRoleName = (roleId: string) => {
    const role = rolesData?.user_roles.find((r) => r.role_id === roleId);
    return role ? role.role_name : roleId;
  };

  const getCompanyName = (companyId: string) => {
    return getCompanyNameById(companyId, companiesData?.companies) || companyId;
  };

  if (isTotalLoading) {
    return <Spin size="large" />;
  }

  if (isError) {
    return <Text type="danger">Ошибка при загрузке данных</Text>;
  }

  if (!hasData) {
    return (
      <>
        <Table
          columns={columns}
          // dataSource={data.relations}
          rowKey="user_company_id"
          pagination={false}
        />
        <Button
          icon={<PlusOutlined />}
          onClick={handleCreate}
          style={{ marginTop: 16 }}
        >
          Добавить
        </Button>
      </>
    );
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={data.relations}
        rowKey="user_company_id"
        pagination={false}
      />

      <Button
        icon={<PlusOutlined />}
        onClick={handleCreate}
        style={{ marginTop: 16 }}
      >
        Добавить
      </Button>

      {showDeleteConfirm && (
        <ConfirmDeleteModal
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          isDeleteLoading={deleteMutation.isPending}
        />
      )}

      {isEditModalVisible && (
        <RelationFormModal
          visible={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          onSuccess={handleSuccess}
          mode={editingRelation ? "edit" : "create"}
          initialData={editingRelation}
          roles={rolesData?.user_roles || []}
          userId={userId}
          companyId={companyId}
          companies={companiesData?.companies || []}
          users={usersData?.users || []}
        />
      )}
    </>
  );
};
