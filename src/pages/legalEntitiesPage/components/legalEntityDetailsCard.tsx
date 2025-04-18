import React from "react";
import { Descriptions } from "antd";
import { Link } from "react-router-dom";
import { ExportOutlined } from "@ant-design/icons";
import { ILegalEntity } from "../../../api/legalEntitiesApi";

interface LegalEntityDetailsCardProps {
  legal_entity: ILegalEntity;
  companiesData?: {
    company_id: string;
    company_name: string;
  }[];
  legalEntityTypes?: {
    legal_entity_type_id: string;
    entity_name: string;
  }[];
}
export const LegalEntityDetailsCard: React.FC<LegalEntityDetailsCardProps> = ({
  legal_entity,
  companiesData = [],
  legalEntityTypes = [],
}) => {
  const getCompanyName = (companyId: string): string => {
    const company = companiesData.find((c) => c.company_id === companyId);
    return company ? company.company_name : companyId;
  };

  const getEntityTypeName = (typeId: string): string => {
    const type = legalEntityTypes.find(
      (t) => t.legal_entity_type_id === typeId
    );
    return type ? type.entity_name : typeId;
  };

  return (
    <Descriptions bordered column={1}>
      <Descriptions.Item
        label="Имя юридического лица"
        style={{ lineHeight: "0.7" }}
      >
        {legal_entity.legal_entity_name}{" "}
        <span style={{ color: "#888", fontSize: "0.9em" }}>
          ({getEntityTypeName(legal_entity.entity_type)})
        </span>
      </Descriptions.Item>
      <Descriptions.Item label="ИНН" style={{ lineHeight: "0.7" }}>
        {legal_entity.inn}
      </Descriptions.Item>
      <Descriptions.Item label="КПП" style={{ lineHeight: "0.7" }}>
        {legal_entity.kpp}
      </Descriptions.Item>
      <Descriptions.Item label="Ставка НДС" style={{ lineHeight: "0.7" }}>
        {legal_entity.vat_rate}
      </Descriptions.Item>
      <Descriptions.Item label="Адрес" style={{ lineHeight: "0.7" }}>
        {legal_entity.address}
      </Descriptions.Item>
      <Descriptions.Item label="Компания" style={{ lineHeight: "0.7" }}>
        {getCompanyName(legal_entity.company)}
        {"  "}
        {legal_entity.company && (
          <Link to={`/companies/${legal_entity.company}`}>
            <ExportOutlined />
          </Link>
        )}
      </Descriptions.Item>
      <Descriptions.Item
        label="Подписавшая сторона"
        style={{ lineHeight: "0.7" }}
      >
        {legal_entity.signer}
      </Descriptions.Item>
      <Descriptions.Item label="Описание" style={{ lineHeight: "0.7" }}>
        {legal_entity.description || "—"}
      </Descriptions.Item>
    </Descriptions>
  );
};
