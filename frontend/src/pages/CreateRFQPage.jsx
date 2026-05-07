function CreateRFQPage() {
  return (
    <div>
      <h2>Create RFQ Page</h2>
      <form>
        <div>
          <label>RFQ Name</label>
          <br />
          <input type="text" />
        </div>
        <div>
          <label>Reference ID</label>
          <br />
          <input type="text" />
        </div>
        <button type="submit">
          Create RFQ
        </button>
      </form>
    </div>
  );
}

export default CreateRFQPage;