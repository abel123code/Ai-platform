import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Course from '@/models/Course';
import { connectToDB } from '@/lib/mongodb';

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.redirect('/login');
  }

  const { courseId } = await request.json();

  await connectToDB();

  // Fetch course details
  const course = await Course.findById(courseId);
  //console.log(course)
  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paynow'],
      mode: 'payment',
      line_items: [
        {
          price: course.priceId, 
          quantity: 1,
        },
      ],
      // success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      success_url: `${process.env.NEXTAUTH_URL}/course/${courseId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cancel`,
      customer_email: session.user.email,
      metadata: {
        courseId: course._id.toString(),
        userId: session.user.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json(
      { error: 'Unable to create checkout session' },
      { status: 500 }
    );
  }
}
