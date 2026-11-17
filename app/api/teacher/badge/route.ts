import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

// টিচারের বর্তমান ব্যাজ ও ভিডিও স্ট্যাটাস আনা
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const teacherId = searchParams.get('teacherId');

  if (!teacherId) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const { data: profile, error } = await supabase
    .from('teacher_profiles')
    .select('is_booked_badge, badge_message, demo_video_url')
    .eq('user_id', teacherId)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile });
}

// ব্যাজ ও ভিডিও আপডেট করা
export async function POST(req: Request) {
  try {
    const { teacherId, isBooked, badgeMessage, demoVideoUrl } = await req.json();

    const { error } = await supabase
      .from('teacher_profiles')
      .update({
        is_booked_badge: isBooked,
        badge_message: badgeMessage,
        demo_video_url: demoVideoUrl // নতুন যোগ হলো
      })
      .eq('user_id', teacherId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}