import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function createAdminClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase configuration');
  }
  return createClient(supabaseUrl, supabaseKey);
}

function extractErrorMessage(err: any): string {
  if (!err) return 'Unknown error';
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  if (typeof err === 'object') {
    if ('message' in err && typeof err.message === 'string') return err.message;
    if ('error' in err && typeof err.error === 'string') return err.error;
    if ('msg' in err && typeof err.msg === 'string') return err.msg;
    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  }
  return String(err);
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('consultants')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      const msg = extractErrorMessage(error);
      throw new Error(msg);
    }
    return NextResponse.json({ consultants: data || [] });
  } catch (err) {
    console.error('Error fetching consultants:', err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Failed to fetch consultants: ${message}`, consultants: [] }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();
    const { full_name, title, picture_url, booking_url, is_active } = body;

    if (!full_name) {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
    }

    const insertPayload: any = {
      full_name,
      title: title || null,
      picture_url: picture_url || null,
      booking_url: booking_url || null,
      is_active: is_active === undefined ? true : !!is_active,
    };

    const { data, error } = await supabase.from('consultants').insert(insertPayload).select();
    if (error) {
      const msg = extractErrorMessage(error);
      console.error('Error creating consultant:', msg);
      throw new Error(msg);
    }

    const created = data?.[0];
    if (created?.id) {
      const { data: fetched, error: fetchErr } = await supabase
        .from('consultants')
        .select('*')
        .eq('id', created.id)
        .maybeSingle();
      if (fetchErr) console.error('Failed to re-fetch created consultant:', extractErrorMessage(fetchErr));
      return NextResponse.json({ consultant: fetched || created });
    }

    return NextResponse.json({ consultant: created });
  } catch (err) {
    console.error('Error creating consultant:', err);
    const message = err instanceof Error ? err.message : String(err);
    // Detect common Supabase missing-table error and return actionable guidance
    if (message.includes("Could not find the table") || message.includes('schema cache')) {
      const createSql = `-- Create consultants table
CREATE TABLE public.consultants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  title text,
  picture_url text,
  booking_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
`;
      return NextResponse.json({
        error: `Table \"public.consultants\" not found. Run the SQL to create it in your Supabase project SQL editor or via migration.`,
        create_table_sql: createSql,
      }, { status: 500 });
    }

    return NextResponse.json({ error: `Failed to create consultant: ${message}` }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();
    const { id } = body;
    if (!id) return NextResponse.json({ error: 'Consultant ID is required' }, { status: 400 });

    const updatePayload: any = {
      full_name: body.full_name,
      title: body.title,
      picture_url: body.picture_url,
      booking_url: body.booking_url,
      is_active: body.is_active,
    };

    const { data: updateData, error: updateError } = await supabase
      .from('consultants')
      .update(updatePayload)
      .eq('id', id)
      .select();

    if (updateError) {
      const msg = extractErrorMessage(updateError);
      console.error('Error updating consultant:', msg);
      throw new Error(msg);
    }

    const updated = updateData?.[0] || null;
    if (updated?.id) {
      const { data: fetched, error: fetchErr } = await supabase
        .from('consultants')
        .select('*')
        .eq('id', updated.id)
        .maybeSingle();
      if (fetchErr) console.error('Failed to re-fetch updated consultant:', extractErrorMessage(fetchErr));
      return NextResponse.json({ consultant: fetched || updated });
    }

    return NextResponse.json({ consultant: updated });
  } catch (err) {
    console.error('Error updating consultant:', err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Failed to update consultant: ${message}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Consultant ID is required' }, { status: 400 });

    const { error } = await supabase.from('consultants').delete().eq('id', id);
    if (error) {
      const msg = extractErrorMessage(error);
      console.error('Error deleting consultant:', msg);
      throw new Error(msg);
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting consultant:', err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Failed to delete consultant: ${message}` }, { status: 500 });
  }
}
