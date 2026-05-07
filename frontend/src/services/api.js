const API_BASE_URL = "http://localhost:5000/api";

export const getAllRFQs = async () => {
  const response = await fetch(`${API_BASE_URL}/rfq`);
  const data = await response.json();
  return data;
};

export const createRFQ = async (formData) => {
  const response = await fetch(
    `${API_BASE_URL}/rfq`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );
  const data = await response.json();
  return data;
};