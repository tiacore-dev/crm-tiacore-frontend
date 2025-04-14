import React from "react";
import { Descriptions, Space } from "antd";
import { DownloadOutlined, ExportOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ITemplate } from "../../../api/templatesApi";
import { useCompaniesForSelection } from "../../../hooks/companies/useCompanyQuery";
import { getCompanyNameById } from "../../../utils/infoById";

interface TemplateDetailsCardProps {
  template: ITemplate;
  onDownload: () => void;
}

export const TemplateDetailsCard: React.FC<TemplateDetailsCardProps> = ({
  template,
  onDownload,
}) => {
  const { data: companiesResponse } = useCompaniesForSelection();

  return (
    <Descriptions bordered column={1}>
      <Descriptions.Item label="Название">
        {template.template_name}
      </Descriptions.Item>
      <Descriptions.Item label="Компания">
        {template?.company && (
          <Link to={`/companies/${template?.company}`}>
            <ExportOutlined />
          </Link>
        )}{" "}
        {getCompanyNameById(template?.company, companiesResponse?.companies) ||
          template?.company}
      </Descriptions.Item>
      <Descriptions.Item label="Тип">
        {template.entity === "act" ? "Акт" : "Счет"}
      </Descriptions.Item>
      <Descriptions.Item label="Файл">
        {template.s3_key ? (
          <Space>
            <DownloadOutlined
              onClick={onDownload}
              style={{
                color: "#1890ff",
                cursor: "pointer",
              }}
              title="Скачать"
            />
            <span>{template.s3_key.split("/").pop()}</span>
          </Space>
        ) : (
          "Файл отсутствует"
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Описание">
        {template.description || "—"}
      </Descriptions.Item>
    </Descriptions>
  );
};
