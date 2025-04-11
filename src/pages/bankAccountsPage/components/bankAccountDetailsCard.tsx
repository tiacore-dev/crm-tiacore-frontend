import React from "react";
import { Descriptions } from "antd";
import { Link } from "react-router-dom";
import { ExportOutlined } from "@ant-design/icons";
import { IBankAccount } from "../../../api/bankAccountsApi";

interface BankAccountDetailsDescriptionsProps {
  bank_account: IBankAccount;
  getEntityNameById: (id: string | undefined) => string | undefined;
}

export const BankAccountDetailsDescriptions: React.FC<
  BankAccountDetailsDescriptionsProps
> = ({ bank_account, getEntityNameById }) => {
  return (
    <Descriptions bordered column={1}>
      <Descriptions.Item label="Номер">
        {bank_account.account_number}
      </Descriptions.Item>
      <Descriptions.Item label="Банк">
        {bank_account.bank_name}
      </Descriptions.Item>
      <Descriptions.Item label="Юр. лицо">
        {bank_account.legal_entity && (
          <Link to={`/legal_entities/${bank_account.legal_entity}`}>
            <ExportOutlined />
          </Link>
        )}
        {"  "}
        {getEntityNameById(bank_account.legal_entity)}
      </Descriptions.Item>
      <Descriptions.Item label="БИК">{bank_account.bank_bic}</Descriptions.Item>
      <Descriptions.Item label="Корреспондентский счет">
        {bank_account.bank_corr_account}
      </Descriptions.Item>
    </Descriptions>
  );
};
