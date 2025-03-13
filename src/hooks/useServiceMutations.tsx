// src/hooks/useServiceMutations.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createService,
  updateService,
  deleteService,
} from "../api/servicesApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Хук для мутаций над одной услугой
export const useServiceMutations = (
  service_id?: string,
  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success(
        <>
          Услуга успешно добавлена{""}
          <button onClick={() => navigate(`/services/${data.service_id}`)}>
            Подробнее
          </button>
        </>
      );
      // navigate(`/services/${data.service_id}`);
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
    },
    onError: () => {
      toast.error("Ошибка при обновлении данных");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () =>
      service_id ? deleteService(service_id) : Promise.reject(),
    onSuccess: () => {
      toast.success("Услуга успешно удалена");
      navigate(-1);
    },
    onError: () => {
      toast.error("Ошибка при удалении услуги");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
