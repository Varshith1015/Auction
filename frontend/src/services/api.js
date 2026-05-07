const API_BASE_URL = "http://localhost:5000/api";

export const getAllRFQs = async () => {
  const response = await fetch(`${API_BASE_URL}/rfq`);
  const data = await response.json();
  return data;
};