// src/hooks/entityCompanyRelations/useEntityCompanyRelationMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEntityCompanyRelation } from "../../api/entityCompanyRelationsApi";
import { message } from "antd";
import { AxiosError } from "axios";

export const useEntityCompanyRelationsMutations = (
  entity_company_relation_id: string,
  legal_entity_id: string,
  company_id: string,
  relation_type: "buyer" | "seller",
  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const createMutation = useMutation({
    mutationFn: createEntityCompanyRelation,
    onSuccess: () => {
      // Инвалидируем основные запросы
      queryClient.invalidateQueries({
        queryKey: ["entity_company_relation"],
      });

      // Инвалидируем запросы юридических лиц
      queryClient.invalidateQueries({
        queryKey: ["legalEntities"],
      });

      // Инвалидируем запросы в зависимости от типа отношения
      queryClient.invalidateQueries({
        queryKey: [
          relation_type === "buyer"
            ? "legalEntitiesBuyers"
            : "legalEntitiesSellers",
          company_id || selectedCompanyId,
        ],
      });

      // Для надежности инвалидируем оба типа
      queryClient.invalidateQueries({
        queryKey: ["legalEntitiesSellers"],
      });
      queryClient.invalidateQueries({
        queryKey: ["legalEntitiesBuyers"],
      });

      message.success(
        `Связь успешно ${relation_type === "buyer" ? "добавлена" : "обновлена"}`
      );

      if (setIsEditing) {
        setIsEditing(false);
      }
    },
    onError: (error: AxiosError) => {
      message.error(
        `Ошибка при ${
          relation_type === "buyer" ? "добавлении" : "обновлении"
        } связи`
      );
      console.error("Error creating relation:", error);
    },
  });

  return {
    createMutation,
  };
};
