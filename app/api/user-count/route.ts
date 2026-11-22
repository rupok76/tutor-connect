import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
  const { count: students } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'student');
    
  const { count: teachers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'teacher');

  return NextResponse.json({ students: students || 0, teachers: teachers || 0 });
}