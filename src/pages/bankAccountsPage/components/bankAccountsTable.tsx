import { Table, Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { IBankAccount } from "../../../api/bankAccountsApi";
import { getBankAccountsTableColumnsForLegalEntity } from "./bankAccountsTableColumnsForLegalEntity";
import { useSelector, useDispatch } from "react-redux";
import {
  setPage,
  setPageSize,
  setAccountNumber,
  setBankName,
} from "../../../redux/slices/bankAccountsSlice";
import { RootState } from "../../../redux/store";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { ConfirmDeleteModal } from "../../../components/modals/confirmDeleteModal";
import { useBankAccountMutations } from "../../../hooks/bankAccounts/useBankAccountMutation";
import { BankAccountCreateModal } from "./bankAccountFormModal";
import { usePermissions } from "../../../context/permissionsContext";
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
  onCreateBankAccount?: () => void;
}

export const BankAccountsTable: React.FC<BankAccountsTableProps> = ({
  data = { total: 0, bank_accounts: [] },
  loading,
  legalEntitiesData,
  onCreateBankAccount,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { hasPermission } = usePermissions(); // Добавьте этот хук

  const { account_number, bank_name, page, page_size } = useSelector(
    (state: RootState) => state.bankAccounts
  );

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<IBankAccount | null>(
    null
  );
  const [editingAccount, setEditingAccount] = useState<IBankAccount | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { deleteMutation } = useBankAccountMutations(
    editingAccount?.bank_account_id || "",
    editingAccount?.legal_entity || "",
    editingAccount?.bank_name || "",
    editingAccount?.account_number || "",
    editingAccount?.bank_bic || "",
    editingAccount?.bank_corr_account || ""
  );

  const handleEdit = (account: IBankAccount) => {
    setEditingAccount(account);
    setIsModalVisible(true);
  };

  const handleDelete = (account: IBankAccount) => {
    setSelectedAccount(account);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedAccount) {
      deleteMutation.mutate(selectedAccount.bank_account_id, {
        onSuccess: () => {
          setShowDeleteConfirm(false);
        },
      });
    }
  };
  // const handleDelete = () => {
  //   deleteMutation.mutate(undefined, {
  //     onSuccess: () => {
  //       setShowDeleteConfirm(false);
  //       navigate("/bank_accounts");
  //     },
  //   });
  // };

  const columns = getBankAccountsTableColumnsForLegalEntity({
    navigate,
    accountNumber: account_number,
    bankName: bank_name,
    legalEntityId: legalEntitiesData.legal_entity_id,
    onAccountNumberChange: (value) => dispatch(setAccountNumber(value)),
    onBankNameChange: (value) => dispatch(setBankName(value)),
    onEdit: handleEdit,
    onDelete: handleDelete,
    hasPermission,
  });

  const filteredData = data.bank_accounts.filter((account) => {
    const matchesAccountNumber = account_number
      ? account.account_number
          .toLowerCase()
          .includes(account_number.toLowerCase())
      : true;
    const matchesBankName = bank_name
      ? account.bank_name.toLowerCase().includes(bank_name.toLowerCase())
      : true;
    return matchesAccountNumber && matchesBankName;
  });

  return (
    <div>
      {!legalEntitiesData.legal_entity_id &&
        hasPermission("add_bank_account") && (
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
        scroll={{ x: true }}
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

      <BankAccountCreateModal
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingAccount(null);
        }}
        legalEntitiesData={legalEntitiesData}
        onSuccess={() => {
          setIsModalVisible(false);
          setEditingAccount(null);
        }}
        mode={editingAccount ? "edit" : "create"}
        initialData={editingAccount}
      />

      {showDeleteConfirm && (
        <ConfirmDeleteModal
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          isDeleteLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};
