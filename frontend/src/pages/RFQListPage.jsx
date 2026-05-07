import { useEffect, useState } from "react";
import { getAllRFQs } from "../services/api";

function RFQListPage() {
  const [rfqs, setRfqs] = useState([]);
  useEffect(() => {
    getAllRFQs().then((response) => {
      setRfqs(response.data);
    });
  }, []);
  return (
    <div>
      <h2>RFQ Listing Page</h2>
      {rfqs.map((rfq) => (
        <div key={rfq.id}>
          <h3>{rfq.rfq_name}</h3>
          <p>Reference: {rfq.reference_id}</p>
          <p>Status: {rfq.status}</p>
          <p>Lowest Bid: {rfq.current_lowest_bid ?? "No bids yet"}</p>
        </div>
      ))}
    </div>
  );
}
export default RFQListPage;