import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { fetchServices, fetchServiceDetails, IService } from "../../api/servicesApi";
import { servicesSelector } from "../../redux/slices/servicesSlice";

interface useServiceQueryResponse {
    services: IService[],
    total: number
}

export const useServiceQuery = () => {
    const { currentPage, pageSize, search, sortBy, order } = useSelector(servicesSelector);

    return useQuery<useServiceQueryResponse>({
        queryKey: ["services", currentPage, pageSize, search, sortBy, order],
        queryFn: () => fetchServices(search, sortBy, order, currentPage, pageSize),
      })

      
}

export const useServiceDetailsQuery = (service_id: string) => {
    return useQuery({
        queryKey: ["serviceDetails", service_id],
        queryFn: () => fetchServiceDetails(service_id),
        retry: false,
    })
}