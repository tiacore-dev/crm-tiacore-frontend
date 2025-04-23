import React from "react";
import { Descriptions } from "antd";
import { ILegalEntity } from "../../../api/legalEntitiesApi";
import "../../../components/cards.css";
interface LegalEntityDetailsCardProps {
  legal_entity: ILegalEntity;
  legalEntityTypes?: {
    legal_entity_type_id: string;
    entity_name: string;
  }[];
}
export const LegalEntityDetailsCard: React.FC<LegalEntityDetailsCardProps> = ({
  legal_entity,
  legalEntityTypes = [],
}) => {
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
      <Descriptions.Item label="Подписавшая сторона">
        {legal_entity.signer}
      </Descriptions.Item>
    </Descriptions>
  );
};
