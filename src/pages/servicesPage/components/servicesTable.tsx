import { Button, Select, Input, Typography } from "antd";
import { ColumnType } from "antd/es/table";
import React from "react";
import { Table } from "antd";
import { IService } from "../../../api/servicesApi";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  servicesSelector,
  setSearch,
} from "../../../redux/slices/servicesSlice";
import { setPage, setPageSize } from "../../../redux/slices/servicesSlice";
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search, page, page_size } = useSelector(servicesSelector);

  //   const columns = getCompaniesTableColumns({
  //     navigate,
  //     search,
  //     onSearchChange: (value) => dispatch(setSearch(value)),
  //   });

  //   const filteredData = data.services.filter((service) => {
  //     const matchesService = search
  //       ? service.service_name.toLowerCase().includes(search.toLowerCase())
  //       : true;
  //     return matchesService;
  //   });

  const startIndex = (page - 1) * page_size;
  const paginatedData = data.services.slice(startIndex, startIndex + page_size);
  const showPagination = data.total > page_size;

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
        pagination={
          showPagination
            ? {
                current: page,
                pageSize: page_size,
                // total: filteredData.length,
                total: data.total,
                showSizeChanger: true,
                pageSizeOptions: ["1", "10", "20", "50", "100"],
                showTotal: (total) => (
                  <Typography.Text>Всего: {total}</Typography.Text>
                ),
                onChange: (newPage, newPageSize) => {
                  if (newPageSize !== page_size) {
                    dispatch(setPageSize(newPageSize));
                  }
                  dispatch(setPage(newPage));
                },
              }
            : false
        }
      />
    </div>
  );
};
