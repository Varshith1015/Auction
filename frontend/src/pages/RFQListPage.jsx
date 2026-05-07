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
        <div className="rfq-card" key={rfq.id}>
          <h3>{rfq.rfq_name}</h3>
          <p>
            <strong>Reference ID:</strong>{" "}
            {rfq.reference_id}
          </p>
          <p>
            <strong>Status:</strong> {rfq.status}
          </p>
          <p>
            <strong>Lowest Bid:</strong>{" "}
            {rfq.current_lowest_bid ?? "No bids yet"}
          </p>
          <p>
            <strong>Bid Close Time:</strong>{" "}
            {rfq.bid_close_time}
          </p>
          <p>
            <strong>Forced Close Time:</strong>{" "}
            {rfq.forced_bid_close_time}
          </p>
        </div>
      ))}
    </div>
  );
}
export default RFQListPage;