import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBillDetail,
  updateBillDetail,
  deleteBillDetail,
} from "../../api/billDetailsApi";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useBillDetailMutations = (
  bill_detail_id: string, //uuid4
  bill: string, //uuid4
  service: string, //uuid4
  quantity: number,
  summ: number,
  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createBillDetail,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["billDetails"] });
      toast.success(<div>Успешно добавлено </div>);
    },
    onError: (error: AxiosError) => {
      // Проверяем код ошибки
      toast.error("Ошибка при добавлении");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (editedData: any) =>
      bill_detail_id
        ? updateBillDetail(bill_detail_id, editedData)
        : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["billDetails"],
      });

      setIsEditing && setIsEditing(false);
      toast.success("Информация обновлена");
    },
    onError: () => {
      toast.error("Ошибка при обновлении данных");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (bill_detail_id: string) => deleteBillDetail(bill_detail_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billDetails"] });

      toast.success("Успешно удалено");
    },
    onError: () => {
      toast.error("Ошибка при удалении");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
