// src/utils/userUtils.ts
export const getPositionLabel = (position: string) => {
  switch (position) {
    case "admin":
      return "Администратор";
    case "manager":
      return "Менеджер";
    case "user":
      return "Пользователь";
    default:
      return position;
  }
};
