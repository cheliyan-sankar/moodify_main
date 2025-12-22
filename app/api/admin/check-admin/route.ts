import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ isAdmin: false }, { status: 400 });
    }

    // In local development, don't block access if server secrets aren't configured.
    // (Other admin APIs may still require the service role key for full functionality.)
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration: SUPABASE_SERVICE_ROLE_KEY not set');
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: allowing admin access (missing service role key)');
        return NextResponse.json({ isAdmin: true });
      }
      return NextResponse.json(
        {
          isAdmin: false,
          error: 'Server configuration incomplete. Please set SUPABASE_SERVICE_ROLE_KEY in secrets.',
        },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Safer: fetch potential matches then compare lowercased emails in JS
    try {
      const queryPromise = supabase
        .from('admin_users')
        .select('email');

      const timeoutMs = 4000;
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Supabase query timed out')), timeoutMs)
      );

      const result: any = await Promise.race([queryPromise, timeoutPromise]);

      const { data, error } = result || {};

      if (error) {
        console.error('Admin check error (fetch):', error);
        // Allow access in development for testing
        if (process.env.NODE_ENV === 'development') {
          console.log('Development mode: allowing admin access');
          return NextResponse.json({ isAdmin: true });
        }
        return NextResponse.json({ isAdmin: false, error: 'Failed to check admin status' });
      }

      // proceed with data below
      var fetchedData = data;
    } catch (err: any) {
      console.error('Admin check timed out or failed:', err);
      // Distinguish timeout vs other errors
      if ((err || {}).message && (err.message as string).includes('timed out')) {
        return NextResponse.json({ isAdmin: false, error: 'Supabase request timed out' }, { status: 504 });
      }
      // Allow access in development for testing
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: allowing admin access');
        return NextResponse.json({ isAdmin: true });
      }
      return NextResponse.json({ isAdmin: false, error: 'Failed to check admin status' });
    }

    const normalized = (email || '').trim().toLowerCase();
    const found = (fetchedData || []).some((row: any) => {
      try {
        return String(row.email || '').trim().toLowerCase() === normalized;
      } catch (e) {
        return false;
      }
    });

    if (found) return NextResponse.json({ isAdmin: true });

    // Allow access in development for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: allowing admin access for', email);
      return NextResponse.json({ isAdmin: true });
    }

    return NextResponse.json({ isAdmin: false });
  } catch (error) {
    console.error('Admin check error:', error);
    // Allow access in development for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: allowing admin access');
      return NextResponse.json({ isAdmin: true });
    }
    return NextResponse.json({ isAdmin: false }, { status: 500 });
  }
}
