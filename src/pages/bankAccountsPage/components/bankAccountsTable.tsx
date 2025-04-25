import { Table, Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { IBankAccount } from "../../../api/bankAccountsApi";
// import { getBankAccountsTableColumns } from "./bankAccountsTableColumns";
import { getBankAccountsTableColumnsForLegalEntity } from "./bankAccountsTableColumnsForLegalEntity";
import { useSelector, useDispatch } from "react-redux";
import {
  bankAccountsSelector,
  setPage,
  setPageSize,
  setAccountNumber,
  setLegalEntity,
  setBankName,
} from "../../../redux/slices/bankAccountsSlice";
import { RootState } from "../../../redux/store";
import { PlusOutlined } from "@ant-design/icons";

interface BankAccountsTableProps {
  data: {
    total: number;
    bank_accounts: IBankAccount[];
  };
  loading: boolean;
  legalEntitiesData: {
    legal_entity_id: string;
    legal_entity_name: string;
  };
  // legalEntityId: string;
  onCreateBankAccount?: () => void;
}

export const BankAccountsTable: React.FC<BankAccountsTableProps> = ({
  data = { total: 0, bank_accounts: [] },
  loading,
  legalEntitiesData,
  // legalEntityId,
  onCreateBankAccount,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { account_number, legal_entity, bank_name, page, page_size } =
    useSelector((state: RootState) => state.bankAccounts);

  const columns = getBankAccountsTableColumnsForLegalEntity({
    navigate,
    accountNumber: account_number,
    bankName: bank_name,
    legalEntityId: legalEntitiesData.legal_entity_id,
    onAccountNumberChange: (value) => dispatch(setAccountNumber(value)),
    onBankNameChange: (value) => dispatch(setBankName(value)),
  });
  // : getBankAccountsTableColumns({
  //     legalEntitiesData,
  //     navigate,
  //     accountNumber: account_number,
  //     legalEntity: legal_entity,
  //     bankName: bank_name,
  //     onAccountNumberChange: (value) => dispatch(setAccountNumber(value)),
  //     onLegalEntityChange: (value) => dispatch(setLegalEntity(value)),
  //     onBankNameChange: (value) => dispatch(setBankName(value)),
  //   });

  const filteredData = data.bank_accounts.filter((account) => {
    const matchesAccountNumber = account_number
      ? account.account_number
          .toLowerCase()
          .includes(account_number.toLowerCase())
      : true;
    const matchesLegalEntity = legalEntitiesData.legal_entity_id
      ? account.legal_entity === legalEntitiesData.legal_entity_id
      : legal_entity
      ? account.legal_entity === legal_entity
      : true;
    const matchesBankName = bank_name
      ? account.bank_name.toLowerCase().includes(bank_name.toLowerCase())
      : true;
    return matchesAccountNumber && matchesLegalEntity && matchesBankName;
  });

  return (
    <div>
      {!legalEntitiesData.legal_entity_id && (
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/bank_accounts/create")}
          >
            Добавить банковский счёт
          </Button>
        </div>
      )}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="bank_account_id"
        loading={loading}
        pagination={
          filteredData.length >= 10
            ? {
                current: page,
                pageSize: page_size,
                total: filteredData.length,
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
              }
            : false
        }
      />
    </div>
  );
};
