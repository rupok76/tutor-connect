import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const role = searchParams.get('role');

  if (!userId || !role) return NextResponse.json({ error: 'Missing params' }, { status: 400 });

  let query = supabase.from('notifications').select(`
    id, message, status, created_at,
    teacher:teacher_id (name),
    student:student_id (name)
  `);

  if (role === 'student') {
    query = query.eq('student_id', userId);
  } else {
    query = query.eq('teacher_id', userId);
  }

  const { data: messages, error } = await query.order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ messages });
}