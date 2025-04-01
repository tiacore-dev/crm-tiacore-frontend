import { Table, Space, Button, Typography } from "antd";
import { ITemplate } from "../../../api/templatesApi";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useTemplateMutations } from "../../../hooks/templates/useTemplateMutation";

interface TemplatesTableProps {
  data: {
    total: number;
    templates: ITemplate[];
  };
  loading: boolean;
  companiesData?: {
    company_id: string;
    company_name: string;
  }[];
}

export const TemplatesTable: React.FC<TemplatesTableProps> = ({
  data = { total: 0, templates: [] },
  loading,
  companiesData = [],
}) => {
  //   const queryClient = useQueryClient();
  //   const navigate = useNavigate();

  //   const { deleteMutation } = useTemplateMutations("", "", "", "", "", "");

  //   const handleEdit = (templateId: string) => {
  //     navigate(`/templates/${templateId}/edit`);
  //   };

  //   const handleDelete = (templateId: string) => {
  //     deleteMutation.mutate();
  //     queryClient.invalidateQueries({ queryKey: ["templates"] });
  //   };

  const columns = [
    {
      title: "Название шаблона",
      dataIndex: "template_name",
      key: "template_name",
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
      render: (text: string) => text || "-",
    },
    {
      title: "Компания",
      dataIndex: "company",
      key: "company",
      render: (companyId: string) => {
        const company = companiesData.find((c) => c.company_id === companyId);
        return company ? company.company_name : companyId;
      },
    },
    {
      title: "Сущность",
      dataIndex: "entity",
      key: "entity",
    },
    // {
    //   title: "Действия",
    //   key: "actions",
    //   render: (_: any, record: ITemplate) => (
    //     <Space size="middle">
    //       <Button type="link" onClick={() => handleEdit(record.template_id)}>
    //         Редактировать
    //       </Button>
    //       <Button
    //         type="link"
    //         danger
    //         onClick={() => handleDelete(record.template_id)}
    //       >
    //         Удалить
    //       </Button>
    //     </Space>
    //   ),
    // },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data.templates}
        rowKey="template_id"
        loading={loading}
        pagination={{
          total: data.total,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total) => (
            <Typography.Text>Всего шаблонов: {total}</Typography.Text>
          ),
        }}
      />
    </div>
  );
};
