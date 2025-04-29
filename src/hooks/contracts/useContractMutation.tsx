import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createContract,
  updateContract,
  deleteContract,
} from "../../api/contractsApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Button } from "antd";

export const useContractMutations = (
  contract_id: string,
  contract_name: string,
  contract_date: number,
  buyer: string,
  seller: string,
  comment: string,
  file: string,
  status: string,
  company: string,
  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => createContract(formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["contracts"],
        exact: false, // чтобы удалить все варианты ключей с фильтрами
      });
      toast.success(
        <div>
          Договор успешно добавлен{" "}
          <Button
            type="link"
            onClick={() => navigate(`/contracts/${data.contract_id}`)}
          >
            Подробнее
          </Button>
        </div>
      );
    },
    onError: (error: AxiosError) => {
      toast.error("Ошибка при добавлении договора");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (editedData: FormData | object) => {
      if (!contract_id) return Promise.reject("Нет ID договора");
      // console.log("Отправляемые данные:", editedData);
      return updateContract(contract_id, editedData);
    },
    onSuccess: () => {
      if (contract_id) {
        queryClient.invalidateQueries({
          queryKey: ["contractDetails", contract_id],
        });
      }
      setIsEditing?.(false);
      toast.success("Информация обновлена");
    },
    onError: (error) => {
      // console.error("Ошибка при обновлении:", error);
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
