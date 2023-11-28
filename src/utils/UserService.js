const API = "http://192.168.1.6:1337/api";

export const register = async (data) => {
  const response = await fetch(`${API}/auth/local/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response;
};
