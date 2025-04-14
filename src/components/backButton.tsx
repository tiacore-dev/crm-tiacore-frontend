import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button type="primary" onClick={() => navigate(-1)} style={{ margin: 16 }}>
      Вернуться назад
    </Button>
  );
};
