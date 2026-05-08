import { useEffect, useState } from "react";
import { getRFQById, submitBid ,closeAuction} from "../services/api";

function RFQDetailsPage({ rfqId, onBack }) {
  const [rfqDetails, setRfqDetails] = useState(null);
  const [bidForm, setBidForm] = useState({
    supplier_name: "",
    freight_charges: "",
    origin_charges: "",
    destination_charges: "",
    transit_time: "",
    quote_validity: "",
  });

  useEffect(() => {
    getRFQById(rfqId).then((response) => {
        console.log(response);
        setRfqDetails(response);
    });
  }, [rfqId]);

  if (!rfqDetails) {
    return <p>Loading RFQ details...</p>;
  }

    const rfq = rfqDetails.data;
    const auction_config = rfqDetails.auction_config;
    const bids = rfqDetails.bids || [];
    const logs = rfqDetails.logs || [];

    if (!rfq || !auction_config) {
    return <p>RFQ details format is not correct.</p>;
    }

    const handleBidChange = (e) => {
    setBidForm({
        ...bidForm,
        [e.target.name]: e.target.value,
    });
    };

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await submitBid(
            rfqId,
            bidForm
            );
            console.log(response);

            if (!response.data) {
                alert(response.message);
                return;
            }
            alert("Bid submitted successfully");
            setBidForm({
                supplier_name: "",
                freight_charges: "",
                origin_charges: "",
                destination_charges: "",
                transit_time: "",
                quote_validity: "",
            });
            const updatedRFQ = await getRFQById(rfqId);
            setRfqDetails(updatedRFQ);
        } catch (error) {
            console.error(error);
            alert("Failed to submit bid");
        }
    };

    const handleCloseAuction = async () => {
        try {
            const response = await closeAuction(rfqId);
            alert(response.message);
            const updatedRFQ = await getRFQById(rfqId);
            setRfqDetails(updatedRFQ);
        } catch (error) {
            console.error(error);
            alert("Failed to close auction");
        }
    };
    
  return (
    <div>
      <button onClick={onBack}>Back to List</button>

      <h2>RFQ Details</h2>

      <div className="rfq-card">
        <h3>{rfq.rfq_name}</h3>
        <p><strong>Reference ID:</strong> {rfq.reference_id}</p>
        <p><strong>Status:</strong> {rfq.status}</p>
        <p><strong>Bid Close Time:</strong> {rfq.bid_close_time}</p>
        <p><strong>Forced Close Time:</strong> {rfq.forced_bid_close_time}</p>
      </div>

      <div className="rfq-card">
        <h3>Auction Configuration</h3>
        <p><strong>Trigger Window:</strong> {auction_config.trigger_window_minutes} minutes</p>
        <p><strong>Extension Duration:</strong> {auction_config.extension_duration_minutes} minutes</p>
        <p><strong>Trigger Type:</strong> {auction_config.extension_trigger_type}</p>
      </div>

      <div className="rfq-card">
        <h3>Submit Bid</h3>

        <form onSubmit={handleBidSubmit}>
            <div>
            <label>Supplier Name</label>
            <br />
            <input
                type="text"
                name="supplier_name"
                value={bidForm.supplier_name}
                onChange={handleBidChange}
            />
            </div>

            <div>
            <label>Freight Charges</label>
            <br />
            <input
                type="number"
                name="freight_charges"
                value={bidForm.freight_charges}
                onChange={handleBidChange}
            />
            </div>

            <div>
            <label>Origin Charges</label>
            <br />
            <input
                type="number"
                name="origin_charges"
                value={bidForm.origin_charges}
                onChange={handleBidChange}
            />
            </div>

            <div>
            <label>Destination Charges</label>
            <br />
            <input
                type="number"
                name="destination_charges"
                value={bidForm.destination_charges}
                onChange={handleBidChange}
            />
            </div>

            <div>
            <label>Transit Time</label>
            <br />
            <input
                type="text"
                name="transit_time"
                value={bidForm.transit_time}
                onChange={handleBidChange}
            />
            </div>

            <div>
            <label>Quote Validity</label>
            <br />
            <input
                type="text"
                name="quote_validity"
                value={bidForm.quote_validity}
                onChange={handleBidChange}
            />
            </div>

            <button type="submit">
            Submit Bid
            </button>
        </form>
      </div>

      <div className="rfq-card">
        <h3>Supplier Bids</h3>

        {bids.length === 0 ? (
            <p>No bids submitted yet.</p>
            ) : (
            bids.map((bid) => (
                <div key={bid.id}>
                <p>
                    <strong>{bid.rank}</strong> -{" "}
                    {bid.supplier_name}
                </p>

                <p>
                    <strong>Total Amount:</strong>{" "}
                    {bid.total_amount}
                </p>

                <p>
                    <strong>Freight Charges:</strong>{" "}
                    {bid.freight_charges}
                </p>

                <p>
                    <strong>Origin Charges:</strong>{" "}
                    {bid.origin_charges}
                </p>

                <p>
                    <strong>Destination Charges:</strong>{" "}
                    {bid.destination_charges}
                </p>

                <p>
                    <strong>Transit Time:</strong>{" "}
                    {bid.transit_time}
                </p>

                <p>
                    <strong>Quote Validity:</strong>{" "}
                    {bid.quote_validity}
                </p>

                <hr />
                </div>
            ))
        )}
      </div>

      <div className="rfq-card">
        <h3>Activity Logs</h3>

        {logs.length === 0 ? (
            <p>No activity logs yet.</p>
            ) : (
            logs.map((log) => (
                <div key={log.id}>
                <p>
                    <strong>{log.activity_type}</strong>
                </p>

                <p>{log.message}</p>

                {log.old_bid_close_time && (
                    <p>
                    <strong>Old Close Time:</strong>{" "}
                    {log.old_bid_close_time}
                    </p>
                )}

                {log.new_bid_close_time && (
                    <p>
                    <strong>New Close Time:</strong>{" "}
                    {log.new_bid_close_time}
                    </p>
                )}

                <p>
                    <strong>Created At:</strong>{" "}
                    {log.created_at}
                </p>

                <hr />
                </div>
            ))
        )}
      </div>
      <button onClick={handleCloseAuction}>Close Auction</button>
    </div>
  );
}
export default RFQDetailsPage;