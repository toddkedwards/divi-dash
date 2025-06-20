import * as logger from "firebase-functions/logger";
import { onDocumentCreated, DocumentSnapshot, FirestoreEvent, QueryDocumentSnapshot } from "firebase-functions/v2/firestore";
import * as nodemailer from "nodemailer";

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface NotificationData {
  email: string;
  subject: string;
  message: string;
}

// Cloud Function for email notifications
export const sendEmailNotification = onDocumentCreated("notifications/{notificationId}", async (event: FirestoreEvent<QueryDocumentSnapshot | undefined, { notificationId: string }>) => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.error("No data associated with the event");
    return;
  }
  const data = snapshot.data() as NotificationData;
  const { email, subject, message } = data;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: message,
  };
  try {
    await transporter.sendMail(mailOptions);
    logger.info("Email notification sent successfully");
  } catch (error) {
    logger.error("Error sending email notification:", error);
  }
}); 