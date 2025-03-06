import axios from "axios";

const refreshToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    return null; // Если refresh_token отсутствует, выходим
  }

  try {
    const url = process.env.REACT_APP_API_URL;
    const response = await axios.post<{ access_token: string }>(
      `${url}/api/auth/refresh`,
      { refresh_token: refreshToken }
    );

    // Сохраняем новый access_token в localStorage
    localStorage.setItem("access_token", response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error("Ошибка при обновлении токена:", error);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return null;
  }
};

export default refreshToken;
