import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId, photoUrl } = await req.json();

    if (!userId || !photoUrl) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const { error } = await supabase
      .from('users')
      .update({ photo_url: photoUrl })
      .eq('id', userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}