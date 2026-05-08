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

export const getRFQById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/rfq/${id}`);
  const data = await response.json();
  return data;
};

export const submitBid = async (rfqId, bidData) => {
  const response = await fetch(`${API_BASE_URL}/rfq/${rfqId}/bids`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bidData),
  });
  const data = await response.json();
  return data;
};

export const closeAuction = async (rfqId) => {
  const response = await fetch(
    `${API_BASE_URL}/rfq/${rfqId}/close`,
    {
      method: "POST",
    }
  );
  const data = await response.json();
  return data;
};