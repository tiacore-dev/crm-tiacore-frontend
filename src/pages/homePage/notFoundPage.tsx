import React from "react";
import { Result, Button, Space, Typography } from "antd";
import { BackButton } from "../../components/buttons/backButton";

const { Text } = Typography;

export const NotFoundPage: React.FC = () => {
  return (
    <div
      style={{
        position: "relative", // Добавляем относительное позиционирование
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      {/* Кнопка "Назад" в левом верхнем углу */}
      <div
        style={{
          position: "absolute",
          top: "6px",
          left: "6px",
          zIndex: 1,
        }}
      >
        <BackButton />
      </div>

      <Result
        status="404"
        title="404"
        subTitle="Извините, данной страницы не существует. Возможно, вы ошиблись в адресе или страница была удалена."
        style={{
          maxWidth: "600px",
          width: "100%",
          borderRadius: "8px",
        }}
      />
    </div>
  );
};
