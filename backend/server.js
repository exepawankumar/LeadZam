const express = require("express");
const cors = require("cors");

const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// 1. Middleware
app.use(cors());
app.use(express.json());

// 2. Health-check endpoint
app.get("/health", (req, res) => {
res.status(200).json({
success: true,
message: "LeadZam backend is running"
});
});

// 3. Notification routes
app.use("/api/notifications", notificationRoutes);

// 4. Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
console.log(`LeadZam backend running on port ${PORT}`);
});
