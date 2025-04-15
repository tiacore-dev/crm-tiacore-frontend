import { Table, Typography, Dropdown, Button, Menu, Space } from "antd";
import { IActDetail } from "../../../api/actDetailsApi";
import { useNavigate } from "react-router-dom";
import { getServiceNameById } from "../../../utils/infoById";
import { DeleteOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";

interface IActDetailsTableProps {
  data: {
    total: number;
    act_details: IActDetail[];
  };
  loading: boolean;
  servicesData?: {
    service_id: string;
    service_name: string;
  }[];
  onAddDetail?: () => void;
  onEdit?: (detail: IActDetail) => void;
  onDelete?: (detailId: string) => void;
}

export const ActDetailsTable: React.FC<IActDetailsTableProps> = ({
  data = { total: 0, act_details: [] },
  loading,
  servicesData = [],
  onAddDetail,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  const menu = (record: IActDetail) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={() => onEdit && onEdit(record)}
      >
        Редактировать
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        onClick={() => onDelete && onDelete(record.act_detail_id)}
        danger
      >
        Удалить
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Услуга",
      dataIndex: "service",
      key: "service",
      render: (serviceId: string, record: IActDetail) => (
        <Space style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ padding: "4px 8px", lineHeight: "1.7" }}>
            {getServiceNameById(serviceId, servicesData) || serviceId}
          </div>
          <Dropdown overlay={menu(record)} trigger={["click"]}>
            <Button
              type="text"
              icon={<MoreOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        </Space>
      ),
      sorter: (a: IActDetail, b: IActDetail) => {
        const nameA = getServiceNameById(a.service, servicesData) || a.service;
        const nameB = getServiceNameById(b.service, servicesData) || b.service;
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "Количество",
      dataIndex: "quantity",
      key: "quantity",
      render: (value: number) => (
        <div style={{ padding: "4px 8px", lineHeight: "1.7" }}>{value}</div>
      ),
    },
    {
      title: "Сумма",
      dataIndex: "summ",
      key: "summ",
      render: (value: number) => (
        <div style={{ padding: "4px 8px", lineHeight: "1.7" }}>
          {`${value.toLocaleString()} ₽`}
        </div>
      ),
      sorter: (a: IActDetail, b: IActDetail) => a.summ - b.summ,
    },
  ];

  return (
    <div style={{ padding: "0 16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Typography.Title level={4} style={{ margin: 0 }}>
          Детали акта
        </Typography.Title>
        <Button type="primary" onClick={onAddDetail}>
          Добавить деталь
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data.act_details}
        rowKey="act_detail_id"
        loading={loading}
        pagination={false}
        style={{ margin: 0 }}
        className="custom-table"
        bordered={false}
        showHeader={true}
      />
    </div>
  );
};
