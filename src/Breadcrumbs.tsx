import { Link } from "react-router-dom";
// import "./App.css";

interface BreadcrumbsProps {
  paths: { label: string; to: string }[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ paths }) => {
  return (
    <nav aria-label="breadcrumb">
      <div className="breadcrumbs">
        {paths.map((path, index) => (
          <span key={index} className="breadcrumb-item">
            {index === paths.length - 1 ? (
              path.label
            ) : (
              <Link to={path.to}>{path.label}</Link>
            )}
            {index < paths.length - 1 && <span className="separator"> / </span>}
          </span>
        ))}
      </div>
    </nav>
  );
};

export default Breadcrumbs;
