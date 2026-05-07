import express from "express";
import cors from "cors";
import dotenv from "dotenv";  
dotenv.config();  
import rfqRoutes from "./routes/rfqRoutes.js";
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Welcome to the RFQ Management System API");
});

app.use("/api/rfq", rfqRoutes); 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
