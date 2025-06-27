// src/utils/servicesUtils.ts
export const createServicesMap = (
  services: Array<{ service_id: string; service_name: string }>
): Map<string, string> => {
  const map = new Map<string, string>();
  services.forEach((service) => {
    map.set(service.service_id, service.service_name);
  });
  return map;
};
