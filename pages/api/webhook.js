import Stripe from 'stripe';
import { buffer } from 'micro';
import { connectToDB } from '@/lib/mongodb';
import Purchase from '@/models/Purchase'; // Corrected import
import UserCourseProgress from '@/models/UserCourseProgress';
import Course from '@/models/Course';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false, // Disables Next.js's default body parsing
  },
};

export default async function webhookHandler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Read the raw request body
    const rawBody = await buffer(req);

    // Verify the signature
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Error verifying Stripe webhook:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleCheckoutSessionCompleted(session);
      break;
    case 'invoice.payment_failed':
      const failedInvoice = event.data.object;
      await handlePaymentFailed(failedInvoice);
      break;
    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  // Respond to Stripe to acknowledge receipt
  res.status(200).json({ received: true });
}

async function createUserCourseProgress(userId, courseId) {
  try {
    // Check if progress record already exists
    const existingProgress = await UserCourseProgress.findOne({ user: userId, course: courseId });
    if (existingProgress) {
      console.log(`Progress record for user ${userId} and course ${courseId} already exists.`);
      return;
    }

    // Fetch course details to build the curriculum structure
    const course = await Course.findById(courseId).lean();

    if (!course) {
      console.error(`Course with ID ${courseId} not found.`);
      return;
    }

    // Validate and log modules and lessons
    // course.modules.forEach((module, moduleIndex) => {
    //   console.log(`📦 [DEBUG] Processing Module ${moduleIndex + 1}: ${module.moduleTitle}`);
    //   module.lessons.forEach((lesson, lessonIndex) => {
    //     console.log(`   📄 [DEBUG] Processing Lecture ${lessonIndex + 1}: ${lesson.lessonTitle}`);
    //     if (lesson.videoURL) {
    //       console.log(`      🎥 [DEBUG] videoURL found: ${lesson.videoURL}`);
    //     } else {
    //       console.warn(`      ⚠️ [DEBUG] videoURL is missing for Lecture ${lessonIndex + 1}: ${lesson.lessonTitle}`);
    //     }
    //   });
    // });

    // Build the progress curriculum structure
    const curriculum = course.modules.map((module) => ({
      sectionTitle: module.moduleTitle,
      lectures: module.lessons.map((lesson) => ({
        title: lesson.lessonTitle,
        duration: lesson.duration,
        videoURL: lesson.videoURL,
        completed: false,
      })),
    }));

    //console.log('curriculum: ', curriculum[0].lectures)

    // Create the progress document
    await UserCourseProgress.create({
      user: userId,
      course: courseId,
      progress: {
        curriculum,
        percentage: 0,
      },
      purchasedAt: new Date(),
    });

    console.log(`Progress record created for user ${userId} and course ${courseId}`);
  } catch (error) {
    console.error('Error creating user course progress:', error);
  }
}


async function handleCheckoutSessionCompleted(session) {
  await connectToDB();

  const courseId = session.metadata.courseId;
  const userId = session.metadata.userId;
  const paymentIntentId = session.payment_intent;
  const amount = session.amount_total / 100; // Convert from cents to dollars
  const currency = session.currency;

  try {
    // Check if a purchase already exists to prevent duplicates
    const existingPurchase = await Purchase.findOne({ paymentIntentId });

    if (!existingPurchase) {
      await Purchase.create({
        user: userId,
        course: courseId,
        paymentIntentId,
        amount,
        currency,
        status: 'succeeded',
      });
      console.log(`User ${userId} purchased course ${courseId}`);

      // Create Progress record
      await createUserCourseProgress(userId, courseId);
    } else {
      console.log(`Purchase with paymentIntentId ${paymentIntentId} already exists.`);
    }
  } catch (error) {
    console.error('Error creating purchase record:', error);
  }
}

async function handlePaymentFailed(failedInvoice) {
  console.warn(`Payment failed for invoice ${failedInvoice.id}`);
  // Implement your logic here
}
