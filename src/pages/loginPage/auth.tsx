import axios from "axios";

export const refreshToken = async (): Promise<string | null> => {
  const r_token = localStorage.getItem("refresh_token");
  if (!r_token) {
    return null;
  }

  try {
    const url = process.env.REACT_APP_API_URL;
    const response = await axios.post<{
      access_token: string;
      refresh_token: string;
      permissions?: Record<string, string[]>;
      is_superadmin?: boolean;
    }>(`${url}/api/auth/refresh`, { refresh_token: r_token });

    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("refresh_token", response.data.refresh_token);

    if (response.data.permissions) {
      localStorage.setItem(
        "permissions",
        JSON.stringify(response.data.permissions)
      );
    }
    if (response.data.is_superadmin !== undefined) {
      localStorage.setItem(
        "is_superadmin",
        response.data.is_superadmin.toString()
      );
    }

    return response.data.access_token;
  } catch (error) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("permissions");
    localStorage.removeItem("is_superadmin");
    localStorage.removeItem("selectedCompanyId");
    return null;
  }
};
