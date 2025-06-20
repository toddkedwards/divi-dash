import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import admin from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const db = admin.firestore();

export const config = {
  api: {
    bodyParser: false,
  },
};

async function updateUserSubscription(userId: string, status: 'active' | 'cancelled') {
  try {
    await db.collection('users').doc(userId).update({
      isPro: status === 'active',
      subscriptionStatus: status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`Updated user ${userId} subscription status to ${status}`);
  } catch (error) {
    console.error('Error updating user subscription:', error);
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const buf = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });

  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.client_reference_id) { // This should be the Firebase user ID
          await updateUserSubscription(session.client_reference_id, 'active');
          
          // Store subscription details
          await db.collection('subscriptions').doc(session.client_reference_id).set({
            userId: session.client_reference_id,
            stripeCustomerId: session.customer as string,
            subscriptionId: session.subscription as string,
            status: 'active',
            priceId: session.line_items?.data[0]?.price?.id,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as any; // Type cast to any to access subscription ID
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
          if (subscription.metadata.userId) {
            await updateUserSubscription(subscription.metadata.userId, 'active');
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        if (subscription.metadata.userId) {
          await updateUserSubscription(subscription.metadata.userId, 'cancelled');
          
          // Update subscription record
          await db.collection('subscriptions')
            .doc(subscription.metadata.userId)
            .update({
              status: 'cancelled',
              cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Error processing webhook:', err);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
} 