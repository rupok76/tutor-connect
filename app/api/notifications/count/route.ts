import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const role = searchParams.get('role');

  if (!userId || !role) return NextResponse.json({ error: 'Missing params' }, { status: 400 });

  let query = supabase.from('notifications').select('*', { count: 'exact', head: true });
  
  // স্টুডেন্ট হলে তার কাছে আসা মেসেজ কাউন্ট করবে
  if (role === 'student') {
    query = query.eq('student_id', userId);
  } else {
    // টিচার হলে সে যেসব মেসেজ পাঠিয়েছে তা কাউন্ট করবে (অথবা সে যেসব নোটিফিকেশন পেয়েছে)
    query = query.eq('teacher_id', userId);
  }

  const { count, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ count: count || 0 });
}