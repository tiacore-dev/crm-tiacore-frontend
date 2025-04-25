import React, { useEffect, useState } from "react";
import { Modal, Form } from "antd";
import { ILegalEntityType } from "../../../api/baseApi";
import { ILegalEntity } from "../../../api/legalEntitiesApi";
import { useLegalEntityMutations } from "../../../hooks/legalEntities/useLegalEntityMutation";
import { ICompany } from "../../../api/companiesApi";
import {
  useLegalEntityByInnKppQuery,
  useLegalEntityDetailsQuery,
} from "../../../hooks/legalEntities/useLegalEntityQuery";
import { renderFooter } from "./renderLegalEntityFooter";
import {
  renderAdditionalFields,
  renderBasicFields,
} from "./renderLegalEntityFields";
import { useEntityCompanyRelationsMutations } from "../../../hooks/entityCompanyRelations/useEntityCompanyRelationMutations";

export interface LegalEntityModalProps {
  visible: boolean;
  onCancel: () => void;
  legalEntityTypes: ILegalEntityType[];
  companiesDate: ICompany[];
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialData?: ILegalEntity | null;
}

export const LegalEntityFormModal: React.FC<LegalEntityModalProps> = ({
  visible,
  onCancel,
  legalEntityTypes,
  companiesDate,
  onSuccess,
  mode = "create",
  initialData = null,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllFields, setShowAllFields] = useState(mode === "edit");
  const [basicFieldsData, setBasicFieldsData] = useState<{
    inn: string;
    kpp: string;
    relation_type?: string;
  } | null>(null);
  const [isExistingEntity, setIsExistingEntity] = useState(false);
  const [innForCheck, setInnForCheck] = useState<string | null>(null);
  const [kppForCheck, setKppForCheck] = useState<string | null>(null);

  const { createMutation, updateMutation } = useLegalEntityMutations(
    initialData?.legal_entity_id || "",
    initialData?.legal_entity_name || "",
    initialData?.inn || "",
    initialData?.vat_rate || null,
    initialData?.address || "",
    initialData?.entity_type || null,
    initialData?.company || "",
    initialData?.kpp || null,
    initialData?.signer || undefined
  );

  const { createMutation: createRelationMutation } =
    useEntityCompanyRelationsMutations("", "", "", "");

  // Запрос для проверки существующего контрагента
  const { data: existingEntity, isFetching: isCheckingExisting } =
    useLegalEntityByInnKppQuery(innForCheck || "", kppForCheck || null);

  // Запрос для получения деталей контрагента, если он найден
  const { data: entityDetails } = useLegalEntityDetailsQuery(
    existingEntity?.legal_entity_id || ""
  );

  useEffect(() => {
    if (entityDetails && showAllFields) {
      form.setFieldsValue({
        legal_entity_name: entityDetails.legal_entity_name,
        address: entityDetails.address,
        vat_rate: entityDetails.vat_rate,
        entity_type: entityDetails.entity_type,
        signer: entityDetails.signer,
      });
      setIsExistingEntity(true);
    } else if (showAllFields) {
      setIsExistingEntity(false);
    }
  }, [entityDetails, showAllFields, form]);

  useEffect(() => {
    if (visible) {
      if (initialData && mode === "edit") {
        form.setFieldsValue({
          legal_entity_name: initialData.legal_entity_name,
          inn: initialData.inn,
          kpp: initialData.kpp,
          address: initialData.address,
          vat_rate: initialData.vat_rate,
          entity_type: initialData.entity_type,
          signer: initialData.signer,
        });
        setShowAllFields(true);
      } else {
        form.resetFields();
        setShowAllFields(false);
        setBasicFieldsData(null);
      }
    }
  }, [visible, initialData, mode, form]);

  const handleNext = async () => {
    try {
      const values = await form.validateFields(["inn", "kpp", "relation_type"]);
      setInnForCheck(values.inn);
      setKppForCheck(values.kpp || null);
      setBasicFieldsData({
        inn: values.inn,
        kpp: values.kpp,
        relation_type: values.relation_type,
      });
      setShowAllFields(true);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleBack = () => {
    setShowAllFields(false);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      const selectedCompanyId = localStorage.getItem("selectedCompanyId");

      const cleanData = (data: any) => {
        const cleaned = { ...data };
        if (
          cleaned.signer === null ||
          cleaned.signer === undefined ||
          cleaned.signer === ""
        ) {
          delete cleaned.signer;
        }
        if (
          cleaned.entity_type === null ||
          cleaned.entity_type === undefined ||
          cleaned.entity_type === ""
        ) {
          delete cleaned.entity_type;
        }
        return cleaned;
      };

      if (mode === "create") {
        // Если найден существующий контрагент по ИНН/КПП
        if (existingEntity?.legal_entity_id) {
          // Создаем только связь с компанией
          await createRelationMutation.mutateAsync({
            legal_entity: existingEntity.legal_entity_id,
            company: selectedCompanyId || "",
            relation_type:
              basicFieldsData?.relation_type || values.relation_type,
          });
        } else {
          // Создаем нового контрагента

          const formData = cleanData({
            ...values,
            relation_type:
              basicFieldsData?.relation_type || values.relation_type,
            company: selectedCompanyId || null,
          });
          await createMutation.mutateAsync(formData);
        }
      } else if (mode === "edit" && initialData?.legal_entity_id) {
        const formData = cleanData(values);
        await updateMutation.mutateAsync(formData);
      }

      form.resetFields();
      onCancel();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const relationType = form.getFieldValue("relation_type");

  return (
    <Modal
      title={
        mode === "create" ? "Добавить контрагента" : "Редактировать контрагента"
      }
      open={visible}
      onCancel={onCancel}
      footer={renderFooter({
        mode,
        showAllFields,
        isSubmitting,
        onCancel,
        handleBack,
        handleSubmit,
        handleNext,
      })}
      width={700}
    >
      <Form form={form} layout="vertical">
        {!showAllFields
          ? renderBasicFields({ mode })
          : renderAdditionalFields({
              mode,
              isExistingEntity,
              relationType,
              legalEntityTypes,
              companiesDate,
            })}
      </Form>
    </Modal>
  );
};
