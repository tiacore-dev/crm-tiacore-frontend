import React, { useEffect, useState, useMemo } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  message,
  DatePicker,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useContractMutations } from "../../../hooks/contracts/useContractMutation";
import { RcFile } from "antd/es/upload";
import { IContract } from "../../../api/contractsApi";
import { IContractStatusesResponse } from "../../../api/baseApi";
import { useQuery } from "@tanstack/react-query";
import { fetchContractStatuses } from "../../../api/baseApi";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";
import {
  useLegalEntitiesBuyers,
  useLegalEntitiesSellers,
} from "../../../hooks/legalEntities/useLegalEntityQuery";
import { useCompaniesForSelection } from "../../../hooks/companies/useCompanyQuery";

type ContractFormMode = "create" | "edit";

interface ContractFormModalProps {
  mode: ContractFormMode;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  contractData?: IContract;
}

export const ContractFormModal: React.FC<ContractFormModalProps> = ({
  mode,
  visible,
  onCancel,
  onSuccess,
  contractData,
}) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState<RcFile | null>(null);
  const [removeExistingFile, setRemoveExistingFile] = useState(false);
  const queryClient = useQueryClient();
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const { data: buyersResponse } = useLegalEntitiesBuyers();
  const buyersData = buyersResponse?.entities || [];

  const { data: sellersResponse } = useLegalEntitiesSellers();
  const sellersData = sellersResponse?.entities || [];

  const { data: companiesResponse } = useCompaniesForSelection();
  const companiesData = companiesResponse?.companies || [];

  const { createMutation, updateMutation } = useContractMutations(
    mode === "edit" ? contractData?.contract_id || "" : "",
    mode === "edit" ? contractData?.contract_name || "" : "",
    mode === "edit" ? contractData?.contract_date || 0 : 0,
    mode === "edit" ? contractData?.buyer || "" : "",
    mode === "edit" ? contractData?.seller || "" : "",
    mode === "edit" ? contractData?.file || "" : "",
    mode === "edit" ? contractData?.comment || "" : "",
    mode === "edit" ? contractData?.status || "" : "",
    mode === "edit" ? contractData?.company || "" : ""
  );

  useEffect(() => {
    if (visible) {
      if (mode === "edit" && contractData) {
        form.setFieldsValue({
          contract_name: contractData.contract_name,
          contract_date: contractData.contract_date
            ? dayjs(contractData.contract_date)
            : null,
          buyer: contractData.buyer,
          seller: contractData.seller,
          comment: contractData.comment,
          status: contractData.status,
          company: contractData.company,
        });
      } else if (!isSuperadmin && selectedCompanyId) {
        // Автозаполняем company для обычных пользователей
        form.setFieldsValue({
          company: selectedCompanyId,
        });
      } else {
        form.resetFields();
      }
      setFile(null);
      setRemoveExistingFile(false);
    }
  }, [visible, mode, contractData, form, isSuperadmin, selectedCompanyId]);

  const beforeUpload = (file: RcFile) => {
    setFile(file);
    setRemoveExistingFile(false);
    return false;
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (mode === "edit") {
      setRemoveExistingFile(true);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("contract_name", values.contract_name);

      const contractDateTimestamp = values.contract_date
        ? values.contract_date.valueOf()
        : null;

      if (contractDateTimestamp !== null) {
        formData.append("contract_date", contractDateTimestamp.toString());
      } else if (mode === "create") {
        throw new Error("Дата договора обязательна");
      }

      formData.append("buyer", values.buyer);
      formData.append("seller", values.seller);
      formData.append("status", values.status);

      // Добавляем company в зависимости от прав пользователя
      const companyValue = isSuperadmin ? values.company : selectedCompanyId;
      if (companyValue) {
        formData.append("company", companyValue);
      }

      if (values.comment) {
        formData.append("comment", values.comment);
      }

      if (file) {
        formData.append("file", file);
      }

      if (mode === "edit" && removeExistingFile) {
        formData.append("remove_file", "true");
      }

      if (mode === "create") {
        await createMutation.mutateAsync(formData, {
          onSuccess: () => {
            message.success("Договор успешно создан");
            queryClient.invalidateQueries({ queryKey: ["contracts"] });
            onSuccess();
            form.resetFields();
            setFile(null);
          },
          onError: (error) => {
            message.error(`Ошибка при создании договора: ${error.message}`);
          },
        });
      } else {
        await updateMutation.mutateAsync(formData, {
          onSuccess: () => {
            message.success("Договор успешно обновлен");
            queryClient.invalidateQueries({ queryKey: ["contracts"] });
            onSuccess();
          },
          onError: (error) => {
            message.error(`Ошибка при обновлении договора: ${error.message}`);
          },
        });
      }
    } catch (error) {
      // console.error("Ошибка валидации:", error);
    }
  };

  const {
    data: ContractStatusesResponse,
    isLoading: isLoadingContractStatuses,
  } = useQuery<IContractStatusesResponse>({
    queryKey: ["contractStatuses"],
    queryFn: fetchContractStatuses,
  });

  const statusOptions = useMemo(() => {
    if (!ContractStatusesResponse?.contract_statuses) return [];
    return ContractStatusesResponse.contract_statuses.map((status) => ({
      value: status.contract_status_id,
      label: status.status_name,
    }));
  }, [ContractStatusesResponse]);

  const getFileExtra = () => {
    if (
      mode === "edit" &&
      !file &&
      !removeExistingFile &&
      contractData?.s3_key
    ) {
      return (
        <div>
          Текущий файл: {contractData?.s3_key?.split("/").pop() || "Нет файла"}
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => setRemoveExistingFile(true)}
            style={{ marginLeft: 8 }}
          >
            Удалить
          </Button>
        </div>
      );
    }
    return null;
  };

  const getTitle = () => {
    return mode === "create"
      ? "Создание нового договора"
      : "Редактировать договор";
  };

  return (
    <Modal
      title={getTitle()}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Сохранить"
      cancelText="Отмена"
      confirmLoading={
        mode === "create" ? createMutation.isPending : updateMutation.isPending
      }
      width={700}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="contract_name"
          label="Название договора"
          rules={[
            { required: true, message: "Пожалуйста, введите название" },
            { min: 3, message: "Минимум 3 символа" },
          ]}
        >
          <Input placeholder="Введите название" />
        </Form.Item>

        <Form.Item
          name="contract_date"
          label="Дата"
          rules={[
            {
              required: true,
              message: "Пожалуйста, выберите дату",
            },
          ]}
        >
          <DatePicker style={{ width: "100%" }} format="DD.MM.YYYY" />
        </Form.Item>

        {isSuperadmin && (
          <Form.Item
            name="company"
            label="Компания"
            rules={[
              { required: true, message: "Пожалуйста, выберите компанию" },
            ]}
          >
            <Select
              showSearch
              optionFilterProp="children"
              placeholder="Выберите компанию"
            >
              {companiesData.map((company) => (
                <Select.Option
                  key={company.company_id}
                  value={company.company_id}
                >
                  {company.company_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          name="buyer"
          label="Заказчик"
          rules={[{ required: true, message: "Это поле не может быть пустым" }]}
        >
          <Select
            showSearch
            optionFilterProp="children"
            placeholder="Выберите заказчика"
          >
            {buyersData.map((entity) => (
              <Select.Option
                key={entity.legal_entity_id}
                value={entity.legal_entity_id}
              >
                {entity.legal_entity_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="seller"
          label="Исполнитель"
          rules={[{ required: true, message: "Это поле не может быть пустым" }]}
        >
          <Select
            showSearch
            optionFilterProp="children"
            placeholder="Выберите исполнителя"
          >
            {sellersData.map((entity) => (
              <Select.Option
                key={entity.legal_entity_id}
                value={entity.legal_entity_id}
              >
                {entity.legal_entity_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Статус"
          rules={[{ required: true, message: "Пожалуйста, выберите статус" }]}
        >
          <Select
            placeholder="Выберите статус"
            loading={isLoadingContractStatuses}
            options={statusOptions}
          />
        </Form.Item>

        <Form.Item label="Файл" extra={getFileExtra()}>
          <Upload
            beforeUpload={beforeUpload}
            maxCount={1}
            accept=".doc,.docx,.xls,.xlsx,.pdf"
            fileList={file ? [file] : []}
            onRemove={handleRemoveFile}
          >
            <Button icon={<UploadOutlined />}>
              {mode === "create" ? "Выберите файл" : "Выберите новый файл"}
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item name="comment" label="Комментарий">
          <Input.TextArea placeholder="Введите коментарий (необязательно)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
