import { Table, Typography, Dropdown, Button, Menu, Space } from "antd";
import { IActDetail } from "../../../api/actDetailsApi";
import { getServiceNameById } from "../../../utils/infoById";
import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useActDetailMutations } from "../../../hooks/actDetails/actDetailMutation";
import { ConfirmDeleteModal } from "../../../components/modals/confirmDeleteModal";
import { ActDetailFormModal } from "./actDetailsFormModal";

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
  actId: string;
}

export const ActDetailsTable: React.FC<IActDetailsTableProps> = ({
  data = { total: 0, act_details: [] },
  loading,
  servicesData = [],
  actId = "",
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedActDetail, setSelectedActDetail] = useState<IActDetail | null>(
    null
  );
  const { deleteMutation } = useActDetailMutations(
    "",
    "",
    "",
    0,
    0,
    0,
    () => {}
  );
  const [editingActDetail, setEditingActDetail] = useState<IActDetail | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleEdit = (actDetail: IActDetail) => {
    setEditingActDetail(actDetail);
    setIsModalVisible(true);
  };

  const handleDelete = (actDetail: IActDetail) => {
    setSelectedActDetail(actDetail);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedActDetail) {
      deleteMutation.mutate(selectedActDetail.act_detail_id, {
        onSuccess: () => {
          setShowDeleteConfirm(false);
        },
      });
    }
  };

  const handleAddDetail = () => {
    setEditingActDetail(null);
    setIsModalVisible(true);
  };

  const getMenuItems = (actDetail: IActDetail) => [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Редактировать",
      onClick: () => handleEdit(actDetail),
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Удалить",
      danger: true,
      onClick: () => handleDelete(actDetail),
    },
  ];

  const columns = [
    {
      title: "Услуга",
      dataIndex: "service",
      key: "service",
      render: (serviceId: string) => (
        <div style={{ padding: "4px 8px", lineHeight: "1.7" }}>
          {getServiceNameById(serviceId, servicesData) || serviceId}
        </div>
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
      title: "Цена",
      dataIndex: "price",
      key: "price",
      render: (value: number) => (
        <div style={{ padding: "4px 8px", lineHeight: "1.7" }}>
          {`${value.toLocaleString()} ₽`}
        </div>
      ),
      sorter: (a: IActDetail, b: IActDetail) => a.price - b.price,
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
    {
      title: "",
      key: "actions",
      width: 48,
      render: (record: IActDetail) => (
        <Dropdown menu={{ items: getMenuItems(record) }} trigger={["click"]}>
          <Button
            type="text"
            icon={<MoreOutlined />}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div style={{ padding: "0 16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Typography.Title level={4} style={{ marginRight: 16 }}>
          Детали акта
        </Typography.Title>
        <Button onClick={handleAddDetail} icon={<PlusOutlined />}>
          Добавить
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
      />{" "}
      <ActDetailFormModal
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingActDetail(null);
        }}
        actId={actId}
        mode={editingActDetail ? "edit" : "create"}
        initialData={editingActDetail}
        onSuccess={() => {
          setIsModalVisible(false);
        }}
      />
      {showDeleteConfirm && (
        <ConfirmDeleteModal
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          isDeleteLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};
