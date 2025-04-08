import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Descriptions, Space, message, Spin } from "antd";
import { useTemplateDetailsQuery } from "../../hooks/templates/useTemplateQuery";
import { useTemplateMutations } from "../../hooks/templates/useTemplateMutation";
import { BackButton } from "../../components/backButton";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { useDispatch } from "react-redux";
import { downloadTemplate } from "../../api/templatesApi";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import { TemplateEditModal } from "./components/templateEditModal";
import { fetchCompanies } from "../../api/companiesApi";
import { useQuery } from "@tanstack/react-query";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export const TemplateDetailsPage: React.FC = () => {
  const { template_id } = useParams<{ template_id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    data: template,
    isLoading,
    isError,
    refetch,
  } = useTemplateDetailsQuery(template_id || "");

  // Получаем список компаний для выпадающего списка
  const { data: companiesResponse } = useQuery({
    queryKey: ["companiesForSelection"],
    queryFn: () => fetchCompanies({ page: 1, page_size: 100 }),
  });

  const { deleteMutation, updateMutation } = useTemplateMutations(
    template_id || "",
    template?.template_name || "",
    template?.description || "",
    template?.company || "",
    template?.entity || "",
    template?.s3_key || ""
  );

  useEffect(() => {
    if (template) {
      dispatch(
        setBreadcrumbs([
          { label: "Главная страница", to: "/home" },
          { label: "Шаблоны", to: "/templates" },
          { label: template.template_name, to: `/templates/${template_id}` },
        ])
      );
    }
  }, [template, dispatch, template_id]);

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        navigate("/templates");
      },
    });
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleDownload = async () => {
    try {
      if (!template_id) return;
      const downloadUrl = await downloadTemplate(template_id);

      // Создаем скрытую ссылку для скачивания
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `template_${template_id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Ошибка при скачивании:", error);
      message.error("Не удалось скачать файл");
    }
  };

  return (
    <div>
      {isLoading ? (
        <Spin size="large" className="center-spin" />
      ) : (
        <>
          {!isError && template && (
            <>
              <div className="main-container">
                <Space style={{ marginBottom: 16 }}>
                  <Button onClick={handleEditClick}>
                    {" "}
                    <EditOutlined />
                    Редактировать
                  </Button>
                  <Button danger onClick={() => setShowDeleteConfirm(true)}>
                    <DeleteOutlined /> Удалить
                  </Button>
                </Space>
                <Card title={`Шаблон: ${template.template_name}`}>
                  <Descriptions bordered column={1}>
                    <Descriptions.Item label="Название">
                      {template.template_name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Описание">
                      {template.description || "Нет описания"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Компания">
                      {companiesResponse?.companies.find(
                        (c) => c.company_id === template?.company
                      )?.company_name || template?.company}
                    </Descriptions.Item>
                    <Descriptions.Item label="Тип сущности">
                      {template.entity === "act" ? "Акт" : "Счет"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Файл">
                      {template.s3_key ? (
                        <>
                          <span>{template.s3_key.split("/").pop()}</span>
                          <Button
                            type="link"
                            onClick={handleDownload}
                            style={{ marginLeft: 8 }}
                          >
                            Скачать
                          </Button>
                        </>
                      ) : (
                        "Файл отсутствует"
                      )}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </div>

              {/* Модальное окно редактирования */}
              {showEditModal && (
                <TemplateEditModal
                  visible={showEditModal}
                  onCancel={() => setShowEditModal(false)}
                  onSuccess={() => {
                    refetch();
                    setShowEditModal(false);
                  }}
                  templateData={template}
                  companiesData={companiesResponse?.companies || []}
                />
              )}

              {/* Модальное окно подтверждения удаления */}
              {showDeleteConfirm && (
                <ConfirmDeleteModal
                  onConfirm={handleDelete}
                  onCancel={() => setShowDeleteConfirm(false)}
                  isDeleteLoading={deleteMutation.isPending}
                />
              )}
            </>
          )}
          {isError && <BackButton />}
        </>
      )}
    </div>
  );
};
