import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function extractErrorMessage(err: unknown): string {
  if (!err) return 'Unknown error';
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

function createServerClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase configuration');
  }
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET() {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('consultants')
      .select('id, full_name, title, picture_url, booking_url, is_active, created_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(12);

    if (error) throw new Error(extractErrorMessage(error));

    return NextResponse.json({ consultants: data || [] });
  } catch (err) {
    console.error('Error fetching public consultants:', err);
    // Don’t fail the page; return empty list and a message for debugging.
    return NextResponse.json({ consultants: [], error: extractErrorMessage(err) }, { status: 200 });
  }
}
