import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

function createPublicClient() {
  if (!supabaseUrl) {
    throw new Error('Missing Supabase configuration: SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) not set');
  }

  if (!anonKey) {
    throw new Error(
      'Missing Supabase configuration: SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) not set'
    );
  }

  return createClient(supabaseUrl, anonKey);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');

    if (!page) {
      return NextResponse.json({ data: [], error: 'Page parameter required' }, { status: 400 });
    }

    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from('faqs')
      .select('id, page, question, answer, sort_order, active')
      .eq('page', page)
      .eq('active', true)
      .order('sort_order', { ascending: true });

    if (error) throw new Error(extractErrorMessage(error));

    return NextResponse.json({ data: data || [] });
  } catch (err) {
    console.error('Error fetching public FAQs:', err);
    // Don’t fail the page; return empty list and a message for debugging.
    return NextResponse.json({ data: [], error: extractErrorMessage(err) }, { status: 200 });
  }
}
