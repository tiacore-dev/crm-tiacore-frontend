import { Table, Typography, Dropdown, Button, Menu, Space } from "antd";
import { IBillDetail } from "../../../api/billDetailsApi";
// import { useNavigate } from "react-router-dom";
import { getServiceNameById } from "../../../utils/infoById";
import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useBillDetailMutations } from "../../../hooks/billDetails/billDetailMutation";
import { ConfirmDeleteModal } from "../../../components/modals/confirmDeleteModal";
import { BillDetailFormModal } from "./billDetailsFormModal";

interface IBillDetailsTableProps {
  data: {
    total: number;
    bill_details: IBillDetail[];
  };
  loading: boolean;
  servicesData?: {
    service_id: string;
    service_name: string;
  }[];
  billId: string;
}

export const BillDetailsTable: React.FC<IBillDetailsTableProps> = ({
  data = { total: 0, bill_details: [] },
  loading,
  servicesData = [],
  billId = "",
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedBillDetail, setSelectedBillDetail] =
    useState<IBillDetail | null>(null);
  const { deleteMutation } = useBillDetailMutations("", "", "", 0, 0, () => {});
  const [editingBillDetail, setEditingBillDetail] =
    useState<IBillDetail | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleEdit = (billDetail: IBillDetail) => {
    setEditingBillDetail(billDetail);
    setIsModalVisible(true);
  };

  const handleDelete = (billDetail: IBillDetail) => {
    setSelectedBillDetail(billDetail);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedBillDetail) {
      deleteMutation.mutate(selectedBillDetail.bill_detail_id, {
        onSuccess: () => {
          setShowDeleteConfirm(false);
        },
      });
    }
  };

  const handleAddDetail = () => {
    setEditingBillDetail(null);
    setIsModalVisible(true);
  };

  const menu = (billDetail: IBillDetail) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={() => handleEdit(billDetail)}
      >
        Редактировать
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        onClick={() => handleDelete(billDetail)}
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
      render: (serviceId: string) => (
        <div style={{ padding: "4px 8px", lineHeight: "1.7" }}>
          {getServiceNameById(serviceId, servicesData) || serviceId}
        </div>
      ),
      sorter: (a: IBillDetail, b: IBillDetail) => {
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
      sorter: (a: IBillDetail, b: IBillDetail) => a.summ - b.summ,
    },
    {
      title: "",
      key: "actions",
      width: 100,
      render: (record: IBillDetail) => (
        <Dropdown overlay={menu(record)} trigger={["click"]}>
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
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Typography.Title level={4} style={{ margin: 0 }}>
          Детали счета
        </Typography.Title>
        <Button
          type="primary"
          onClick={handleAddDetail}
          icon={<PlusOutlined />}
        >
          Добавить
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data.bill_details}
        rowKey="bill_detail_id"
        loading={loading}
        pagination={false}
        style={{ margin: 0 }}
        className="custom-table"
        bordered={false}
        showHeader={true}
      />{" "}
      <BillDetailFormModal
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingBillDetail(null);
        }}
        billId={billId}
        mode={editingBillDetail ? "edit" : "create"}
        initialData={editingBillDetail}
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
