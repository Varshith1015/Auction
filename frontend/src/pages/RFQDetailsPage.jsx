function RFQDetailsPage({ rfqId, onBack }) {
  return (
    <div>
      <button onClick={onBack}>Back to List</button>
      <h2>RFQ Details Page</h2>
      <p>Selected RFQ ID: {rfqId}</p>
    </div>
  );
}

export default RFQDetailsPage;
