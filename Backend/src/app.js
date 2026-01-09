import express from "express";
import uploadRoutes from "./routes/upload-routes.js";
import userRoutes from "./routes/user-routes.js";
import companyRoutes from "./routes/company-routes.js";
import serviceRoutes from "./routes/service-routes.js";
const app = express();

app.use(express.json());
app.use("/api/upload", uploadRoutes);
app.use("/api/user", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/services", serviceRoutes);

// Server Health Check
app.use("/", (req, res) => {
  console.log("API is working");
  res.json({ message: "Server is working Fine" });
});

export default app;
