import React from "react";

interface ServiceDetailsProps {
  serviceName: string;
  onEdit: () => void;
}

export const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  serviceName,
  onEdit,
}) => {
  return (
    <div>
      <button onClick={onEdit}>Редактировать</button>
      <h1>Детали услуги</h1>
      <table className="details-table">
        <tbody>
          <tr>
            <td>
              <strong>Название услуги:</strong>
            </td>
            <td>{serviceName}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
