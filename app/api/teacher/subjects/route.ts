import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

// ১. সাবজেক্ট সেভ করা (POST)
export async function POST(req: Request) {
  try {
    const { teacherId, subjects } = await req.json();

    // আগের সব সাবজেক্ট ডিলিট করা
    await supabase.from('teacher_subjects').delete().eq('teacher_id', teacherId);

    if (subjects && subjects.length > 0) {
      const insertData = [];
      
      for (const subName of subjects) {
        // ডাটাবেসে সাবজেক্টটা আছে কিনা চেক করা
        const { data: existingSub } = await supabase
          .from('subjects')
          .select('id')
          .eq('name', subName)
          .maybeSingle();

        let subjectId;

        if (existingSub) {
          subjectId = existingSub.id;
        } else {
          // যদি না থাকে, তবে নতুন করে সাবজেক্টটা ডাটাবেসে যোগ করা
          const { data: newSub } = await supabase
            .from('subjects')
            .insert({ name: subName })
            .select('id')
            .single();
          if (newSub) subjectId = newSub.id;
        }

        if (subjectId) {
          insertData.push({ teacher_id: teacherId, subject_id: subjectId });
        }
      }

      // টিচারের প্রোফাইলে সাবজেক্টগুলো যুক্ত করা
      if (insertData.length > 0) {
        await supabase.from('teacher_subjects').insert(insertData);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving subjects:", error);
    return NextResponse.json({ error: 'সেভ করা যায়নি' }, { status: 500 });
  }
}

// ২. টিচারের সিলেক্ট করা সাবজেক্ট আনা (GET)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const teacherId = searchParams.get('teacherId');

  if (!teacherId) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const { data: subjects, error } = await supabase
    .from('teacher_subjects')
    .select(`
      subject_id,
      subjects (name)
    `)
    .eq('teacher_id', teacherId);

  if (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ subjects });
}