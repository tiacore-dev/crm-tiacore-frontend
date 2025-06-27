// src/utils/bankAccountsUtils.ts
export const createBankAccountsMap = (
  bankAccounts: Array<{
    bank_account_id: string;
    account_number: string;
    bank_name: string;
  }>
): Map<string, { account_number: string; bank_name: string }> => {
  const map = new Map<string, { account_number: string; bank_name: string }>();
  bankAccounts.forEach((account) => {
    map.set(account.bank_account_id, {
      account_number: account.account_number,
      bank_name: account.bank_name,
    });
  });
  return map;
};
