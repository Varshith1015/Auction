import { useEffect, useState } from "react";
import { getRFQById } from "../services/api";

function RFQDetailsPage({ rfqId, onBack }) {
  const [rfqDetails, setRfqDetails] = useState(null);

  useEffect(() => {
    getRFQById(rfqId).then((response) => {
      setRfqDetails(response);
    });
  }, [rfqId]);

  if (!rfqDetails) {
    return <p>Loading RFQ details...</p>;
  }

  return (
    <div>
      <button onClick={onBack}>Back to List</button>

      <h2>RFQ Details Page</h2>

      <pre>{JSON.stringify(rfqDetails, null, 2)}</pre>
    </div>
  );
}

export default RFQDetailsPage;