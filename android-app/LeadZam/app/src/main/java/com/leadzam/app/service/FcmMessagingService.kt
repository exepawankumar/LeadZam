package com.leadzam.app.service

import android.util.Log
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class FcmMessagingService : FirebaseMessagingService() {

    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)

        val data = message.data

        val leadId = data["lead_id"] ?: return
        val leadName = data["lead_name"] ?: return
        val phoneNumber = data["phone_number"] ?: return

        Log.d("LeadZamFCM", "Received lead notification")

        val notificationHelper = NotificationHelper(
            applicationContext
        )

        notificationHelper.showLeadNotification(
            leadId = leadId,
            leadName = leadName,
            phoneNumber = phoneNumber
        )
    }

    override fun onNewToken(token: String) {
        super.onNewToken(token)

        Log.d("LeadZamFCM", "FCM token refreshed")

        // TODO: Send the refreshed token to your Node.js backend
        // using an authenticated HTTPS API.
    }
}