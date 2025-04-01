import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { BackButton } from "../../components/backButton";
import { Button, Spin } from "antd";
import { useLegalEntityQuery } from "../../hooks/legalEntities/useLegalEntityQuery";
import { LegalEntitiesTable } from "./components/legalEntitiesTable";
import { useNavigate } from "react-router-dom";
import { useLegalEntityMutations } from "../../hooks/legalEntities/useLegalEntityMutation";
import { LegalEntityCreateModal } from "./components/legalEntityCreateModal";
// import { useFilteredUsers } from "../../hooks/users/useFilteredUsers"; // Импортируем хук для фильтрации
import { useQuery } from "@tanstack/react-query";
import { fetchCompanies } from "../../api/companiesApi";

import {
  legalEntitiesSelector,
  legalEntitiesSlice,
  setPage,
  setPageSize,
  setSearchCompany,
  setSearchEntityType,
} from "../../redux/slices/legalEntitiesSlice";

export const LegalEntitiesPage: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [newLegalEntityName, setNewLegalEntityName] = useState("");
  const [newINN, setNewINN] = useState("");
  const [newKPP, setNewKPP] = useState("");
  const [newVatRate, setNewVatRate] = useState<number>(0);
  const [newAddress, setNewAddress] = useState("");
  const [newEntityType, setNewEntityType] = useState("");
  const [newSigner, setNewSigner] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const { createMutation } = useLegalEntityMutations();

  const { currentPage, pageSize, searchCompany, searchEntityType } =
    useSelector(legalEntitiesSelector);

  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const { data: companiesResponse } = useQuery({
    queryKey: ["companiesForSelection"],
    queryFn: () => fetchCompanies({ page: 1, page_size: 100 }),
  });

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Юридические лица", to: "/legal_entities" },
      ])
    );
  }, [dispatch]);

  const {
    data: legal_entities_data,
    isLoading,
    isError,
  } = useLegalEntityQuery();

  const handleCreateClick = useCallback(() => {
    setIsCreating(true);
  }, []);

  const handleCreateLegalEntity = useCallback(() => {
    createMutation.mutate(
      {
        legal_entity_name: newLegalEntityName,
        inn: newINN,
        kpp: newKPP,
        vat_rate: newVatRate,
        address: newAddress,
        entity_type: newEntityType,
        signer: newSigner,
        company: newCompany,
        description: newDescription,
      },
      {
        onSuccess: (data) => {
          setIsCreating(false);
          setNewLegalEntityName("");
          setNewINN("");
          setNewKPP("");
          setNewVatRate(0);
          setNewAddress("");
          setNewEntityType("");
          setNewSigner("");
          setNewCompany("");
          setNewDescription("");
        },
      }
    );
  }, [
    newLegalEntityName,
    newINN,
    newKPP,
    newVatRate,
    newAddress,
    newEntityType,
    newSigner,
    newCompany,
    newDescription,
    createMutation,
  ]);

  const handleCancelCreate = useCallback(() => {
    setIsCreating(false);
  }, []);

  return (
    <div>
      {isLoading ? (
        <Spin size="large" className="center-spin" />
      ) : (
        <>
          {!isError && (
            <div>
              <div className="main-container">
                <Button
                  onClick={handleCreateClick}
                  style={{ marginBottom: 16 }}
                >
                  Добавить юр. лицо
                </Button>

                <LegalEntitiesTable
                  data={legal_entities_data || { total: 0, entities: [] }}
                  loading={isLoading}
                  companiesData={companiesResponse?.companies || []} // Добавьте эту строку
                />
              </div>
              {isCreating && (
                <LegalEntityCreateModal
                  newLegalEntityName={newLegalEntityName}
                  newINN={newINN}
                  newKPP={newKPP}
                  newVatRate={newVatRate}
                  newAddress={newAddress}
                  newEntityType={newEntityType}
                  newSigner={newSigner}
                  newCompany={newCompany}
                  newDescription={newDescription}
                  setNewLegalEntityName={setNewLegalEntityName}
                  setNewINN={setNewINN}
                  setNewKPP={setNewKPP}
                  setNewVatRate={setNewVatRate}
                  setNewAddress={setNewAddress}
                  setNewEntityType={setNewEntityType}
                  setNewSigner={setNewSigner}
                  setNewCompany={setNewCompany}
                  setNewDescription={setNewDescription}
                  onCreate={handleCreateLegalEntity}
                  onCancel={handleCancelCreate}
                  isCreatingLoading={createMutation.isPending}
                />
              )}
            </div>
          )}
          {isError && <BackButton />}
        </>
      )}
    </div>
  );
};
