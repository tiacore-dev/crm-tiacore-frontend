export const createLegalEntitiesMap = (
  entities: Array<{ legal_entity_id: string; short_name: string }>
): Map<string, string> => {
  const map = new Map<string, string>();
  entities.forEach((entity) => {
    map.set(entity.legal_entity_id, entity.short_name);
  });
  return map;
};
