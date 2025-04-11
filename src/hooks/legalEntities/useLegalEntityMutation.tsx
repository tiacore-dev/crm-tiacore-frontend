import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createLegalEntity,
  updateLegalEntity,
  deleteLegalEntity,
} from "../../api/legalEntitiesApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

export const useLegalEntityMutations = (
  legal_entity_id: string,
  legal_entity_name: string,
  inn: string,
  kpp: string,
  vat_rate: number,
  address: string,
  entity_type: string,
  signer: string,
  company: string,
  description?: string,
  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: createLegalEntity,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["legalEntities"] });
      toast.success("Информация успешно добавлена");
    },
    onError: (error: AxiosError) => {
      // Проверяем код ошибки
      toast.error("Ошибка при добавлении компании");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (editedData: any) =>
      legal_entity_id
        ? updateLegalEntity(legal_entity_id, editedData)
        : Promise.reject(),
    onSuccess: () => {
      if (legal_entity_id) {
        queryClient.invalidateQueries({
          queryKey: ["legalEntityDetails", legal_entity_id],
        });
      }
      setIsEditing && setIsEditing(false);
      toast.success("Информация обновлена");
    },
    onError: () => {
      toast.error("Ошибка при обновлении данных");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () =>
      legal_entity_id ? deleteLegalEntity(legal_entity_id) : Promise.reject(),
    onSuccess: () => {
      toast.success("Успешно удалено");
    },
    onError: () => {
      toast.error("Ошибка при удалении");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
