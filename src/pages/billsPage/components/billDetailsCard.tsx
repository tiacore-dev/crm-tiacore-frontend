import React from "react";
import { Descriptions } from "antd";
import { Link } from "react-router-dom";
import { ExportOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { IBill } from "../../../api/billsApi";

interface BillDetailsCardProps {
  bill: IBill;
  getEntityNameById: (id: string | undefined) => string | undefined;
  getContractNameById: (id: string | undefined) => string | undefined;
  getBankNameById: (id: string | undefined) => string | undefined;
}

export const BillDetailsCard: React.FC<BillDetailsCardProps> = ({
  bill,
  getEntityNameById,
  getContractNameById,
  getBankNameById,
}) => {
  return (
    <Descriptions bordered column={1}>
      <Descriptions.Item label="Банковский счёт">
        {bill.bank_account && (
          <Link to={`/bank_accounts/${bill.bank_account}`}>
            <ExportOutlined />
          </Link>
        )}
        {"  "}
        {getBankNameById(bill.bank_account)}
      </Descriptions.Item>
      <Descriptions.Item label="Номер">{bill.bill_number}</Descriptions.Item>
      <Descriptions.Item label="Дата">
        {dayjs(bill.bill_date).format("DD.MM.YYYY")}
      </Descriptions.Item>
      <Descriptions.Item label="Договор">
        {bill.contract && (
          <Link to={`/contracts/${bill.contract}`}>
            <ExportOutlined />
          </Link>
        )}
        {"  "}
        {getContractNameById(bill.contract)}
      </Descriptions.Item>
      <Descriptions.Item label="Заказчик">
        {bill.buyer && (
          <Link to={`/legal_entities/${bill.buyer}`}>
            <ExportOutlined />
          </Link>
        )}
        {"  "}
        {getEntityNameById(bill.buyer)}
      </Descriptions.Item>
      <Descriptions.Item label="Исполнитель">
        {bill.seller && (
          <Link to={`/legal_entities/${bill.seller}`}>
            <ExportOutlined />
          </Link>
        )}
        {"  "}
        {getEntityNameById(bill.seller)}
      </Descriptions.Item>
    </Descriptions>
  );
};
