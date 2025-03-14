import "../../components/Table.css";

import React from "react";

export const ServiceTable: React.FC<{
  services: any[];
  onRowClick: (service_id: string) => void;
  onSortChange: (newSortBy: string) => void;
}> = ({ services, onRowClick, onSortChange }) => {
  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => onSortChange("service_name")}>Название услуги</th>
        </tr>
      </thead>
      <tbody>
        {services.map((service: any) => (
          <tr
            key={service.service_id}
            onClick={() => onRowClick(service.service_id)}
            style={{ cursor: "pointer" }}
          >
            <td>{service.service_name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
