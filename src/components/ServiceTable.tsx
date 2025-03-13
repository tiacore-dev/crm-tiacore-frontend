import "./ServiceTable.css"; // Подключаем CSS

// src/components/ServiceTable.tsx
import React from "react";
// Подключаем CSS
const ServiceTable: React.FC<{
  services: any[];
  onRowClick: (service_id: string) => void;
  onSortChange: (newSortBy: string) => void;
}> = ({ services, onRowClick, onSortChange }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th onClick={() => onSortChange("service_name")}>
              Название услуги
            </th>
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
    </div>
  );
};

export default ServiceTable;
