import { useState } from "react";
import CreateRFQPage from "./pages/CreateRFQPage";
import RFQListPage from "./pages/RFQListPage";
import RFQDetailsPage from "./pages/RFQDetailsPage";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedRFQId, setSelectedRFQId] = useState(null);
  const refreshRFQs = () => {
    setRefreshKey((prev) => prev + 1);
  };
  return (
    <div>
      <h1>British Auction RFQ System</h1>
      <CreateRFQPage onRFQCreated={refreshRFQs} />
      <hr />
      {selectedRFQId ? (
        <RFQDetailsPage
          rfqId={selectedRFQId}
          onBack={() => setSelectedRFQId(null)}
        />
      ) : (
        <RFQListPage
          refreshKey={refreshKey}
          onViewDetails={setSelectedRFQId}
        />
      )}
    </div>
  );
}

export default App;