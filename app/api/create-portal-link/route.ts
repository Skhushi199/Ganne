// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

// import { cookies } from 'next/headers';
// import { NextResponse } from 'next/server';

// // import { stripe } from '@/libs/stripe';
// // import { getURL } from '@/libs/helpers';
// import { createOrRetrieveCustomer } from '@/libs/supabaseAdmin';

// export async function POST() {
//   try {
//     const supabase = createRouteHandlerClient({
//       cookies,
//     });

//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) throw new Error('User not found');

//     // Enhanced validation before passing to createOrRetrieveCustomer
//     if (!user.id) throw new Error('User ID is required');

//     const customer = await createOrRetrieveCustomer({
//       uuid: user.id, // No fallback to empty string
//       email: user?.email || '',
//     });

//     if (!customer) throw new Error('Customer not found');

//     const { url } = await stripe.billingPortal.sessions.create({
//       customer,
//       return_url: `${getURL()}/account`,
//     });

//     return NextResponse.json({ url });
//   } catch (error) {
//     console.log(error);
//     return new NextResponse('Internal Error', { status: 500 });
//   }
// }

// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
// import { cookies } from 'next/headers';
// import { NextResponse } from 'next/server';
// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2022-11-15',
// });

// // Fallback for getURL if you don’t have a helper
// const getURL = () => {
//   return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
// };

// // Simple customer creation logic
// const createOrRetrieveCustomer = async ({
//   uuid,
//   email,
// }: {
//   uuid: string;
//   email: string;
// }) => {
//   const customers = await stripe.customers.list({
//     email,
//     limit: 1,
//   });

//   if (customers.data.length > 0) {
//     return customers.data[0].id;
//   }

//   const customer = await stripe.customers.create({
//     email,
//     metadata: { supabaseUUID: uuid },
//   });

//   return customer.id;
// };

// export async function POST() {
//   try {
//     const supabase = createRouteHandlerClient({ cookies });

//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user || !user.id) {
//       return new NextResponse('User not authenticated or invalid ID', { status: 401 });
//     }

//     const customer = await createOrRetrieveCustomer({
//       uuid: user.id,
//       email: user.email || '',
//     });

//     const session = await stripe.billingPortal.sessions.create({
//       customer,
//       return_url: `${getURL()}/account`,
//     });

//     return NextResponse.json({ url: session.url });
//   } catch (error) {
//     console.error('Stripe billing portal error:', error);
//     return new NextResponse('Internal Error', { status: 500 });
//   }
// }

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.id) {
      return new NextResponse('User not authenticated or invalid ID', {
        status: 401,
      });
    }

    // Placeholder for future logic: e.g., redirect user to profile or log intent
    console.log('User authenticated:', {
      id: user.id,
      email: user.email,
    });

    return NextResponse.json({ message: 'Stripe functionality removed. User authenticated.' });
  } catch (error) {
    console.error('Handler error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}