// src/hooks/legalEntities/useLegalEntityMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLegalEntityByInn } from "../../api/LegalEntities_Api";
import { message } from "antd";
import { useEntityCompanyRelationsMutations } from "../entityCompanyRelations/useEntityCompanyRelationMutations";
import { AxiosError } from "axios";

export const useLegalEntityMutations = (
  relationType: "buyer" | "seller",
  companyId?: string,
  onSuccess?: () => void,
  onCancel?: () => void
) => {
  const queryClient = useQueryClient();
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const { createMutation } = useEntityCompanyRelationsMutations(
    "",
    "",
    companyId || selectedCompanyId || "",
    relationType
  );

  const createLegalEntityByInnMutation = useMutation({
    mutationFn: createLegalEntityByInn,
    onSuccess: () => {
      message.success(
        `${
          relationType === "buyer"
            ? "Контрагент успешно добавлен"
            : "Организация успешно добавлена"
        }`
      );
      // Инвалидируем кэш для списка юридических лиц
      queryClient.invalidateQueries({
        queryKey: ["legalEntities"],
      });
      // Инвалидируем кэш в зависимости от типа отношения
      queryClient.invalidateQueries({
        queryKey: [
          relationType === "buyer"
            ? "legalEntitiesBuyers"
            : "legalEntitiesSellers",
          companyId || selectedCompanyId,
        ],
      });
      onSuccess?.();
      onCancel?.();
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 400) {
        message.error("Организация с таким ИНН уже существует");
      } else {
        message.error(
          `Ошибка при добавлении ${
            relationType === "buyer" ? "контрагента" : "организации"
          }`
        );
      }
    },
  });

  const handleCreateRelation = async (
    legalEntityId: string,
    companyId?: string
  ) => {
    const result = await createMutation.mutateAsync({
      legal_entity_id: legalEntityId,
      company_id: companyId || selectedCompanyId || "",
      relation_type: relationType,
    });

    // После создания связи также инвалидируем кэш
    queryClient.invalidateQueries({
      queryKey: ["legalEntities"],
    });
    queryClient.invalidateQueries({
      queryKey: [
        relationType === "buyer"
          ? "legalEntitiesBuyers"
          : "legalEntitiesSellers",
        companyId || selectedCompanyId,
      ],
    });

    return result;
  };

  return {
    createLegalEntityByInnMutation,
    handleCreateRelation,
    isSuperadmin,
    selectedCompanyId,
  };
};
