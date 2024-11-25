import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createBooking, updateEstate } from '@/libs/apis';

const checkout_session_completed = 'checkout.session.completed';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-10-28.acacia',
});

// Define custom metadata type
interface CustomMetadata {
  adults: string;
  checkinDate: string;
  checkoutDate: string;
  children: string;
  Estate: string;
  numberOfDays: string;
  user: string;
  discount: string;
  totalPrice: string;
}

export async function POST(req: Request) {
  const reqBody = await req.text();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      console.error('Missing signature or webhook secret.');
      return new NextResponse('Missing signature or webhook secret', { status: 400 });
    }

    event = stripe.webhooks.constructEvent(reqBody, sig, webhookSecret);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Webhook Error: ${error.message}`);
      return new NextResponse(`Webhook Error: ${error.message}`, { status: 500 });
    }
    console.error('Unknown webhook error occurred.');
    return new NextResponse('Webhook Error: Unknown error occurred', { status: 500 });
  }

  switch (event.type) {
    case checkout_session_completed: {
      const session = event.data.object as Stripe.Checkout.Session & {
        metadata: CustomMetadata;
      };

      if (!session.metadata) {
        console.error('Metadata is missing in the session object:', session);
        return new NextResponse('Metadata is missing in the session', { status: 400 });
      }

      const {
        adults,
        checkinDate,
        checkoutDate,
        children,
        Estate,
        numberOfDays,
        user,
        discount,
        totalPrice,
      } = session.metadata;

      console.log('Received booking metadata:', session.metadata);

      // Create the booking
      try {
        await createBooking({
          adults: Number(adults),
          checkinDate,
          checkoutDate,
          children: Number(children),
          Estate,
          numberOfDays: Number(numberOfDays),
          discount: Number(discount),
          totalPrice: Number(totalPrice),
          user,
        });
        console.log(`Booking created for Estate: ${Estate} by User: ${user}`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error creating Booking:', error.message);
          return new NextResponse(`Error creating Booking: ${error.message}`, { status: 500 });
        }
        console.error('Unknown error creating Booking.');
        return new NextResponse('Error creating Booking: Unknown error occurred', { status: 500 });
      }

      // Update estate
      try {
        await updateEstate(Estate);
        console.log(`Estate ${Estate} updated.`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error updating estate:', error.message);
          return new NextResponse(`Error updating estate: ${error.message}`, { status: 500 });
        }
        console.error('Unknown error updating estate.');
        return new NextResponse('Error updating estate: Unknown error occurred', { status: 500 });
      }

      return NextResponse.json('Booking successful', {
        status: 200,
        statusText: 'Booking Successful',
      });
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json('Event Received', {
    status: 200,
    statusText: 'Event Received',
  });
}
