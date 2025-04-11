import { Button, Select, Input, Typography } from "antd";
import { ColumnType } from "antd/es/table";
import React from "react";
import { Table } from "antd";
import { ICompany } from "../../../api/companiesApi";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getCompaniesTableColumns } from "./companiesTableColumns";
import {
  companiesSelector,
  setSearch,
} from "../../../redux/slices/companiesSlice";
import { setPage, setPageSize } from "../../../redux/slices/companiesSlice";
interface CompaniesTableProps {
  data: {
    total: number;
    companies: ICompany[];
  };
  loading: boolean;
}

export const CompaniesTable: React.FC<CompaniesTableProps> = ({
  data = { total: 0, companies: [] },
  loading,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search, page, page_size } = useSelector(companiesSelector);

  const columns = getCompaniesTableColumns({
    navigate,
    search,
    onSearchChange: (value) => dispatch(setSearch(value)),
  });

  const filteredData = data.companies.filter((company) => {
    const matchesCompany = search
      ? company.company_name.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesCompany;
  });

  const startIndex = (page - 1) * page_size;
  const paginatedData = filteredData.slice(startIndex, startIndex + page_size);
  const showPagination = filteredData.length > page_size;

  return (
    <div>
      <Table
        columns={columns}
        dataSource={paginatedData}
        rowKey="company_id"
        loading={loading}
        pagination={
          showPagination
            ? {
                current: page,
                pageSize: page_size,
                total: filteredData.length,
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
