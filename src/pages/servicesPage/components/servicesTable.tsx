import { Table, Typography, Dropdown, Button, Space } from "antd";
import { IService } from "../../../api/servicesApi";
import { useDispatch, useSelector } from "react-redux";
import { setPage, setPageSize } from "../../../redux/slices/servicesSlice";
import type { ColumnsType } from "antd/es/table";
import { MoreOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import { ConfirmDeleteModal } from "../../../components/modals/confirmDeleteModal";
import { useServiceMutations } from "../../../hooks/services/useServiceMutations";
import { ServiceCreateModal } from "./serviceFormModal";
import { RootState } from "../../../redux/store";
import { usePermissions } from "../../../context/permissionsContext"; // Добавляем импорт
import { useCompany } from "../../../context/companyContext";

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
  const { page, page_size } = useSelector((state: RootState) => state.services);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedService, setSelectedService] = useState<IService | null>(null);
  const { deleteMutation } = useServiceMutations("", "", "", () => {});
  const [editingService, setEditingService] = useState<IService | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { currentAppPermissions } = useCompany();
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";

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

  const getMenuItems = (service: IService) => {
    const items = [];

    // Добавляем пункт "Редактировать" только если есть права
    if (isSuperadmin || currentAppPermissions.includes("edit_service")) {
      items.push({
        key: "edit",
        icon: <EditOutlined />,
        label: "Редактировать (500 на пользователе)",
        onClick: () => handleEdit(service),
      });
    }

    // Добавляем пункт "Удалить" только если есть права
    if (isSuperadmin || currentAppPermissions.includes("delete_service")) {
      items.push({
        key: "delete",
        icon: <DeleteOutlined />,
        label: "Удалить",
        danger: true,
        onClick: () => handleDelete(service),
      });
    }

    return items;
  };

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
          {getMenuItems(record).length > 0 && (
            <Dropdown
              menu={{ items: getMenuItems(record) }}
              trigger={["click"]}
            >
              <Button
                type="text"
                icon={<MoreOutlined />}
                onClick={(e) => e.stopPropagation()}
              />
            </Dropdown>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
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
          hideOnSinglePage: true, // Автоматически скрывает пагинацию, если страница одна
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
