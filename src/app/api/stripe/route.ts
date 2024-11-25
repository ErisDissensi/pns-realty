import Stripe from 'stripe';
import { authOptions } from '@/libs/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-10-28.acacia',
});

type RequestData = {
  amount?: number; // Dynamic amount in PHP, optional if you want to calculate it
  EstateSlug?: string; // Optional if you still want to include estate-related data
  checkinDate?: string; // Optional, if using check-in and check-out for calculation
  checkoutDate?: string; // Optional, if using check-in and check-out for calculation
};

export async function POST(req: Request, res: Response) {
  const { amount, EstateSlug, checkinDate, checkoutDate }: RequestData = await req.json();

  let calculatedAmount = amount;

  // Check if checkinDate and checkoutDate are provided and calculate the amount based on the difference in days
  if (!calculatedAmount && checkinDate && checkoutDate) {
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);

    // Log the check-in and check-out dates for debugging
    console.log('Check-in:', checkin);
    console.log('Check-out:', checkout);

    // Calculate the difference in time
    const differenceInTime = checkout.getTime() - checkin.getTime();
    const numberOfDays = differenceInTime / (1000 * 3600 * 24); // Calculate difference in days

    // Log the calculated number of days
    console.log('Difference in days:', numberOfDays);

    // Handle case where the number of days is 0 or less (same day or invalid dates)
    if (numberOfDays <= 0) {
      return new NextResponse('Check-in and check-out dates must be different', { status: 400 });
    }

    // Set a default minimum value for amount, e.g., PHP 100 per day
    calculatedAmount = Math.max(100 * numberOfDays, 100); // Ensures at least PHP 100 is charged
  }

  // Validate that amount is provided and is greater than 0
  if (!calculatedAmount || calculatedAmount <= 0) {
    return new NextResponse('Amount must be a positive number', { status: 400 });
  }

  const origin = req.headers.get('origin');

  // Authenticate user
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Authentication required', { status: 400 });
  }

  const userId = session.user.id;

  try {
    // Create a Stripe session for the dynamic payment amount
    const stripeSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'PHP',
            product_data: {
              name: `Payment for Estate: ${EstateSlug || 'Custom Amount'}`,
              // Optional, you could add a description for custom payments
            },
            unit_amount: parseInt((calculatedAmount * 100).toString()), // Convert amount to cents (PHP)
          },
        },
      ],
      payment_method_types: ['card'],
      success_url: `${origin}/users/${userId}`, // Redirect after payment success
      cancel_url: `${origin}/payment-cancel`, // Redirect if payment is cancelled
      metadata: {
        amount: calculatedAmount,
        user: userId,
        EstateSlug: EstateSlug || 'custom',
      },
    });

    // Return Stripe session ID to the frontend for redirection
    return NextResponse.json(stripeSession, {
      status: 200,
      statusText: 'Payment session created',
    });
  } catch (error: any) {
    console.log('Payment failed', error);
    return new NextResponse(error.message || 'Payment creation failed', { status: 500 });
  }
}
