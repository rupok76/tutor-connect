import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const teacherId = params.id;

    const { data: teacher, error: teacherError } = await supabase
      .from('users')
      .select(`
        id, name, email, phone, education, gender, photo_url,
        profile:teacher_profiles (bio, per_class_charge, is_booked_badge, badge_message, demo_video_url)
      `)
      .eq('id', teacherId)
      .single();

    if (teacherError || !teacher) {
      return NextResponse.json({ error: 'শিক্ষক পাওয়া যায়নি' }, { status: 404 });
    }

    const { data: subjects } = await supabase
      .from('teacher_subjects')
      .select(`
        subject_id,
        subjects (name)
      `)
      .eq('teacher_id', teacherId);

    return NextResponse.json({ teacher, subjects: subjects || [] });
  } catch (error) {
    return NextResponse.json({ error: 'সার্ভার এরর' }, { status: 500 });
  }
}