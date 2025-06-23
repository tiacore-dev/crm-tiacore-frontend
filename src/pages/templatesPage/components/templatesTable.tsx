import { Table } from "antd";
import { ITemplate } from "../../../api/templatesApi";
import { useNavigate } from "react-router-dom";
import { getTemplateColumns } from "./templatesTableColumns";
import { useSelector, useDispatch } from "react-redux";
import {
  setPage,
  setPageSize,
  setSearch,
  setCompany,
} from "../../../redux/slices/templatesSlice";
import { downloadTemplate } from "../../../api/templatesApi";
import { useState } from "react";
import { RootState } from "../../../redux/store";
import { useCompany } from "../../../context/companyContext";

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
  const { currentAppPermissions } = useCompany();
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";

  const handleDownload = async (template_id: string) => {
    if (!isSuperadmin && !currentAppPermissions.includes("download_template"))
      return;

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
    currentAppPermissions, // Передаем permissions вместо hasPermission,
    isSuperadmin
  );

  const filteredData = data.filter((template) => {
    const matchesSearch = search
      ? template.template_name.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesCompany = company ? template.company === company : true;
    return matchesSearch && matchesCompany;
  });

  const processedData = [...filteredData];

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
