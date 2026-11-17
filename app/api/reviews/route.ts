import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

// ১. নতুন রিভিউ সেভ করা (POST)
export async function POST(req: Request) {
  try {
    const { teacherId, studentId, rating, comment } = await req.json();

    if (!teacherId || !studentId || !rating) {
      return NextResponse.json({ error: 'সব তথ্য দিন' }, { status: 400 });
    }

    const { error } = await supabase
      .from('reviews')
      .insert({ teacher_id: teacherId, student_id: studentId, rating, comment });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'সার্ভার এরর' }, { status: 500 });
  }
}

// ২. নির্দিষ্ট টিচারের রিভিউগুলো আনা (GET)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const teacherId = searchParams.get('teacherId');

  if (!teacherId) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const { data: reviews, error } = await supabase
    .from('reviews')
    .select(`
      id, rating, comment, created_at,
      student:student_id (name, photo_url)
    `)
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reviews });
}