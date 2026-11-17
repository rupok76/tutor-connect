import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gender = searchParams.get('gender');

  if (!gender) return NextResponse.json({ error: 'Gender is required' }, { status: 400 });

  // সমলিঙ্গের স্টুডেন্টদের ডাটা আনা হচ্ছে (শুধু যারা পেইড)
  const { data: students, error } = await supabase
    .from('users')
    .select(`
      id, name, education, gender, photo_url,
      student_topics (topics (name))
    `)
    .eq('role', 'student')
    .eq('gender', gender)
    .eq('is_paid', true); // 👈 এখানে true করা হলো

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ students: students || [] });
}