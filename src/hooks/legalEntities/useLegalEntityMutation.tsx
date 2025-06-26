import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createLegalEntity,
  updateLegalEntity,
  deleteLegalEntity,
} from "../../api/legalEntitiesApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Button } from "antd";
import { ILegalEntity, IUpdateLegalEntity } from "../../api/LegalEntities_Api";

export const useLegalEntityMutations = (
  legal_entity_id: string,
  short_name: string,
  inn: string,
  vat_rate: number | null,
  address: string,
  signer: string | null,
  company: string,
  kpp: string | null,
  entity_type?: string,
  // description?: string,
  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: createLegalEntity,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["legalEntitiesSellers"] });
      queryClient.invalidateQueries({ queryKey: ["legalEntitiesBuyers"] });
      toast.success(
        <div>
          Контрагент успешно добавлен{" "}
          <Button
            type="link"
            onClick={() => navigate(`/legal_entities/${data.legal_entity_id}`)}
          >
            Подробнее
          </Button>
        </div>
      );
    },
    onError: (error: AxiosError) => {
      toast.error("Ошибка при добавлении контрагента");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (editedData: any) =>
      legal_entity_id
        ? updateLegalEntity(legal_entity_id, editedData)
        : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["legalEntities"] });
      queryClient.invalidateQueries({
        queryKey: ["legalEntitiesForSelection"],
      });
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
      queryClient.invalidateQueries({ queryKey: ["legalEntities"] });
      queryClient.invalidateQueries({
        queryKey: ["legalEntitiesForSelection"],
      });
      toast.success("Успешно удалено");
    },
    onError: () => {
      toast.error("Ошибка при удалении");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};

export const useUpdateLegalEntity = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ILegalEntity,
    AxiosError,
    { legal_entity_id: string; updatedData: IUpdateLegalEntity }
  >({
    mutationFn: ({ legal_entity_id, updatedData }) =>
      updateLegalEntity(legal_entity_id, updatedData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["legalEntities"],
      });
      queryClient.invalidateQueries({
        queryKey: ["legalEntityDetails", variables.legal_entity_id],
      });
      toast.success("Успешно изменено");
    },
    onError: (error) => {
      toast.error(`Ошибка при редактировании: ${error.message}`);
    },
  });
};

export const useDeleteLegalEntity = () => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string>({
    mutationFn: deleteLegalEntity,
    onSuccess: (_, legal_entity_id) => {
      queryClient.invalidateQueries({
        queryKey: ["legalEntities"],
      });
      queryClient.invalidateQueries({
        queryKey: ["legalEntityDetails", legal_entity_id],
      });
      toast.success("Успешно удалено");
    },
    onError: (error) => {
      toast.error(`Ошибка при удалении: ${error.message}`);
    },
  });
};
