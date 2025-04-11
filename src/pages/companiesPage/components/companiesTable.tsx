import { Table, Typography } from "antd";
import { ICompany } from "../../../api/companiesApi";
import { useDispatch, useSelector } from "react-redux";
import { getCompaniesTableColumns } from "./companiesTableColumns";
import {
  companiesSelector,
  setPage,
  setPageSize,
  setSearch,
} from "../../../redux/slices/companiesSlice";
import { useNavigate } from "react-router-dom";

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
  const dispatch = useDispatch();
  const { search, page, page_size } = useSelector(companiesSelector);
  const navigate = useNavigate();
  // Фильтрация данных
  const filteredData = data.companies.filter((company) => {
    if (!search) return true;
    return company.company_name.toLowerCase().includes(search.toLowerCase());
  });

  // Пагинация данных
  const paginatedData = filteredData.slice(
    (page - 1) * page_size,
    page * page_size
  );

  const columns = getCompaniesTableColumns({
    navigate, // Передаем navigate в колонки
    search,
    onSearchChange: (value) => {
      dispatch(setSearch(value));
      dispatch(setPage(1));
    },
  });

  return (
    <div>
      <Table
        columns={columns}
        dataSource={paginatedData}
        rowKey="company_id"
        loading={loading}
        pagination={{
          current: page,
          pageSize: page_size,
          total: filteredData.length, // Используем количество отфильтрованных элементов
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
