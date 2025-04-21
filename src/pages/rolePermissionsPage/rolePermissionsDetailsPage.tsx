// src/pages/rolePermissions/RolePermissionsDetailsPage.tsx
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { Button, Spin, Card, List, Checkbox, message } from "antd";
import { BackButton } from "../../components/backButton";
import { useRoleDetailsQuery } from "../../hooks/role/useRoleQuery";
import { useParams } from "react-router-dom";
import { usePermissionsQuery } from "../../hooks/permissions/usePermissionsQuery";
import { useRolePermissionsQuery } from "../../hooks/rolePermissionRelations/useRolePermissionRelationsQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRolePermission,
  deleteRolePermission,
} from "../../api/rolePermissionsRelationsApi";

export const RolePermissionsDetailsPage: React.FC = () => {
  const { role_id } = useParams<{ role_id: string }>();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // Получаем данные о роли
  const {
    data: role,
    isLoading: isLoadingRole,
    isError: isErrorRole,
  } = useRoleDetailsQuery(role_id || "");

  useEffect(() => {
    if (role) {
      dispatch(
        setBreadcrumbs([
          { label: "Главная страница", to: "/home" },
          { label: "Управление доступом", to: "/role_permissions_relations" },
          {
            label: role.role_name,
            to: `/role_permissions_relations/${role_id}`,
          },
        ])
      );
    }
  }, [role, dispatch, role_id]);

  // Получаем все возможные разрешения
  const {
    data: allPermissions,
    isLoading: isLoadingPermissions,
    isError: isErrorPermissions,
  } = usePermissionsQuery();

  // Получаем разрешения, связанные с текущей ролью
  const {
    data: rolePermissions,
    isLoading: isLoadingRolePermissions,
    isError: isErrorRolePermissions,
  } = useRolePermissionsQuery({ role: role_id });

  // Мутация для добавления разрешения к роли
  const addPermissionMutation = useMutation({
    mutationFn: (permission_id: string) =>
      createRolePermission({ role: role_id || "", permission: permission_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rolePermissionRelations"] });
      message.success("Разрешение добавлено к роли");
    },
    onError: () => {
      message.error("Ошибка при добавлении разрешения");
    },
  });

  // Мутация для удаления разрешения из роли
  const removePermissionMutation = useMutation({
    mutationFn: (role_permission_id: string) =>
      deleteRolePermission(role_permission_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rolePermissionRelations"] });
      message.success("Разрешение удалено из роли");
    },
    onError: () => {
      message.error("Ошибка при удалении разрешения");
    },
  });

  // Проверяем, есть ли у разрешения связь с текущей ролью
  const isPermissionLinked = (permissionId: string) => {
    return rolePermissions?.relations.some(
      (rp) => rp.permission_id === permissionId
    );
  };

  // Получаем ID связи для разрешения
  const getRelationId = (permissionId: string) => {
    const relation = rolePermissions?.relations.find(
      (rp) => rp.permission_id === permissionId
    );
    return relation?.role_permission_id;
  };

  // Обработчик изменения состояния чекбокса
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      addPermissionMutation.mutate(permissionId);
    } else {
      const relationId = getRelationId(permissionId);
      if (relationId) {
        removePermissionMutation.mutate(relationId);
      }
    }
  };

  if (isLoadingRole || isLoadingPermissions || isLoadingRolePermissions) {
    return <Spin size="large" className="center-spin" />;
  }

  if (isErrorRole || isErrorPermissions || isErrorRolePermissions) {
    return <BackButton />;
  }

  return (
    <div className="main-container">
      <Card title={`Роль: ${role?.role_name}`}>
        <List
          header={<div>Список разрешений</div>}
          bordered
          dataSource={allPermissions?.permissions || []}
          renderItem={(permission) => (
            <List.Item>
              <Checkbox
                checked={isPermissionLinked(permission.permission_id)}
                onChange={(e) =>
                  handlePermissionChange(
                    permission.permission_id,
                    e.target.checked
                  )
                }
                disabled={
                  addPermissionMutation.isPending ||
                  removePermissionMutation.isPending
                }
              >
                {permission.permission_name}
                {permission.comment && (
                  <span style={{ color: "#888", marginLeft: "8px" }}>
                    ({permission.comment})
                  </span>
                )}
              </Checkbox>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};
