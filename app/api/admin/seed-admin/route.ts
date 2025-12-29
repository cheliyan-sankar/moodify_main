import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Missing Supabase configuration' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const adminEmail = 'admin@moodlift.com';
    const adminPassword = 'MoodLiftAdmin2024!';

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    });

    if (authError) {
      console.error('Auth creation error:', authError);
      return NextResponse.json(
        { error: `Failed to create auth user: ${authError.message}` },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'User created but no ID returned' },
        { status: 400 }
      );
    }

    // Add to admin_users table
    const { error: adminError } = await supabase
      .from('admin_users')
      .insert({
        id: authData.user.id,
        email: adminEmail,
        role: 'admin',
      });

    if (adminError) {
      console.error('Admin insert error:', adminError);
      return NextResponse.json(
        { error: `Failed to add admin role: ${adminError.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Default admin user created successfully',
      email: adminEmail,
    });
  } catch (error) {
    console.error('Seed admin error:', error);
    return NextResponse.json(
      { error: 'Failed to seed admin user' },
      { status: 500 }
    );
  }
}
