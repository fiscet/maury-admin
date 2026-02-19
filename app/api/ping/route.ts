import { createAdminClient } from '@/utils/supabase/admin-client';
import { NextResponse } from 'next/server';

async function handlePing() {
  const supabase = createAdminClient();

  // Get today's date at midnight (start of day)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get tomorrow's date at midnight (end of day boundary)
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Check if there's already a ping for today
  const { data: existingPing, error: queryError } = await supabase
    .from('ping')
    .select('id')
    .gte('created_at', today.toISOString())
    .lt('created_at', tomorrow.toISOString())
    .limit(1);

  if (queryError) {
    return NextResponse.json(
      { error: 'Database query failed' },
      { status: 500 }
    );
  }

  // If a ping already exists for today, return 400 error
  if (existingPing && existingPing.length > 0) {
    return NextResponse.json(
      { error: 'Already pinged today' },
      { status: 400 }
    );
  }

  // Insert the new ping with 'pinged' in the source column
  const { error: insertError } = await supabase.from('ping').insert({
    source: 'pinged',
  });

  if (insertError) {
    return NextResponse.json(
      { error: 'Failed to insert ping' },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: 'Pinged today' }, { status: 200 });
}

// GET handler for Vercel Cron Jobs
export async function GET() {
  return handlePing();
}

// POST handler for manual API calls
export async function POST() {
  return handlePing();
}
