import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createUserCompanyRelation,
  updateUserCompanyRelation,
  deleteUserCompanyRelation,
} from "../../api/userCompanyRelationsApi";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useBillDetailMutations = (
  user_company_id: string,
  user_id: string,
  company_id: string,
  role_id: string,
  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createUserCompanyRelation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["userCompanyRelationsDetails"],
      });
      toast.success(<div>Успешно добавлено </div>);
    },
    onError: (error: AxiosError) => {
      // Проверяем код ошибки
      toast.error("Ошибка при добавлении");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (editedData: any) =>
      user_company_id
        ? updateUserCompanyRelation(user_company_id, editedData)
        : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userCompanyRelationsDetails"],
      });

      setIsEditing && setIsEditing(false);
      toast.success("Информация обновлена");
    },
    onError: () => {
      toast.error("Ошибка при обновлении данных");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (user_company_id: string) =>
      deleteUserCompanyRelation(user_company_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userCompanyRelationsDetails"],
      });

      toast.success("Успешно удалено");
    },
    onError: () => {
      toast.error("Ошибка при удалении");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
