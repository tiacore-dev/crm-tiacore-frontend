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
        {act.contract && (
          <Link to={`/contracts/${act.contract}`}>
            <ExportOutlined />
          </Link>
        )}
        {"  "}
        {getContractNameById(act.contract) || "—"}
      </Descriptions.Item>
      <Descriptions.Item label="Заказчик">
        {act.buyer && (
          <Link to={`/legal_entities/${act.buyer}`}>
            <ExportOutlined />
          </Link>
        )}
        {"  "}
        {getEntityNameById(act.buyer)}
      </Descriptions.Item>
      <Descriptions.Item label="Исполнитель">
        {act.seller && (
          <Link to={`/legal_entities/${act.seller}`}>
            <ExportOutlined />
          </Link>
        )}
        {"  "}
        {getEntityNameById(act.seller)}
      </Descriptions.Item>
    </Descriptions>
  );
};
