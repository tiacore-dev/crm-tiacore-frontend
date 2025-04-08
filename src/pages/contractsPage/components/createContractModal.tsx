import React, { useState, useMemo } from "react";
import { Modal, Form, Input, Select, Upload, Button, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useContractMutations } from "../../../hooks/contracts/useContractMutation";
import { RcFile } from "antd/es/upload";
import { IContractStatusesResponse } from "../../../api/homeApi";
import { fetchContractStatuses } from "../../../api/homeApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ContractCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  legalEntitiesData: { legal_entity_id: string; legal_entity_name: string }[];
}

export interface IContractStatus {
  contract_status_id: string;
  status_name: string;
}

export const ContractCreateModal: React.FC<ContractCreateModalProps> = ({
  visible,
  onCancel,
  legalEntitiesData,
}) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState<RcFile | null>(null);
  const queryClient = useQueryClient();

  const { createMutation } = useContractMutations(
    "",
    "",
    0,
    "",
    "",
    "",
    "",
    ""
  );

  const beforeUpload = (file: RcFile) => {
    setFile(file);
    return false; // Отменяем автоматическую загрузку
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("contract_name", values.contract_name);
      const timestamp = values.contract_date.valueOf(); // Используем valueOf() вместо unix()
      formData.append("contract_date", timestamp.toString());
      formData.append("buyer", values.buyer);
      formData.append("seller", values.seller);
      formData.append("status", values.status);
      if (values.comment) {
        formData.append("comment", values.comment);
      }
      if (file) {
        formData.append("file", file as RcFile);
      }

      createMutation.mutate(formData, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["contracts"] });
          onCancel();
          form.resetFields();
          setFile(null);
        },
      });
    } catch (error) {
      console.error("Validation failed:", error);
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

  return (
    <Modal
      title="Создание нового контракта"
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Сохранить"
      cancelText="Отмена"
      confirmLoading={createMutation.isPending}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="contract_name"
          label="Название контракта"
          rules={[
            { required: true, message: "Пожалуйста, введите название" },
            { min: 3, message: "Минимум 3 символа" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="contract_date"
          label="Дата"
          rules={[{ required: true, message: "Пожалуйста, выберите дату" }]}
        >
          <DatePicker style={{ width: "100%" }} format="DD.MM.YYYY" />
        </Form.Item>
        <Form.Item
          name="buyer"
          label="Заказчик"
          rules={[{ required: true, message: "Это поле не может быть пустым" }]}
        >
          <Select>
            {legalEntitiesData.map((legal_entity) => (
              <Select.Option
                key={legal_entity.legal_entity_id}
                value={legal_entity.legal_entity_id}
              >
                {legal_entity.legal_entity_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="seller"
          label="Исполнитель"
          rules={[{ required: true, message: "Это поле не может быть пустым" }]}
        >
          <Select>
            {legalEntitiesData.map((legal_entity) => (
              <Select.Option
                key={legal_entity.legal_entity_id}
                value={legal_entity.legal_entity_id}
              >
                {legal_entity.legal_entity_name}
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

        <Form.Item name="comment" label="Комментарий">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Файл">
          <Upload
            beforeUpload={beforeUpload}
            maxCount={1}
            accept=".doc,.docx,.xls,.xlsx"
          >
            <Button icon={<UploadOutlined />}>Выберите файл</Button>
            {file && <span style={{ marginLeft: 8 }}>{file.name}</span>}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};
