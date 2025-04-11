import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "../../api/templatesApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Button } from "antd";

export const useTemplateMutations = (
  template_id: string,
  template_name: string,
  description: string,
  company: string,
  entity: string,
  s3_key: string,
  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => createTemplate(formData), // Обновлено для FormData
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success(
        <div>
          Шаблон успешно добавлен{" "}
          <Button
            type="link"
            onClick={() => navigate(`/templates/${data.template_id}`)}
          >
            Подробнее
          </Button>
        </div>
      );
    },
    onError: (error: AxiosError) => {
      toast.error("Ошибка при добавлении шаблона");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (editedData: FormData | object) => {
      if (!template_id) return Promise.reject("Нет ID шаблона");

      console.log("Отправляемые данные:", editedData);

      return updateTemplate(template_id, editedData);
    },
    onSuccess: () => {
      if (template_id) {
        queryClient.invalidateQueries({
          queryKey: ["templateDetails", template_id],
        });
      }
      setIsEditing?.(false);
      toast.success("Информация обновлена");
    },
    onError: (error) => {
      console.error("Ошибка при обновлении:", error);
      toast.error("Ошибка при обновлении данных");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () =>
      template_id ? deleteTemplate(template_id) : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success("Шаблон успешно удален");
      navigate("/templates");
    },
    onError: () => {
      toast.error("Ошибка при удалении шаблона");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
