import { Table, Tag, Typography, Spin, Space } from "antd";
import {
  useUserRelationsQuery,
  useCompanyRelationsQuery,
} from "../hooks/userCompanyRelations/useUserCompanyRelationsQuery";
import { useUserRoles } from "../hooks/base/useBaseQuery";
import type { IUserCompanyRelation } from "../api/userCompanyRelationsApi";
import { useCompanyQuery } from "../hooks/companies/useCompanyQuery";
import { getCompanyNameById } from "../utils/infoById";
import { useUserQueryAll } from "../hooks/users/useUserQuery";
import { getUserNameById } from "../utils/infoById";
import { Link } from "react-router-dom";
import { ExportOutlined } from "@ant-design/icons";

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

  if (isLoading || rolesLoading || companiesLoading)
    return <Spin size="large" />;
  if (isError)
    return <Text type="danger">Произошла ошибка при загрузке данных</Text>;
  if (!data?.relations?.length) return <Text>Нет связей для отображения</Text>;

  // Функция для получения названия роли по ID
  const getRoleName = (roleId: string) => {
    const role = rolesData?.user_roles.find((r) => r.role_id === roleId);
    return role ? role.role_name : roleId;
  };

  // Функция для получения названия компании по ID
  const getCompanyName = (companyId: string) => {
    return getCompanyNameById(companyId, companiesData?.companies) || companyId;
  };

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
    // {
    //   title: "Действия",
    //   key: "actions",
    //   render: (_: any, record: IUserCompanyRelation) => (
    //     <Space size="middle">
    //       <a onClick={() => console.log("Edit", record.user_company_id)}>
    //         Изменить
    //       </a>
    //       <a onClick={() => console.log("Delete", record.user_company_id)}>
    //         Удалить
    //       </a>
    //     </Space>
    //   ),
    // },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data.relations}
      rowKey="user_company_id"
      pagination={false}
    />
  );
};
