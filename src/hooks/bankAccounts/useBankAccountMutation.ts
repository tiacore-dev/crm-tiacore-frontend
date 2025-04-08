import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
} from "../../api/bankAccountsApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

export const useBankAccountMutations = (
  bank_account_id: string,
  legal_entity: string,
  bank_name: string,
  account_number: string,
  bank_bic: string,
  bank_corr_account: string,
  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: createBankAccount,
    onSuccess: (data) => {
      // Инвалидируем кэш для списка банковских счетов
      queryClient.invalidateQueries({
        queryKey: ["bank_accounts"],
      });
      toast.success("Банковский счёт успешно добавлен");
    },
    onError: (error: AxiosError) => {
      toast.error("Ошибка при добавлении банковского счёта");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (editedData: any) =>
      bank_account_id
        ? updateBankAccount(bank_account_id, editedData)
        : Promise.reject(),
    onSuccess: () => {
      if (bank_account_id) {
        queryClient.invalidateQueries({
          queryKey: ["bankAccountDetails", bank_account_id],
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
      bank_account_id ? deleteBankAccount(bank_account_id) : Promise.reject(),
    onSuccess: () => {
      toast.success("Успешно удалено");
    },
    onError: () => {
      toast.error("Ошибка при удалении");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
