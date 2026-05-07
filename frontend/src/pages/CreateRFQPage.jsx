import { useState } from "react";
import { createRFQ } from "../services/api";

function CreateRFQPage() {

    const [formData, setFormData] = useState({
        rfq_name: "",
        reference_id: "",
        bid_start_time: "",
        bid_close_time: "",
        forced_bid_close_time: "",
        pickup_service_date: "",
        trigger_window_minutes: "",
        extension_duration_minutes: "",
        extension_trigger_type: "BID_RECEIVED",
    });
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createRFQ(formData);

            console.log(response);
            alert("RFQ created successfully");
        } catch (error) {
            console.error(error);
            alert("Failed to create RFQ");
        }
    };

  return (
    <div>
      <h2>Create RFQ Page</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>RFQ Name</label>
          <br />
          <input type="text" name="rfq_name" value={formData.rfq_name} onChange={handleChange} />
        </div>
        <div>
          <label>Reference ID</label>
          <br />
          <input type="text" name="reference_id" value={formData.reference_id} onChange={handleChange} />
        </div>
        <div>
          <label>Bid Start Time</label>
          <br />
          <input type="datetime-local" name="bid_start_time" value={formData.bid_start_time} onChange={handleChange} />
        </div>
        <div>
          <label>Bid Close Time</label>
          <br />
          <input type="datetime-local" name="bid_close_time" value={formData.bid_close_time} onChange={handleChange} />
        </div>
        <div>
          <label>Forced Bid Close Time</label>
          <br />
          <input type="datetime-local" name="forced_bid_close_time" value={formData.forced_bid_close_time} onChange={handleChange} />
        </div>
        <div>
          <label>Pickup / Service Date</label>
          <br />
          <input type="date" name="pickup_service_date" value={formData.pickup_service_date} onChange={handleChange} />
        </div>
        <div>
          <label>Trigger Window Minutes</label>
          <br />
          <input type="number" name="trigger_window_minutes" value={formData.trigger_window_minutes} onChange={handleChange} />
        </div>
        <div>
          <label>Extension Duration Minutes</label>
          <br />
          <input type="number" name="extension_duration_minutes" value={formData.extension_duration_minutes} onChange={handleChange} />
        </div>
        <div>
          <label>Extension Trigger Type</label>
          <br />
          <select name="extension_trigger_type" value={formData.extension_trigger_type} onChange={handleChange}>
            <option value="BID_RECEIVED">Bid Received</option>
            <option value="ANY_RANK_CHANGE">Any Rank Change</option>
            <option value="L1_CHANGE">L1 Rank Change</option>
          </select>
        </div>
        <button type="submit">Create RFQ</button>
      </form>
    </div>
  );
}

export default CreateRFQPage;