import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { teacherId, studentId, message } = await req.json();

    if (!teacherId || !studentId || !message) {
      return NextResponse.json({ error: 'সব তথ্য দিন' }, { status: 400 });
    }

    const { error } = await supabase
      .from('notifications')
      .insert({
        teacher_id: teacherId,
        student_id: studentId,
        message: message,
        status: 'pending'
      });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'সার্ভার এরর' }, { status: 500 });
  }
}