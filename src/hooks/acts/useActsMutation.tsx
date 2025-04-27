import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAct, updateAct, deleteAct } from "../../api/actsApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Button } from "antd";

export const useActsMutations = (
  act_id: string,
  act_number: string,
  act_date: number,
  contract: string,
  buyer: string,
  seller: string,
  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: (newAct: {
      act_number: string;
      act_date: number;
      contract?: string; // Указываем, что поле необязательное
      buyer: string;
      seller: string;
    }) => createAct(newAct),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["acts"],
      });
      navigate(`/acts/${data.act_id}`);
      toast.success(<div>Акт успешно добавлен </div>);
    },
    onError: (error: AxiosError) => {
      toast.error("Ошибка при добавлении акта");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (editedData: any) =>
      act_id ? updateAct(act_id, editedData) : Promise.reject(),
    onSuccess: () => {
      if (act_id) {
        queryClient.invalidateQueries({
          queryKey: ["act", act_id],
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
    mutationFn: () => (act_id ? deleteAct(act_id) : Promise.reject()),
    onSuccess: () => {
      toast.success("Успешно удалено");
    },
    onError: () => {
      toast.error("Ошибка при удалении");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
