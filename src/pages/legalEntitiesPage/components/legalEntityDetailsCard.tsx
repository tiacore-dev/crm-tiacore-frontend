import React from "react";
import { Descriptions } from "antd";
import { Link } from "react-router-dom";
import { ExportOutlined } from "@ant-design/icons";
import { ILegalEntity } from "../../../api/legalEntitiesApi";
import "../../../components/cards.css";
interface LegalEntityDetailsCardProps {
  legal_entity: ILegalEntity;
  // companiesData?: {
  //   company_id: string;
  //   company_name: string;
  // }[];
  legalEntityTypes?: {
    legal_entity_type_id: string;
    entity_name: string;
  }[];
}
export const LegalEntityDetailsCard: React.FC<LegalEntityDetailsCardProps> = ({
  legal_entity,
  // companiesData = [],
  legalEntityTypes = [],
}) => {
  // const getCompanyName = (companyId: string): string => {
  //   const company = companiesData.find((c) => c.company_id === companyId);
  //   return company ? company.company_name : companyId;
  // };

  const getEntityTypeName = (typeId: string): string => {
    const type = legalEntityTypes.find(
      (t) => t.legal_entity_type_id === typeId
    );
    return type ? type.entity_name : typeId;
  };

  return (
    <Descriptions bordered column={1}>
      <Descriptions.Item label="Имя контрагента">
        {legal_entity.legal_entity_name}{" "}
        <span style={{ color: "#888", fontSize: "0.9em" }}>
          ({getEntityTypeName(legal_entity.entity_type)})
        </span>
      </Descriptions.Item>
      <Descriptions.Item label="ИНН">{legal_entity.inn}</Descriptions.Item>
      <Descriptions.Item label="КПП">{legal_entity.kpp}</Descriptions.Item>
      <Descriptions.Item label="Ставка НДС">
        {legal_entity.vat_rate}
      </Descriptions.Item>
      <Descriptions.Item label="Адрес">
        {legal_entity.address}
      </Descriptions.Item>
      {/* <Descriptions.Item label="Компания">
        {getCompanyName(legal_entity.company)}
        {"  "}
        {legal_entity.company && (
          <Link to={`/companies/${legal_entity.company}`}>
            <ExportOutlined />
          </Link>
        )}
      </Descriptions.Item> */}
      <Descriptions.Item label="Подписавшая сторона">
        {legal_entity.signer}
      </Descriptions.Item>
      {/* <Descriptions.Item label="Описание">
        {legal_entity.description || "—"}
      </Descriptions.Item> */}
    </Descriptions>
  );
};
