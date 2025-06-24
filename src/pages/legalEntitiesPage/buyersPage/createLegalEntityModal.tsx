import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, message, Spin } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useLegalEntityByInnKppQuery } from "../../../hooks/legalEntities/useLegalEntity_Query";
import { useEntityCompanyRelationsMutations } from "../../../hooks/entityCompanyRelations/useEntityCompanyRelationMutations";
import { createLegalEntityByInn } from "../../../api/LegalEntities_Api";
import { useCompaniesForSelection } from "../../../hooks/companies/useCompanyQuery";

// src/components/modals/CreateLegalEntityModal.tsx
// import React, { useState, useEffect } from "react";
// import { Modal, Form, Input, Select, message, Spin } from "antd";
// import { useMutation } from "@tanstack/react-query";
// import { useLegalEntityByInnKppQuery } from "../../hooks/legalEntities/useLegalEntity_Query";
// import { useEntityCompanyRelationsMutations } from "../../hooks/entityCompanyRelations/useEntityCompanyRelationMutations";
// import { createLegalEntityByInn } from "../../api/LegalEntities_Api";
// import { useCompaniesForSelection } from "../../hooks/companies/useCompanyQuery";

const { Option } = Select;

interface CreateLegalEntityModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  relationType: "buyer" | "seller";
  title: string;
  buttonText: string;
  companyId?: string;
}

export const CreateLegalEntityModal: React.FC<CreateLegalEntityModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  relationType,
  title,
  buttonText,
  companyId,
}) => {
  const [form] = Form.useForm();
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  const [inn, setInn] = useState("");
  const [kpp, setKpp] = useState("");

  const { data: companiesData, isLoading: isCompaniesLoading } =
    useCompaniesForSelection();
  const {
    data: innKppData,
    isError: isInnKppError,
    error: innKppError,
  } = useLegalEntityByInnKppQuery(inn, kpp || undefined, {
    enabled:
      !!inn && ((inn.length === 10 && kpp?.length === 9) || inn.length === 12),
  });

  useEffect(() => {
    if (form.getFieldValue("inn")?.length === 12) {
      form.setFieldsValue({ kpp: undefined });
      setKpp("");
    }
  }, [form.getFieldValue("inn")?.length]);

  const { mutateAsync: createLegalEntityByInnMutation } = useMutation({
    mutationFn: createLegalEntityByInn,
    onSuccess: () => {
      message.success(
        `${
          relationType === "buyer"
            ? "Контрагент успешно добавлен"
            : "Организация успешно добавлена"
        }`
      );
      onSuccess();
      onCancel();
    },
    onError: () => {
      message.error(
        `Ошибка при добавлении ${
          relationType === "buyer" ? "контрагента" : "организации"
        }`
      );
    },
  });

  const { createMutation } = useEntityCompanyRelationsMutations(
    "",
    innKppData?.legal_entity_id || "",
    companyId ||
      (isSuperadmin
        ? form.getFieldValue("company_id")
        : selectedCompanyId || ""),
    relationType
  );

  const validateInn = (_: unknown, value: string): Promise<void> => {
    if (!value) return Promise.reject("Пожалуйста, введите ИНН");

    if (!/^\d{10}$|^\d{12}$/.test(value)) {
      return Promise.reject("ИНН должен содержать 10 или 12 цифр");
    }

    return Promise.resolve();
  };

  interface ValidateKppParams {
    getFieldValue: (name: string) => string;
  }

  const validateKpp = (
    _: unknown,
    value: string | undefined,
    { getFieldValue }: ValidateKppParams
  ): Promise<void> => {
    const inn = getFieldValue("inn");

    if (inn?.length === 10) {
      if (!value) return Promise.reject("Для организаций КПП обязателен");
      if (!/^\d{9}$/.test(value))
        return Promise.reject("КПП должен содержать 9 цифр");
    }

    if (inn?.length === 12 && value) {
      return Promise.reject("Для ИП КПП не требуется");
    }

    return Promise.resolve();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (isInnKppError) {
        if ((innKppError as any)?.response?.status === 404) {
          await createLegalEntityByInnMutation({
            inn: values.inn,
            kpp: values.kpp,
            company_id:
              companyId ||
              (isSuperadmin ? values.company_id : selectedCompanyId || ""), // Используем переданный companyId если есть
            relation_type: relationType,
            description: values.description,
          });
        } else {
          message.error("Произошла ошибка при проверке ИНН/КПП");
          return;
        }
      } else if (innKppData?.legal_entity_id) {
        await createMutation.mutateAsync({
          legal_entity_id: innKppData.legal_entity_id,
          company_id: isSuperadmin
            ? values.company_id
            : selectedCompanyId || "",
          relation_type: relationType,
        });
      }

      onSuccess();
      form.resetFields();
      onCancel();
    } catch (error) {
      console.error(
        `Ошибка при добавлении ${
          relationType === "buyer" ? "контрагента" : "организации"
        }:`,
        error
      );
    }
  };

  return (
    <Modal
      title={title}
      open={visible}
      onOk={handleSubmit}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      okText={buttonText}
      cancelText="Отмена"
      confirmLoading={createMutation.isPending}
    >
      <Spin spinning={isCompaniesLoading}>
        <Form form={form} layout="vertical">
          {isSuperadmin && !companyId && (
            <Form.Item
              name="company_id"
              label="Компания"
              rules={[
                { required: true, message: "Пожалуйста, выберите компанию" },
              ]}
            >
              <Select placeholder="Выберите компанию">
                {companiesData?.companies.map((company) => (
                  <Option key={company.company_id} value={company.company_id}>
                    {company.company_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="inn"
            label="ИНН"
            rules={[{ validator: validateInn }]}
          >
            <Input
              placeholder="Введите ИНН (10 или 12 цифр)"
              onChange={(e) => setInn(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="kpp"
            label={
              form.getFieldValue("inn")?.length === 10
                ? "КПП (обязательно)"
                : "КПП"
            }
            rules={[
              {
                validator: (_, value) =>
                  validateKpp(_, value, { getFieldValue: form.getFieldValue }),
              },
            ]}
            dependencies={["inn"]}
          >
            <Input
              placeholder={
                form.getFieldValue("inn")?.length === 10
                  ? "Введите КПП (9 цифр)"
                  : "Введите КПП (не требуется для ИП)"
              }
              onChange={(e) => setKpp(e.target.value)}
              disabled={form.getFieldValue("inn")?.length === 12}
            />
          </Form.Item>

          <Form.Item name="description" label="Комментарий (необязательно)">
            <Input.TextArea placeholder="Введите комментарий" />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
