// src/hooks/useServiceMutations.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createService,
  updateService,
  deleteService,
} from "../../api/servicesApi";
import toast from "react-hot-toast";

export const useServiceMutations = (
  service_id: string = "",
  service_name: string = "",
  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success(<div>Услуга успешно добавлена </div>);
    },
    onError: () => {
      toast.error("Ошибка при добавлении услуги");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (editedData: any) =>
      service_id ? updateService(service_id, editedData) : Promise.reject(),
    onSuccess: () => {
      if (service_id) {
        queryClient.invalidateQueries({
          queryKey: ["serviceDetails", service_id],
        });
      }
      setIsEditing && setIsEditing(false);
      toast.success("Услуга успешно обновлена");
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: () => {
      toast.error("Ошибка при обновлении данных");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Услуга успешно удалена");
    },
    onError: () => {
      toast.error("Ошибка при удалении услуги");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
