import React from "react";
import { Descriptions } from "antd";
import { Link } from "react-router-dom";
import { ExportOutlined } from "@ant-design/icons";
import { IBankAccount } from "../../../api/bankAccountsApi";
import "../../../components/cards.css";

interface BankAccountDetailsDescriptionsProps {
  bank_account: IBankAccount;
  legalEntitiesData?: {
    legal_entity_id: string;
    legal_entity_name: string;
  }[];
}

export const BankAccountDetailsDescriptions: React.FC<
  BankAccountDetailsDescriptionsProps
> = ({ bank_account, legalEntitiesData }) => {
  return (
    <Descriptions bordered column={1}>
      <Descriptions.Item label="Номер">
        {bank_account.account_number}
      </Descriptions.Item>
      <Descriptions.Item label="Банк">
        {bank_account.bank_name}
      </Descriptions.Item>
      <Descriptions.Item label="Контрагент">
        {legalEntitiesData?.find(
          (entity) => entity.legal_entity_id === bank_account.legal_entity
        )?.legal_entity_name || bank_account.legal_entity}
        {"  "}
        {bank_account.legal_entity && (
          <Link to={`/legal_entities/${bank_account.legal_entity}`}>
            <ExportOutlined />
          </Link>
        )}
      </Descriptions.Item>
      <Descriptions.Item label="БИК">{bank_account.bank_bic}</Descriptions.Item>
      <Descriptions.Item label="Корреспондентский счет">
        {bank_account.bank_corr_account}
      </Descriptions.Item>
    </Descriptions>
  );
};
