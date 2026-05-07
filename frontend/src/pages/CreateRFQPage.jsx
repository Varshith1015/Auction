function CreateRFQPage() {
  return (
    <div>
      <h2>Create RFQ Page</h2>

      <form>
        <div>
          <label>RFQ Name</label>
          <br />
          <input type="text" name="rfq_name" />
        </div>

        <div>
          <label>Reference ID</label>
          <br />
          <input type="text" name="reference_id" />
        </div>

        <div>
          <label>Bid Start Time</label>
          <br />
          <input type="datetime-local" name="bid_start_time" />
        </div>

        <div>
          <label>Bid Close Time</label>
          <br />
          <input type="datetime-local" name="bid_close_time" />
        </div>

        <div>
          <label>Forced Bid Close Time</label>
          <br />
          <input type="datetime-local" name="forced_bid_close_time" />
        </div>

        <div>
          <label>Pickup / Service Date</label>
          <br />
          <input type="date" name="pickup_service_date" />
        </div>

        <div>
          <label>Trigger Window Minutes</label>
          <br />
          <input type="number" name="trigger_window_minutes" />
        </div>

        <div>
          <label>Extension Duration Minutes</label>
          <br />
          <input type="number" name="extension_duration_minutes" />
        </div>

        <div>
          <label>Extension Trigger Type</label>
          <br />
          <select name="extension_trigger_type">
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