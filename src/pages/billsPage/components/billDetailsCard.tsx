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
  getBankNumberById: (id: string | undefined) => string | undefined;
}

export const BillDetailsCard: React.FC<BillDetailsCardProps> = ({
  bill,
  getEntityNameById,
  getContractNameById,
  getBankNameById,
  getBankNumberById,
}) => {
  return (
    <Descriptions bordered column={1}>
      <Descriptions.Item label="Банковский счёт">
        {getBankNumberById(bill.bank_account)}
        <span
          style={{ color: "#9f9f9f", fontSize: "0.95em", marginLeft: "8px" }}
        >
          ({getBankNameById(bill.bank_account)}){" "}
        </span>
        {bill.bank_account && (
          <Link to={`/bank_accounts/${bill.bank_account}`}>
            <ExportOutlined />
          </Link>
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Номер">{bill.bill_number}</Descriptions.Item>
      <Descriptions.Item label="Дата">
        {dayjs(bill.bill_date).format("DD.MM.YYYY")}
      </Descriptions.Item>
      <Descriptions.Item label="Договор">
        {getContractNameById(bill.contract)}
        {"  "}
        {bill.contract && (
          <Link to={`/contracts/${bill.contract}`}>
            <ExportOutlined />
          </Link>
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Заказчик">
        {getEntityNameById(bill.buyer)}
        {"  "}
        {bill.buyer && (
          <Link to={`/legal_entities/${bill.buyer}`}>
            <ExportOutlined />
          </Link>
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Исполнитель">
        {getEntityNameById(bill.seller)}
        {"  "}
        {bill.seller && (
          <Link to={`/legal_entities/${bill.seller}`}>
            <ExportOutlined />
          </Link>
        )}
      </Descriptions.Item>
    </Descriptions>
  );
};
