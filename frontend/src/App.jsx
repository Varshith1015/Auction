import RFQListPage from "./pages/RFQListPage";
import CreateRFQPage from "./pages/CreateRFQPage";

function App() {
  return (
    <div>
      <h1>Auction RFQ System</h1>
      <CreateRFQPage />
      <hr />
      <RFQListPage />
    </div>
  );
}

export default App;