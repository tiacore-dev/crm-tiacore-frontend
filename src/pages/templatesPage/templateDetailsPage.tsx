import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Space, message, Spin } from "antd";
import { useTemplateDetailsQuery } from "../../hooks/templates/useTemplateQuery";
import { useTemplateMutations } from "../../hooks/templates/useTemplateMutation";
import { BackButton } from "../../components/backButton";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { useDispatch } from "react-redux";
import { downloadTemplate } from "../../api/templatesApi";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import { useCompaniesForSelection } from "../../hooks/companies/useCompanyQuery";
import { TemplateFormModal } from "./components/templateFormModal";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { TemplateDetailsCard } from "./components/templateDetailsCard";
import { GenerateTemplateButton } from "../../components/generateTemplateButton";
import { useMobileDetection } from "../../hooks/useMobileDetection";

export const TemplateDetailsPage: React.FC = () => {
  const { template_id } = useParams<{ template_id: string }>();
  const dispatch = useDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const isMobile = useMobileDetection();
  const {
    data: template,
    isLoading,
    isError,
    refetch,
  } = useTemplateDetailsQuery(template_id || "");

  const { data: companiesResponse } = useCompaniesForSelection();

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
    deleteMutation.mutate();
    setShowDeleteConfirm(false); // Можно оставить здесь или перенести в onMutate
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleDownload = async () => {
    try {
      if (!template_id) return;
      const downloadUrl = await downloadTemplate(template_id);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `template_${template_id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      // console.error("Ошибка при скачивании:", error);
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
                <div style={{ marginBottom: 16 }}>
                  {/* Первая строка - основные кнопки */}
                  <Space style={{ marginBottom: isMobile ? 16 : 0 }}>
                    <Button onClick={handleEditClick}>
                      <EditOutlined />
                      Редактировать
                    </Button>
                    <Button danger onClick={() => setShowDeleteConfirm(true)}>
                      <DeleteOutlined /> Удалить
                    </Button>
                    {!isMobile && (
                      <GenerateTemplateButton
                        templateId={template_id || ""}
                        entityType={template?.entity === "act" ? "act" : "bill"}
                      />
                    )}
                  </Space>

                  {/* Вторая строка - только для мобильных */}
                  {isMobile && (
                    <Space>
                      <GenerateTemplateButton
                        templateId={template_id || ""}
                        entityType={template?.entity === "act" ? "act" : "bill"}
                      />
                    </Space>
                  )}
                </div>
                <TemplateDetailsCard
                  template={template}
                  onDownload={handleDownload}
                />
              </div>

              {/* Модальное окно редактирования */}
              {showEditModal && (
                <TemplateFormModal
                  mode="edit"
                  visible={showEditModal}
                  onCancel={() => setShowEditModal(false)}
                  onSuccess={() => {
                    setShowEditModal(false);
                    refetch();
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
