// customFilterStyle.tsx
import React from "react";
import { Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface CustomFilterStyleProps {
  setSelectedKeys: (keys: React.Key[]) => void;
  selectedKeys: React.Key[];
  confirm: () => void;
  clearFilters?: () => void;
}

export const CustomFilterStyle: React.FC<CustomFilterStyleProps> = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
}) => {
  return (
    <div style={{ padding: 8 }}>
      <Space>
        <Button
          onClick={() => confirm()}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Поиск
        </Button>
        <Button
          onClick={() => {
            if (clearFilters) clearFilters();
            confirm();
          }}
          size="small"
          style={{ width: 90 }}
        >
          Сбросить
        </Button>
      </Space>
    </div>
  );
};
