// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
// import { cookies } from 'next/headers';
// import { NextResponse } from 'next/server';

// import { stripe } from '@/libs/stripe';
// import { getURL } from '@/libs/helpers';
// import { createOrRetrieveCustomer } from '@/libs/supabaseAdmin';

// export async function POST(request: Request) {
//   const { price, quantity = 1, metadata = {} } = await request.json();

//   try {
//     const supabase = createRouteHandlerClient({
//       cookies,
//     });
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     // Validate user and user ID before proceeding
//     if (!user || !user.id) {
//       return new NextResponse('User not authenticated or invalid user ID', { status: 401 });
//     }

//     const customer = await createOrRetrieveCustomer({
//       uuid: user.id, // No fallback to empty string
//       email: user.email || '',
//     });

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       billing_address_collection: 'required',
//       customer,
//       line_items: [
//         {
//           price: price.id,
//           quantity,
//         },
//       ],
//       mode: 'subscription',
//       allow_promotion_codes: true,
//       subscription_data: {
//         trial_from_plan: true,
//         metadata,
//       },
//       success_url: `${getURL()}account`,
//       cancel_url: `${getURL()}`,
//     });
//     return NextResponse.json({ sessionId: session.id });
//   } catch (error: any) {
//     // console.log('Checkout session error:', error);
//     return new NextResponse('Internal Error', { status: 500 });
//   }
// }

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Replace these with actual implementations or remove if unused
// import { stripe } from '@/libs/stripe';
// import { getURL } from '@/libs/helpers';
// import { createOrRetrieveCustomer } from '@/libs/supabaseAdmin';

// TEMP: Inline mock implementations for deployment to succeed
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!);

const getURL = () => {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000/';
};

const createOrRetrieveCustomer = async ({
  uuid,
  email,
}: {
  uuid: string;
  email: string;
}) => {
  // Replace this with your actual Supabase logic
  // For now, just create a new Stripe customer
  const customer = await stripe.customers.create({
    email,
    metadata: { supabaseUUID: uuid },
  });
  return customer.id;
};

export async function POST(request: Request) {
  const { price, quantity = 1, metadata = {} } = await request.json();

  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.id) {
      return new NextResponse('User not authenticated or invalid user ID', {
        status: 401,
      });
    }

    const customer = await createOrRetrieveCustomer({
      uuid: user.id,
      email: user.email || '',
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      customer,
      line_items: [
        {
          price: price.id,
          quantity,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      subscription_data: {
        trial_from_plan: true,
        metadata,
      },
      success_url: `${getURL()}account`,
      cancel_url: `${getURL()}`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Checkout session error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}