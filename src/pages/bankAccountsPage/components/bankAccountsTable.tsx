import { Table, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { IBankAccount } from "../../../api/bankAccountsApi";
import { getBankAccountsTableColumns } from "./bankAccountsTableColumns";
import { useSelector, useDispatch } from "react-redux";
import {
  bankAccountsSelector,
  setPage,
  setPageSize,
  setAccountNumber,
  setLegalEntity,
  setBankName,
} from "../../../redux/slices/bankAccountsSlice";

interface BankAccountsTableProps {
  data: {
    total: number;
    bank_accounts: IBankAccount[];
  };
  loading: boolean;
  legalEntitiesData?: {
    legal_entity_id: string;
    legal_entity_name: string;
  }[];
}

export const BankAccountsTable: React.FC<BankAccountsTableProps> = ({
  data = { total: 0, bank_accounts: [] },
  loading,
  legalEntitiesData = [],
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { account_number, legal_entity, bank_name, page, page_size } =
    useSelector(bankAccountsSelector);

  const columns = getBankAccountsTableColumns({
    legalEntitiesData,
    navigate,
    accountNumber: account_number,
    legalEntity: legal_entity,
    bankName: bank_name,
    onAccountNumberChange: (value) => dispatch(setAccountNumber(value)),
    onLegalEntityChange: (value) => dispatch(setLegalEntity(value)),
    onBankNameChange: (value) => dispatch(setBankName(value)),
  });

  // Клиентская фильтрация
  const filteredData = data.bank_accounts.filter((account) => {
    const matchesAccountNumber = account_number
      ? account.account_number
          .toLowerCase()
          .includes(account_number.toLowerCase())
      : true;
    const matchesLegalEntity = legal_entity
      ? account.legal_entity === legal_entity
      : true;
    const matchesBankName = bank_name
      ? account.bank_name.toLowerCase().includes(bank_name.toLowerCase())
      : true;
    return matchesAccountNumber && matchesLegalEntity && matchesBankName;
  });

  // Клиентская пагинация
  const startIndex = (page - 1) * page_size;
  const paginatedData = filteredData.slice(startIndex, startIndex + page_size);
  const showPagination = filteredData.length > page_size;

  return (
    <div>
      <Table
        columns={columns}
        dataSource={paginatedData}
        rowKey="bank_account_id"
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
