import { Table, Typography, Dropdown, Button } from "antd";
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
import { usePermissions } from "../../../context/permissionsContext";
import { useCompany } from "../../../context/companyContext";

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
  const { deleteMutation } = useBillDetailMutations(
    "",
    "",
    "",
    0,
    0,
    0,
    () => {}
  );
  const [editingBillDetail, setEditingBillDetail] = useState<
    IBillDetail | undefined
  >(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { currentAppPermissions } = useCompany();

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
    setEditingBillDetail(undefined);
    setIsModalVisible(true);
  };

  const getMenuItems = (billDetail: IBillDetail) => {
    const items = [];

    if (currentAppPermissions.includes("edit_bill_detail")) {
      items.push({
        key: "edit",
        icon: <EditOutlined />,
        label: "Редактировать",
        onClick: () => handleEdit(billDetail),
      });
    }

    if (currentAppPermissions.includes("delete_bill_detail")) {
      items.push({
        key: "delete",
        icon: <DeleteOutlined />,
        label: "Удалить",
        danger: true,
        onClick: () => handleDelete(billDetail),
      });
    }

    return items;
  };

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
      title: "Цена",
      dataIndex: "price",
      key: "price",
      render: (value: number) => (
        <div style={{ padding: "4px 8px", lineHeight: "1.7" }}>
          {`${value.toLocaleString()} ₽`}
        </div>
      ),
      sorter: (a: IBillDetail, b: IBillDetail) => a.price - b.price,
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
      width: 48,
      render: (record: IBillDetail) => {
        const menuItems = getMenuItems(record);
        if (menuItems.length === 0) return null;

        return (
          <div
            style={{ display: "flex", height: "100%", alignItems: "center" }}
          >
            <Dropdown
              menu={{ items: menuItems }}
              trigger={["click"]}
              overlayStyle={{ minWidth: 120 }}
            >
              <Button
                type="text"
                size="small"
                icon={<MoreOutlined style={{ fontSize: 16 }} />}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </Dropdown>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "0 16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 16,
          marginTop: 16,
        }}
      >
        <Typography.Title level={4} style={{ margin: 0, marginRight: 16 }}>
          Детали счета
        </Typography.Title>

        {currentAppPermissions.includes("add_bill_detail") && (
          <Button onClick={handleAddDetail} icon={<PlusOutlined />}>
            Добавить
          </Button>
        )}
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
          setEditingBillDetail(undefined);
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
