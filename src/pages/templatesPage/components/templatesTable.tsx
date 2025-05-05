import { Table } from "antd";
import { ITemplate } from "../../../api/templatesApi";
import { useNavigate } from "react-router-dom";
import { getTemplateColumns } from "./templatesTableColumns";
import { useSelector, useDispatch } from "react-redux";
import {
  // templatesSelector,
  setPage,
  setPageSize,
  setSearch,
  setCompany,
} from "../../../redux/slices/templatesSlice";
import { downloadTemplate } from "../../../api/templatesApi";
import { useState } from "react";
import { RootState } from "../../../redux/store";
import { usePermissions } from "../../../context/permissionsContext";

interface TemplatesTableProps {
  data: ITemplate[];
  loading: boolean;
  companiesData?: {
    company_id: string;
    company_name: string;
  }[];
}

export const TemplatesTable: React.FC<TemplatesTableProps> = ({
  data = [],
  loading,
  companiesData = [],
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { page, page_size, search, company } = useSelector(
    (state: RootState) => state.templates
  );
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { hasPermission } = usePermissions(); // Добавляем хук

  const handleDownload = async (template_id: string) => {
    setDownloadingId(template_id);
    try {
      const result = await downloadTemplate(template_id);
      if (result) {
        const link = document.createElement("a");
        link.href = result;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
    } finally {
      setDownloadingId(null);
    }
  };

  const columns = getTemplateColumns(
    companiesData,
    navigate,
    search,
    company,
    (value) => dispatch(setSearch(value)),
    (value) => dispatch(setCompany(value)),
    downloadingId,
    handleDownload,
    hasPermission
  );

  // 1. Фильтрация данных
  const filteredData = data.filter((template) => {
    const matchesSearch = search
      ? template.template_name.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesCompany = company ? template.company === company : true;
    return matchesSearch && matchesCompany;
  });

  const processedData = [...filteredData];

  // const startIndex = (page - 1) * page_size;
  // const paginatedData = processedData.slice(startIndex, startIndex + page_size);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={processedData}
        rowKey="template_id"
        loading={loading}
        scroll={{ x: true }}
        pagination={
          filteredData.length > 10
            ? {
                current: page,
                pageSize: page_size,
                total: filteredData.length,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                onChange: (newPage, newPageSize) => {
                  if (newPageSize !== page_size) {
                    dispatch(setPageSize(newPageSize));
                  }
                  dispatch(setPage(newPage));
                },
                responsive: true,
                showLessItems: true,
              }
            : false
        }
      />
    </div>
  );
};
