import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const { data: user, error } = await supabase
    .from('users')
    .select(`
      name, education, phone, email,
      teacher_profiles (bio, per_class_charge)
    `)
    .eq('id', userId)
    .single();

  if (error) {
    console.log("User Profile GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formattedUser = {
    name: user.name,
    education: user.education,
    phone: user.phone || '',
    email: user.email || '',
    profile: user.teacher_profiles && user.teacher_profiles.length > 0 ? user.teacher_profiles[0] : null
  };

  return NextResponse.json({ user: formattedUser });
}

export async function POST(req: Request) {
  try {
    const { userId, role, name, education, phone, email, bio, per_class_charge } = await req.json();

    const { error: userError } = await supabase
      .from('users')
      .update({ name, education, phone, email })
      .eq('id', userId);

    if (userError) throw userError;

    if (role === 'teacher') {
      const { error: profileError } = await supabase
        .from('teacher_profiles')
        .update({ bio, per_class_charge: parseInt(per_class_charge) })
        .eq('user_id', userId);

      if (profileError) throw profileError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'সার্ভার এরর' }, { status: 500 });
  }
}