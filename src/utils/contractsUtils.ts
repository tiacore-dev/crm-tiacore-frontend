export const createContractsMap = (
  contracts: Array<{ contract_id: string; contract_name: string }>
): Map<string, string> => {
  const map = new Map<string, string>();
  contracts.forEach((contract) => {
    map.set(contract.contract_id, contract.contract_name);
  });
  return map;
};
