import axios from "axios";

const refreshToken = async (): Promise<string | null> => {
  const r_token = localStorage.getItem("refresh_token");
  if (!r_token) {
    return null; // Если refresh_token отсутствует, выходим
  }

  try {
    console.log(r_token);
    const url = process.env.REACT_APP_API_URL;
    const response = await axios.post<{
      access_token: string;
      refresh_token: string;
    }>(`${url}/api/auth/refresh`, { refresh_token: r_token });

    // const response = await axiosInstance.post<AuthResponse>(
    //   `${url}/api/auth/token`,
    //   data
    // );

    console.log("response", response);
    // Сохраняем новый access_token в localStorage
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("refresh_token", response.data.refresh_token);

    return response.data.access_token;
  } catch (error) {
    console.error("Ошибка при обновлении токена:", error);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return null;
  }
};

export default refreshToken;
