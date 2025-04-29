import { Table, Typography } from "antd";
import { ILegalEntity } from "../../../api/legalEntitiesApi";
import { useNavigate } from "react-router-dom";
import { getLegalEntitiesTableColumns } from "./legalEntitiesTableColumns";
import { useSelector, useDispatch } from "react-redux";
import {
  legalEntitiesSelector,
  setPage,
  setPageSize,
  setSearch,
  setCompany,
  setEntityType,
} from "../../../redux/slices/legalEntitiesSlice";
import { RootState } from "../../../redux/store";

interface LegalEntitiesTableProps {
  data: {
    total: number;
    entities: ILegalEntity[];
  };
  loading: boolean;
  // legalEntityTypes?: {
  //   legal_entity_type_id: string;
  //   entity_name: string;
  // }[];
  // mode="buyer"|"seller"|"all";
  isSellers: boolean;
}

export const LegalEntitiesTable: React.FC<LegalEntitiesTableProps> = ({
  data = { total: 0, entities: [] },
  loading,
  // legalEntityTypes = [],
  isSellers,
  // mode,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search, company, entity_type, page, page_size } = useSelector(
    (state: RootState) => state.legalEntities
  );

  const columns = getLegalEntitiesTableColumns({
    // legalEntityTypes,
    navigate,
    search,
    entity_type,
    onSearchChange: (value) => dispatch(setSearch(value)),
    onEntityTypeChange: (value) => dispatch(setEntityType(value)),
    isSellers,
  });

  // 1. Фильтрация данных
  const filteredData = data.entities.filter((entity) => {
    const matchesSearch = search
      ? entity.legal_entity_name.toLowerCase().includes(search.toLowerCase())
      : true;
    // const matchesEntityType = entity_type
    //   ? entity.entity_type === entity_type
    //   : true;
    return matchesSearch;
    // && matchesEntityType;
  });

  return (
    <div>
      <Table
        columns={columns}
        dataSource={filteredData} // Передаем все отфильтрованные данные
        rowKey="legal_entity_id"
        loading={loading}
        pagination={{
          current: page,
          pageSize: page_size,
          total: filteredData.length,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
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
