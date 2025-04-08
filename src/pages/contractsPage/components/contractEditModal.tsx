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
import { UploadOutlined } from "@ant-design/icons";
import { useContractMutations } from "../../../hooks/contracts/useContractMutation";
import { RcFile } from "antd/es/upload";
import { IContract } from "../../../api/contractsApi";
import { useQuery } from "@tanstack/react-query";
import { IContractStatusesResponse } from "../../../api/homeApi";
import { fetchContractStatuses } from "../../../api/homeApi";
import dayjs from "dayjs";

interface ContractEditModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  contractData: IContract;
  entitiesData: { legal_entity_id: string; legal_entity_name: string }[];
}

export const ContractEditModal: React.FC<ContractEditModalProps> = ({
  open,
  onCancel,
  onSuccess,
  contractData,
  entitiesData,
}) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState<RcFile | null>(null);
  const [isDateValid, setIsDateValid] = useState(true);
  const { updateMutation } = useContractMutations(
    contractData.contract_id,
    contractData.contract_name,
    contractData.contract_date,
    contractData.buyer,
    contractData.seller,
    contractData.file || "",
    contractData.comment || "",
    contractData.status
  );

  useEffect(() => {
    if (open && contractData) {
      form.setFieldsValue({
        contract_name: contractData.contract_name,
        contract_date: contractData.contract_date
          ? dayjs.unix(contractData.contract_date)
          : null,
        buyer: contractData.buyer,
        seller: contractData.seller,
        comment: contractData.comment,
        status: contractData.status,
      });
      setFile(null);
      setIsDateValid(true);
    }
  }, [open, contractData, form]);

  const beforeUpload = (file: RcFile) => {
    setFile(file);
    return false;
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setIsDateValid(!date || date.isValid());
  };

  const handleSubmit = async () => {
    try {
      if (!isDateValid) {
        throw new Error("Неверная дата");
      }

      const values = await form.validateFields();

      // Преобразуем dayjs объект в timestamp (в секундах)
      const contractDateTimestamp = values.contract_date
        ? Math.floor(values.contract_date.valueOf()) // Конвертируем миллисекунды в секунды
        : null;

      const formData = new FormData();
      formData.append("contract_name", values.contract_name);

      if (contractDateTimestamp !== null) {
        formData.append("contract_date", contractDateTimestamp.toString());
      } else {
        throw new Error("Дата контракта обязательна");
      }

      formData.append("buyer", values.buyer);
      formData.append("seller", values.seller);

      if (values.comment) {
        formData.append("comment", values.comment);
      }

      if (file) {
        formData.append("file", file);
      }
      formData.append("status", values.status);

      await updateMutation.mutateAsync(formData, {
        onSuccess: () => {
          message.success("Контракт успешно обновлен");
          onSuccess();
        },
        onError: (error) => {
          message.error(`Ошибка при обновлении контракта: ${error.message}`);
        },
      });
    } catch (error) {
      console.error("Ошибка валидации:", error);
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
      title="Редактировать контракт"
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Сохранить"
      cancelText="Отмена"
      confirmLoading={updateMutation.isPending}
      width={700}
      destroyOnClose
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
          rules={[
            {
              required: true,
              message: "Пожалуйста, выберите дату",
            },
            () => ({
              validator(_, value) {
                if (!value || value.isValid()) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Неверная дата"));
              },
            }),
          ]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="DD.MM.YYYY"
            onChange={handleDateChange}
            disabledDate={(current) =>
              current && current > dayjs().endOf("day")
            }
          />
        </Form.Item>

        <Form.Item
          name="buyer"
          label="Заказчик"
          rules={[{ required: true, message: "Это поле не может быть пустым" }]}
        >
          <Select>
            {entitiesData.map((legal_entity) => (
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
            {entitiesData.map((legal_entity) => (
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

        <Form.Item
          label="Файл"
          extra={
            !file &&
            "Текущий файл: " +
              (contractData.s3_key?.split("/").pop() || "Нет файла")
          }
        >
          <Upload
            beforeUpload={beforeUpload}
            maxCount={1}
            accept=".doc,.docx,.xls,.xlsx,.pdf"
            fileList={file ? [file] : []}
          >
            <Button icon={<UploadOutlined />}>Выберите новый файл</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};
