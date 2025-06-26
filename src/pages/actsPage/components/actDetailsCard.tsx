import React from "react";
import { Descriptions } from "antd";
import { Link } from "react-router-dom";
import { ExportOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { IAct } from "../../../api/actsApi";

interface ActDetailsDescriptionsProps {
  act: IAct;
  getEntityNameById: (id: string | undefined) => string | undefined;
  getContractNameById: (id: string | undefined) => string | undefined;
}

export const ActDetailsDescriptions: React.FC<ActDetailsDescriptionsProps> = ({
  act,
  getEntityNameById,
  getContractNameById,
}) => {
  return (
    <Descriptions bordered column={1}>
      <Descriptions.Item label="Номер">{act.act_number}</Descriptions.Item>
      <Descriptions.Item label="Дата">
        {dayjs(act.act_date).format("DD.MM.YYYY")}
      </Descriptions.Item>
      <Descriptions.Item label="Договор">
        {getContractNameById(act.contract) || "—"}
        {"  "}
        {act.contract && (
          <Link to={`/contracts/${act.contract}`}>
            <ExportOutlined />
          </Link>
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Заказчик">
        {getEntityNameById(act.buyer)}
        {"  "}
        {act.buyer && (
          <Link
            to={`/legal-entities/buyers/${act.buyer}`}
            state={{
              from: "act",
              actId: act.act_id,
              actNumber: act.act_number,
            }}
          >
            <ExportOutlined />
          </Link>
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Исполнитель">
        {getEntityNameById(act.seller)}
        {"  "}
        {act.seller && (
          <Link
            to={`/legal-entities/sellers/${act.seller}`}
            state={{
              from: "act",
              actId: act.act_id,
              actNumber: act.act_number,
            }}
          >
            <ExportOutlined />
          </Link>
        )}
      </Descriptions.Item>
    </Descriptions>
  );
};
