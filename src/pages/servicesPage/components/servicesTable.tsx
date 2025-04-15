import { Table, Typography, Dropdown, Menu, Button, Space } from "antd";
import { IService } from "../../../api/servicesApi";
import { useDispatch, useSelector } from "react-redux";
import {
  servicesSelector,
  setPage,
  setPageSize,
} from "../../../redux/slices/servicesSlice";
// import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { MoreOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import { ConfirmDeleteModal } from "../../../components/modals/confirmDeleteModal";
import { useServiceMutations } from "../../../hooks/services/useServiceMutations";
import { ServiceCreateModal } from "./serviceFormModal";
// import { useQueryClient } from "@tanstack/react-query";

interface ServicesTableProps {
  data: {
    total: number;
    services: IService[];
  };
  loading: boolean;
}

export const ServicesTable: React.FC<ServicesTableProps> = ({
  data = { total: 0, services: [] },
  loading,
}) => {
  const dispatch = useDispatch();
  const { page, page_size } = useSelector(servicesSelector);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedService, setSelectedService] = useState<IService | null>(null);
  const { deleteMutation } = useServiceMutations("", "", () => {});
  const [editingService, setEditingService] = useState<IService | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleEdit = (service: IService) => {
    setEditingService(service);
    setIsModalVisible(true);
  };

  const handleDelete = (service: IService) => {
    setSelectedService(service);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedService) {
      deleteMutation.mutate(selectedService.service_id, {
        onSuccess: () => {
          setShowDeleteConfirm(false);
        },
      });
    }
  };

  const menu = (service: IService) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={() => handleEdit(service)}
      >
        Редактировать
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        onClick={() => handleDelete(service)}
        danger
      >
        Удалить
      </Menu.Item>
    </Menu>
  );

  const columns: ColumnsType<IService> = [
    {
      title: "Услуга",
      dataIndex: "service_name",
      key: "service_name",
      sorter: (a, b) => a.service_name.localeCompare(b.service_name),
      sortDirections: ["ascend", "descend"],
      render: (text: string, record: IService) => (
        <Space
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ padding: "4px 8px", lineHeight: "1.7", flexGrow: 1 }}>
            {text}
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
    },
  ];

  return (
    <div style={{ padding: "0 16px" }}>
      <Table
        columns={columns}
        dataSource={data.services}
        rowKey="service_id"
        loading={loading}
        pagination={{
          current: page,
          pageSize: page_size,
          total: data.total,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: (total) => (
            <Typography.Text>Всего: {total}</Typography.Text>
          ),
          onChange: (newPage, newPageSize) => {
            if (newPageSize !== page_size) {
              dispatch(setPageSize(newPageSize));
            }
            dispatch(setPage(newPage));
          },
        }}
        style={{ margin: 0 }}
        className="custom-table"
        bordered={false}
        showHeader={true}
      />
      <ServiceCreateModal
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingService(null);
        }}
        mode={editingService ? "edit" : "create"}
        initialData={editingService}
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
