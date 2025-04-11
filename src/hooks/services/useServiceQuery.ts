import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  fetchServices,
  fetchServiceDetails,
  IService,
} from "../../api/servicesApi";
import { servicesSelector } from "../../redux/slices/servicesSlice";

interface useServiceQueryResponse {
  total: number;
  services: IService[];
}

export const useServiceQuery = () => {
  const { page, page_size } = useSelector(servicesSelector);

  return useQuery<useServiceQueryResponse>({
    queryKey: ["services", page, page_size],
    queryFn: () => fetchServices(page, page_size),
  });
};

export const useServiceDetailsQuery = (service_id: string) => {
  return useQuery({
    queryKey: ["serviceDetails", service_id],
    queryFn: () => fetchServiceDetails(service_id),
    retry: false,
  });
};
