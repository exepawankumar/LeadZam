package com.leadzam.app.service

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.telephony.PhoneNumberUtils
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.leadzam.app.R
import androidx.core.net.toUri

class NotificationHelper(
    private val context: Context
) {

    companion object {
        private const val CHANNEL_ID = "lead_call_channel"
        private const val CHANNEL_NAME = "Lead Call Notifications"
    }

    fun showLeadNotification(
        leadId: String,
        leadName: String,
        phoneNumber: String
    ) {
        // Validate input.
        if (leadId.isBlank() || leadName.isBlank() || phoneNumber.isBlank()) {
            return
        }

        val normalizedNumber = PhoneNumberUtils.normalizeNumber(phoneNumber)

        // Accept an optional leading + and 7–15 digits.
        if (!normalizedNumber.matches(Regex("""\+?[0-9]{7,15}"""))) {
            return
        }

        // Create the notification channel.
        createNotificationChannel()

        // Open the phone dialer with the number prefilled.
        val dialIntent = Intent(
            Intent.ACTION_DIAL,
            "tel:${Uri.encode(normalizedNumber)}".toUri()
        )

        val pendingIntent = PendingIntent.getActivity(
            context,
            leadId.hashCode(),
            dialIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or
                    PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(
            context,
            CHANNEL_ID
        )
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setContentTitle("Call $leadName")
            .setContentText("Tap to open the phone dialer")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_CALL)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .build()

        try {
            NotificationManagerCompat
                .from(context)
                .notify(leadId.hashCode(), notification)

        } catch (exception: SecurityException) {
            // Notification permission is not granted.
        }
    }

    private fun createNotificationChannel() {

        val channel = NotificationChannel(
            CHANNEL_ID,
            CHANNEL_NAME,
            NotificationManager.IMPORTANCE_HIGH
        ).apply {
            description = "Notifications for CRM lead calls"
        }

        val manager = context.getSystemService(
            NotificationManager::class.java
        )

        manager.createNotificationChannel(channel)
    }
}
