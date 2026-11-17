import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { senderId, senderRole, receiverId, message } = await req.json();

    if (!senderId || !receiverId || !message) {
      return NextResponse.json({ error: 'সব তথ্য দিন' }, { status: 400 });
    }

    // যেহেতু আমরা চ্যাটের জন্য নতুন টেবিল বানাইনি, তাই notifications টেবিলেই রিপ্লাই সেভ করছি
    // senderRole দেখে বুঝবো কে পাঠাচ্ছে (স্টুডেন্ট নাকি টিচার)
    const insertData = senderRole === 'student' 
      ? { teacher_id: receiverId, student_id: senderId, message: message, status: 'pending' } // স্টুডেন্ট রিপ্লাই দিলে টিচার আইডি রিসিভার হবে
      : { teacher_id: senderId, student_id: receiverId, message: message, status: 'pending' }; // টিচার মেসেজ দিলে স্টুডেন্ট আইডি রিসিভার হবে

    const { error } = await supabase
      .from('notifications')
      .insert(insertData);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'সার্ভার এরর' }, { status: 500 });
  }
}