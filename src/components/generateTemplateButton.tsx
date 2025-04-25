import React, { useState } from "react";
import { Button, Modal, Form, Select, Checkbox, message } from "antd";
import { generateTemplate } from "../api/templatesApi";
import { useActsQuery } from "../hooks/acts/useActsQuery";
import { useBillsQuery } from "../hooks/bills/useBillQuery";
import { useTemplateQuery } from "../hooks/templates/useTemplateQuery";
import dayjs from "dayjs";
import { FileSyncOutlined } from "@ant-design/icons";

interface GenerateTemplateButtonProps {
  templateId?: string; // Становится опциональным
  billId?: string;
  actId?: string;
  entityType: string;
}

export const GenerateTemplateButton: React.FC<GenerateTemplateButtonProps> = ({
  templateId,
  billId,
  actId,
  entityType,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isGenerating, setIsGenerating] = useState(false);

  // Запросы данных в зависимости от режима
  const { data: actsData } = useActsQuery({ page: 1, page_size: 100 });
  const { data: billsData } = useBillsQuery({ page: 1, page_size: 100 });
  const { data: templatesData } = useTemplateQuery({
    entity: entityType === "bill" ? "bill" : "act",
    page: 1,
    page_size: 100,
  });

  // Подготовка опций для Select
  const entityOptions =
    entityType === "act"
      ? actsData?.acts.map((act) => ({
          label: `Акт № ${act.act_number} от ${dayjs(act.act_date).format(
            "DD.MM.YYYY"
          )}`,
          value: act.act_id,
        })) || []
      : billsData?.bills.map((bill) => ({
          label: `Счёт № ${bill.bill_number} от ${dayjs(bill.bill_date).format(
            "DD.MM.YYYY"
          )}`,
          value: bill.bill_id,
        })) || [];

  const templateOptions =
    templatesData?.templates.map((template) => ({
      label: template.template_name,
      value: template.template_id,
    })) || [];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleGenerate = async () => {
    try {
      const values = await form.validateFields();
      setIsGenerating(true);

      // Определяем параметры в зависимости от режима
      const params = {
        templateId: templateId || values.template_id,
        entityId: billId || actId || values.entity_id,
        isPdf: values.is_pdf,
      };

      await generateTemplate(params.templateId, params.entityId, params.isPdf);
      message.success("Шаблон успешно сгенерирован");
      closeModal();
    } catch (error) {
      // console.error("Ошибка генерации шаблона:", error);
      message.error("Не удалось сгенерировать шаблон");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button
        onClick={openModal}
        icon={<FileSyncOutlined />}
        // disabled={!templateId}
      >
        Сгенерировать
      </Button>
      <Modal
        title="Сгенерировать документ"
        open={isModalOpen}
        onOk={handleGenerate}
        onCancel={closeModal}
        okText="Сгенерировать"
        confirmLoading={isGenerating}
      >
        <Form form={form} layout="vertical" initialValues={{ is_pdf: false }}>
          {/* Поле выбора шаблона (только если не передан templateId) */}
          {!templateId && (
            <Form.Item
              name="template_id"
              label="Выберите шаблон"
              rules={[{ required: true, message: "Выберите шаблон" }]}
            >
              <Select
                showSearch
                placeholder="Выберите шаблон"
                options={templateOptions}
                filterOption={(input, option) =>
                  (option?.label as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          )}

          {/* Поле выбора сущности (только если не переданы billId/actId) */}
          {!billId && !actId && (
            <Form.Item
              name="entity_id"
              label={entityType === "act" ? "Выберите акт" : "Выберите счёт"}
              rules={[{ required: true, message: "Выберите элемент" }]}
            >
              <Select
                showSearch
                placeholder={
                  entityType === "act" ? "Выберите акт" : "Выберите счёт"
                }
                options={entityOptions}
                filterOption={(input, option) =>
                  (option?.label as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          )}

          <Form.Item name="is_pdf" valuePropName="checked">
            <Checkbox>Скачать как PDF</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
