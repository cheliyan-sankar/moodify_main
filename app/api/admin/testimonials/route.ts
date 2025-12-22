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

// GET - Fetch all testimonials
export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ testimonials: data });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

// POST - Create new testimonial
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    const body = await request.json();
    const { user_name, user_title, feedback, rating, avatar_url, is_active, display_order } = body;

    if (!user_name || !feedback) {
      return NextResponse.json({ error: 'User name and feedback are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        user_name,
        user_title: user_title || null,
        feedback,
        rating: rating || 5,
        avatar_url: avatar_url || null,
        is_active: is_active !== false,
        display_order: display_order || 0,
      })
      .select();

    if (error) throw error;

    return NextResponse.json({ testimonial: data[0] });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}

// PUT - Update testimonial
export async function PUT(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    const body = await request.json();
    const { id, user_name, user_title, feedback, rating, avatar_url, is_active, display_order } = body;

    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('testimonials')
      .update({
        user_name,
        user_title,
        feedback,
        rating,
        avatar_url,
        is_active,
        display_order,
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json({ testimonial: data[0] });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

// DELETE - Delete testimonial
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
