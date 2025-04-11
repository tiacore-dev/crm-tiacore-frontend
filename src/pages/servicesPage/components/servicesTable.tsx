import { Table, Typography } from "antd";
import { IService } from "../../../api/servicesApi";
import { useDispatch, useSelector } from "react-redux";
import {
  servicesSelector,
  setPage,
  setPageSize,
} from "../../../redux/slices/servicesSlice";

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

  // Вычисляем данные для текущей страницы
  const startIndex = (page - 1) * page_size;
  const paginatedData = data.services.slice(startIndex, startIndex + page_size);

  return (
    <div>
      <Table
        columns={[
          {
            title: "Услуга",
            dataIndex: "service_name",
            key: "service_name",
          },
        ]}
        dataSource={paginatedData}
        rowKey="service_id"
        loading={loading}
        pagination={{
          current: page,
          pageSize: page_size,
          total: data.services.length, // Используем общее количество услуг
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
      />
    </div>
  );
};
