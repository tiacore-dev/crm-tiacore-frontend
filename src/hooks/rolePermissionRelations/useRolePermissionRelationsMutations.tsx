import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRolePermission,
  updateRolePermission,
  deleteRolePermission,
} from "../../api/rolePermissionsRelationsApi";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useRolePermissionRelationsMutations = (
  role_permission_id: string,
  role_id: string,
  permission_id: string,
  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createRolePermission,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["rolePermissionRelations"] });
      toast.success("Информация добавлена");
    },
    onError: (error: AxiosError) => {
      toast.error("Ошибка при добавлении");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (editedData: any) =>
      role_permission_id
        ? updateRolePermission(role_permission_id, editedData)
        : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rolePermissionRelations"] });
      setIsEditing && setIsEditing(false);
      toast.success("Информация обновлена");
    },
    onError: () => {
      toast.error("Ошибка при обновлении данных");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (role_permission_id: string) =>
      deleteRolePermission(role_permission_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rolePermissionRelations"] });
      toast.success("Успешно удалено");
    },
    onError: () => {
      toast.error("Ошибка при удалении");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
