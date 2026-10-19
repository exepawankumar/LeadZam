const express = require("express");
const { messaging } = require("../config/firebase");

const router = express.Router();

// Test notification routes
router.get("/test", (req, res) => {
res.status(200).json({
success: true,
message: "Notification routes are working"
});
});

// Send FCM notification
router.post("/send", async (req, res) => {
try {
const { fcmToken, leadId, leadName, phoneNumber } = req.body;

    // Validate request
    if (!fcmToken || !leadId || !leadName || !phoneNumber) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    // Prepare FCM data message
    const message = {
        token: fcmToken,
        data: {
            lead_id: String(leadId),
            lead_name: String(leadName),
            phone_number: String(phoneNumber)
        },
        android: {
            priority: "high"
        }
    };

    // Send message through Firebase
    const messageId = await messaging.send(message);

    return res.status(200).json({
        success: true,
        message: "FCM message sent successfully",
        messageId
    });

} catch (error) {
    console.error("FCM error:", error);

    return res.status(500).json({
        success: false,
        message: "Failed to send FCM message",
        error: error.message
    });
}

});

module.exports = router;
