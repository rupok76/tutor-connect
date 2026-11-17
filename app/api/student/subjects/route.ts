import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

// ১. সাবজেক্ট সেভ করা (POST)
export async function POST(req: Request) {
  try {
    const { studentId, subjects } = await req.json();

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 });
    }

    // আগের সাবজেক্ট ডিলিট করা
    await supabase.from('student_subjects').delete().eq('student_id', studentId);

    if (subjects && subjects.length > 0) {
      const insertData = [];
      
      for (const subName of subjects) {
        // সাবজেক্ট টেবিলে নামটা আছে কিনা চেক করা
        const { data: existingSub } = await supabase
          .from('subjects')
          .select('id')
          .eq('name', subName)
          .maybeSingle();

        let subjectId;

        if (existingSub) {
          subjectId = existingSub.id;
        } else {
          // না থাকলে নতুন করে সাবজেক্ট যোগ করা
          const { data: newSub, error: insertErr } = await supabase
            .from('subjects')
            .insert({ name: subName })
            .select('id')
            .single();
            
          if (insertErr) {
            console.log("Error inserting subject:", subName, insertErr);
          }
          if (newSub) subjectId = newSub.id;
        }

        if (subjectId) {
          insertData.push({ student_id: studentId, subject_id: subjectId });
        }
      }

      // স্টুডেন্টের প্রোফাইলে সাবজেক্টগুলো যুক্ত করা
      if (insertData.length > 0) {
        const { error: mapErr } = await supabase.from('student_subjects').insert(insertData);
        if (mapErr) {
          console.log("Mapping Error:", mapErr);
          return NextResponse.json({ error: mapErr.message }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.log("Server Error in saving student subjects:", error);
    return NextResponse.json({ error: 'সেভ করা যায়নি' }, { status: 500 });
  }
}

// ২. সেভ করা সাবজেক্ট আনা (GET)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('studentId');

  if (!studentId) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const { data: subjects, error } = await supabase
    .from('student_subjects')
    .select(`
      subject_id,
      subjects (name)
    `)
    .eq('student_id', studentId);

  if (error) {
    console.log("Error fetching student subjects:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ subjects });
}