import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId, amount, method, trxId } = await req.json();

    if (!userId || !trxId) {
      return NextResponse.json({ error: 'সব তথ্য দিন' }, { status: 400 });
    }

    // ডাটাবেসে পেমেন্ট ইনফো সেভ করা হচ্ছে
    const { data, error } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        amount: parseInt(amount),
        method: method,
        transaction_id: trxId,
        status: 'pending'
      })
      .select(); // সেভ হওয়া ডাটা চেক করার জন্য

    if (error) {
      console.log("PAYMENT API ERROR:", error); // টার্মিনালে আসল এরর দেখাবে
      if (error.code === '23505') {
        return NextResponse.json({ error: 'এই ট্রানজেকশন আইডি আগে ব্যবহৃত হয়েছে!' }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.log("SERVER ERROR:", err.message);
    return NextResponse.json({ error: 'সার্ভার এরর' }, { status: 500 });
  }
}