// src/components/Breadcrumbs.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

const Breadcrumbs: React.FC = () => {
  const breadcrumbs = useSelector(
    (state: RootState) => state.breadcrumbs.paths
  );

  return (
    <nav aria-label="breadcrumb">
      <div className="breadcrumbs">
        {breadcrumbs.map((path, index) => (
          <span key={index} className="breadcrumb-item">
            {index === breadcrumbs.length - 1 ? (
              path.label
            ) : (
              <Link to={path.to}>{path.label}</Link>
            )}
            {index < breadcrumbs.length - 1 && <span> / </span>}
          </span>
        ))}
      </div>
    </nav>
  );
};

export default Breadcrumbs;
