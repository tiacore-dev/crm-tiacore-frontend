import { Table, Typography, Spin } from "antd";
import { useUserCompanyRelationsDetailsQuery } from "../hooks/userCompanyRelations/useUserCompanyRelationsQuery";
import { useUserDetailsQuery } from "../hooks/users/useUserQuery";
import { useCompanyDetailsQuery } from "../hooks/companies/useCompanyQuery";
import { useUserRoles } from "../hooks/base/useBaseQuery";
import { getCompanyNameById } from "../utils/infoById";

interface RelationsTableProps {
  userId?: string;
  companyId?: string;
}

export const RelationsTable: React.FC<RelationsTableProps> = ({
  userId,
  companyId,
}) => {
  const { data: relationsData, isLoading: isLoadingRelations } =
    useUserCompanyRelationsDetailsQuery(userId, companyId);

  const { data: userRolesData, isLoading: isLoadingRoles } = useUserRoles();

  // Получаем дополнительные данные в зависимости от того, что передано
  const { data: userData } = useUserDetailsQuery(userId || "");
  //   const { data: companyData } = useCompanyDetailsQuery(companyId || "");

  const getRoleNameById = (roleId: string) => {
    return (
      userRolesData?.user_roles.find((role) => role.role_id === roleId)
        ?.role_name || roleId
    );
  };

  //   eb4718e5-f8ef-493b-b324-029f1009ce73
  // 2672a201-ef79-48fc-90f5-0c147c11ed2f
  //   const columns = userId
  //     ? [
  //         // Колонки для страницы компании (показываем пользователей)

  //         {
  //           title: "Компания",
  //           dataIndex: "company_id",
  //           key: "company",
  //           render: (companyId: string) => companyData?.company_name || companyId,
  //         },
  //         {
  //           title: "Роль",
  //           dataIndex: "role_id",
  //           key: "role",
  //           render: (roleId: string) => getRoleNameById(roleId),
  //         },
  //       ]
  //     : [
  //         // Колонки для страницы пользователя (показываем компании)
  //         {
  //           title: "Пользователь",
  //           dataIndex: "user_id",
  //           key: "user",
  //           render: (userId: string) => userData?.full_name || userId,
  //         },
  //         {
  //           title: "Роль",
  //           dataIndex: "role_id",
  //           key: "role",
  //           render: (roleId: string) => getRoleNameById(roleId),
  //         },
  //       ];

  if (isLoadingRelations || isLoadingRoles) {
    return <Spin size="large" />;
  }

  return (
    <div style={{ marginTop: 24 }}>
      <Typography.Title level={4}>
        {userId ? "Компании пользователя" : "Пользователи компании"}
      </Typography.Title>
      <Table
        // columns={columns}
        dataSource={relationsData?.relations || []}
        rowKey="user_company_id"
        pagination={false}
        bordered
      />
    </div>
  );
};
