import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createActDetail,
  updateActDetail,
  deleteActDetail,
} from "../../api/actDetailsApi";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useActDetailMutations = (
  act_detail_id: string, //uuid4
  act: string, //uuid4
  service: string, //uuid4
  quantity: number,
  summ: number,
  price: number,
  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createActDetail,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["actDetails"] });
      toast.success(<div>Успешно добавлено </div>);
    },
    onError: (error: AxiosError) => {
      // Проверяем код ошибки
      toast.error("Ошибка при добавлении");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (editedData: any) =>
      act_detail_id
        ? updateActDetail(act_detail_id, editedData)
        : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["actDetails"] });

      setIsEditing && setIsEditing(false);
      toast.success("Информация обновлена");
    },
    onError: () => {
      toast.error("Ошибка при обновлении данных");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (act_detail_id: string) => deleteActDetail(act_detail_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["actDetails"] });

      toast.success("Успешно удалено");
    },
    onError: () => {
      toast.error("Ошибка при удалении");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
