import express from "express";
import cors from "cors";
import dotenv from "dotenv";    
import rfqRoutes from "./routes/rfqRoutes.js";
const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api/rfq", rfqRoutes); 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});