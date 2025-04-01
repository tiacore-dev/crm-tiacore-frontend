import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createContract,
  updateContract,
  deleteContract,
} from "../../api/contractsApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

export const useContractMutations = (
  contract_id: string,
  contract_name: string,
  contract_date: 0,
  buyer: string,
  seller: string,
  file: string,
  status: string,
  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: createContract,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      toast.success(<>Информация успешно добавлена{""}</>);
    },
    onError: (error: AxiosError) => {
      // Проверяем код ошибки
      toast.error("Ошибка при добавлении компании");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (editedData: any) =>
      contract_id ? updateContract(contract_id, editedData) : Promise.reject(),
    onSuccess: () => {
      if (contract_id) {
        queryClient.invalidateQueries({
          queryKey: ["legalEntityDetails", contract_id],
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
      contract_id ? deleteContract(contract_id) : Promise.reject(),
    onSuccess: () => {
      toast.success("Успешно удалено");
    },
    onError: () => {
      toast.error("Ошибка при удалении");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
