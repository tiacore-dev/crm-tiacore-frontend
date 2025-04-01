import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { useNavigate } from "react-router-dom";
import { Button, Spin } from "antd";
// import { useContractQuery } from "../../hooks/contracts/useContractQuery";

export const ContractsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { data: contracts_data, isLoading, isError } = useContractQuery();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Контаркты", to: "/contracts" },
      ])
    );
  }, [dispatch]);

  return (
    <div>
      {/* {isLoading ? ( */}
      {/* // <Spin size="large" className="center-spin" /> */}
      {/* // ) : ( */}
      <>
        {/* {!isError && ( */}
        {/* // <div className="main-container"> */}
        {/* <Button */}
        {/* // onClick={handleCreateClick} */}
        {/* // style={{ marginBottom: 16 }} */}
        {/* // > */}
        {/* Создать новую услугу */}
        {/* </Button> */}
        {/* <ServicesTable
                  services={services_data?.services}
                  onRowClick={handleRowClick}
                  onSortChange={handleSortChange}
                /> */}

        {/* </div>
              // {isCreating && ( */}
        {/* //   // <ServiceCreateModal */}
        {/* //   //   newServiceName={newServiceName}
              //   //   setNewServiceName={setNewServiceName}
              //   //   onCreate={handleCreateService}
              //   //   onCancel={handleCancelCreate}
              //   //   isCreatingLoading={createMutation.isPending}
              //   // />
              // )}
          // )} */}
        {/* {isError && <BackButton />} */}
      </>
      {/* )} */}
    </div>
  );
};
