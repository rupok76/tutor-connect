import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, gender, education, per_class_charge, bio, subjects } = body;

    // ১. ভ্যালিডেশন
    if (!name || !email || !password || !gender || !education || !per_class_charge) {
      return NextResponse.json({ error: 'সব তথ্য পূরণ করুন' }, { status: 400 });
    }

    // ২. ইমেইল চেক
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json({ error: 'এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে' }, { status: 400 });
    }

    // ৩. পাসওয়ার্ড হ্যাশ
    const password_hash = await bcrypt.hash(password, 10);

    // ৪. 'users' টেবিলে সেভ
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        role: 'teacher',
        name,
        email,
        password_hash,
        gender,
        education,
        is_paid: false,
      })
      .select()
      .single();

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    // ৫. 'teacher_profiles' টেবিলে সেভ
    const { error: profileError } = await supabase
      .from('teacher_profiles')
      .insert({
        user_id: user.id,
        per_class_charge: parseInt(per_class_charge),
        bio: bio,
      });

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // ৬. সাবজেক্ট সেভ করা
    if (subjects && subjects.length > 0) {
      const insertData = [];
      
      for (const subName of subjects) {
        const { data: existingSub } = await supabase
          .from('subjects')
          .select('id')
          .eq('name', subName)
          .maybeSingle();

        let subjectId;

        if (existingSub) {
          subjectId = existingSub.id;
        } else {
          const { data: newSub } = await supabase
            .from('subjects')
            .insert({ name: subName })
            .select('id')
            .single();
          if (newSub) subjectId = newSub.id;
        }

        if (subjectId) {
          insertData.push({ teacher_id: user.id, subject_id: subjectId });
        }
      }

      if (insertData.length > 0) {
        await supabase.from('teacher_subjects').insert(insertData);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'টিচার অ্যাকাউন্ট তৈরি হয়েছে', 
      user_id: user.id 
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: 'সার্ভার এরর হয়েছে' }, { status: 500 });
  }
}