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

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ books: data || [] });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json({ error: 'Failed to fetch books', books: [] }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    const body = await request.json();
    const { 
      title, 
      author, 
      description, 
      cover_color, 
      genre,
      cover_image_url,
      affiliate_link,
      amazon_affiliate_link,
      flipkart_affiliate_link,
      recommended_by,
      recommendation_reason,
      rating,
    } = body;

    if (!title || !author) {
      return NextResponse.json({ error: 'Title and author are required' }, { status: 400 });
    }

    // Affiliate links are optional when creating a book; if provided, they will be saved.
    const insertPayload: any = {
      title,
      author,
      description,
      cover_color: cover_color || '#9b87f5',
      genre: genre || 'Self-Help',
    };

    if (cover_image_url !== undefined) insertPayload.cover_image_url = cover_image_url;
    if (affiliate_link !== undefined) insertPayload.affiliate_link = affiliate_link;
    if (amazon_affiliate_link !== undefined) insertPayload.amazon_affiliate_link = amazon_affiliate_link;
    if (flipkart_affiliate_link !== undefined) insertPayload.flipkart_affiliate_link = flipkart_affiliate_link;

    if (recommended_by !== undefined) insertPayload.recommended_by = recommended_by;
    if (recommendation_reason !== undefined) insertPayload.recommendation_reason = recommendation_reason;

  if (typeof rating === 'number') insertPayload.rating = rating;

    const { data, error } = await supabase
      .from('books')
      .insert(insertPayload)
      .select();

    if (error) {
      console.error('Error creating book:', error);
      throw error;
    }

    // cover_image_url and affiliate_link are included in insertPayload where possible.

    // Return created book (should include persisted fields)
    const createdId = data?.[0]?.id;
    if (createdId) {
      const { data: fetched, error: fetchErr } = await supabase
        .from('books')
        .select('*')
        .eq('id', createdId)
        .maybeSingle();
      if (fetchErr) {
        console.error('Failed to re-fetch created book:', fetchErr);
      }
      return NextResponse.json({ book: fetched || data?.[0] });
    }

    return NextResponse.json({ book: data?.[0] });
  } catch (error) {
    console.error('Error creating book:', error);
    const code = (error as any)?.code;
    const message = (error as any)?.message || 'Failed to create book';
    return NextResponse.json({ error: message, code }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    const updatePayload: any = {
      title: body.title,
      author: body.author,
      description: body.description,
      cover_color: body.cover_color,
      genre: body.genre,
      affiliate_link: body.affiliate_link,
      amazon_affiliate_link: body.amazon_affiliate_link,
      flipkart_affiliate_link: body.flipkart_affiliate_link,
    };

    if (body.cover_image_url !== undefined) updatePayload.cover_image_url = body.cover_image_url;

    if (body.recommended_by !== undefined) updatePayload.recommended_by = body.recommended_by;
    if (body.recommendation_reason !== undefined) updatePayload.recommendation_reason = body.recommendation_reason;

  if (body.rating !== undefined) updatePayload.rating = body.rating;

    const { data: updateData, error: updateError } = await supabase
      .from('books')
      .update(updatePayload)
      .eq('id', id)
      .select();

    if (updateError) {
      console.error('Error updating book:', updateError);
      throw updateError;
    }

    // Return updated book (should include persisted fields)
    const updatedId = updateData?.[0]?.id || id;
    if (updatedId) {
      const { data: fetched, error: fetchErr } = await supabase
        .from('books')
        .select('*')
        .eq('id', updatedId)
        .maybeSingle();
      if (fetchErr) {
        console.error('Failed to re-fetch updated book:', fetchErr);
      }
      return NextResponse.json({ book: fetched || updateData?.[0] });
    }

    return NextResponse.json({ book: updateData?.[0] });
  } catch (error) {
    console.error('Error updating book:', error);

    const code = (error as any)?.code;
    const message = (error as any)?.message || 'Failed to update book';

    // Common local setup issue: migrations not applied to the Supabase project.
    if (code === 'PGRST204' && /cover_image_url/i.test(message)) {
      return NextResponse.json(
        {
          code,
          error:
            "Database schema is missing 'books.cover_image_url'. Apply the Supabase migrations or run: ALTER TABLE books ADD COLUMN IF NOT EXISTS cover_image_url text;",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: message, code }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
}
