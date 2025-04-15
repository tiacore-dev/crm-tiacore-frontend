import React, { useState } from "react";
import { Button, Modal, Form, Select, Checkbox, message } from "antd";
import { generateTemplate } from "../../../api/templatesApi";
import { useActsQuery } from "../../../hooks/acts/useActsQuery";
import { useBillsQuery } from "../../../hooks/bills/useBillQuery";
import dayjs from "dayjs";
import { FileSyncOutlined } from "@ant-design/icons";
interface GenerateTemplateButtonProps {
  templateId: string;
  entityType: "act" | "bill";
}

export const GenerateTemplateButton: React.FC<GenerateTemplateButtonProps> = ({
  templateId,
  entityType,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: actsData } = useActsQuery({ page: 1, page_size: 100 });
  const { data: billsData } = useBillsQuery({ page: 1, page_size: 100 });

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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleGenerate = async () => {
    try {
      const { entity_id, is_pdf } = await form.validateFields();
      setIsGenerating(true);
      await generateTemplate(templateId, entity_id, is_pdf);
      message.success("Шаблон успешно сгенерирован");
      closeModal();
    } catch (error) {
      // Ошибка уже обработана в generateTemplate
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button onClick={openModal} icon={<FileSyncOutlined />}>
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

          <Form.Item name="is_pdf" valuePropName="checked">
            <Checkbox>Скачать как PDF</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
