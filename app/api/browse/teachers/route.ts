import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const gender = searchParams.get('gender');
    const subject = searchParams.get('subject');

    if (!gender) return NextResponse.json({ error: 'Gender is required' }, { status: 400 });

    // ১. প্রথমে শুধু টিচারদের বেসিক ডাটা আনা (রিভিউ ছাড়া)
    let query = supabase
      .from('users')
      .select(`
        id, name, email, phone, education, gender, photo_url,
        teacher_profiles (bio, per_class_charge, is_booked_badge, badge_message)
      `)
      .eq('role', 'teacher')
      .eq('gender', gender)
      .eq('is_paid', true);

    const { data: teachers, error } = await query;

    if (error) {
      console.log("Teacher Fetch Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // ২. সব রিভিউ আলাদা করে আনা
    const { data: allReviews } = await supabase
      .from('reviews')
      .select('teacher_id, rating');

    // ৩. প্রতিটি টিচারের জন্য রেটিং ক্যালকুলেট করা
    const formattedTeachers = teachers?.map(teacher => {
      const teacherReviews = allReviews?.filter(r => r.teacher_id === teacher.id) || [];
      const totalRating = teacherReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = teacherReviews.length > 0 ? (totalRating / teacherReviews.length).toFixed(1) : '0.0';
      
      return {
        ...teacher,
        average_rating: avgRating,
        review_count: teacherReviews.length
      };
    });

    return NextResponse.json({ teachers: formattedTeachers || [] });
    
  } catch (error: any) {
    console.log("Server Error:", error.message);
    return NextResponse.json({ error: 'সার্ভার এরর' }, { status: 500 });
  }
}