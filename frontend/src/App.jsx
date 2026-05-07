import RFQListPage from "./pages/RFQListPage";
import CreateRFQPage from "./pages/CreateRFQPage";
import { useState } from "react";


function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const refreshRFQs = () => {
    setRefreshKey((prev) => prev + 1);
  };
  return (
    <div>
      <h1>British Auction RFQ System</h1>
      <CreateRFQPage onRFQCreated={refreshRFQs} />
      <hr />
      <RFQListPage refreshKey={refreshKey} />
    </div>
  );
}

export default App;