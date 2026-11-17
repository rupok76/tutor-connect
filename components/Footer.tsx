import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0a0f1c] border-t border-white/5 text-slate-400 py-12 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* ব্র্যান্ড সেকশন */}
        <div className="md:col-span-2">
          <Link href="/" className="text-2xl font-extrabold text-white mb-3 tracking-tight block">
            TutorConnect <span className="text-blue-500">BD</span>
          </Link>
          <p className="text-sm text-slate-500 mb-6 max-w-sm leading-relaxed">
            বাংলাদেশের সবচেয়ে নিরাপদ এবং স্মার্ট টিউশন প্ল্যাটফর্ম। শিক্ষক এবং শিক্ষার্থীদের সরাসরি যুক্ত করার নির্ভরযোগ্য মাধ্যম।
          </p>
          <p className="text-xs text-slate-600">© 2026 TutorConnect BD. All rights reserved.</p>
        </div>

        {/* কুইক লিংক */}
        <div>
          <h3 className="text-white font-bold mb-4">কুইক লিংক</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/how-it-works" className="hover:text-white transition">কীভাবে কাজ করে</Link></li>
            <li><Link href="/browse/teachers" className="hover:text-white transition">শিক্ষক ব্রাউজ</Link></li>
            <li><Link href="/browse/students" className="hover:text-white transition">ছাত্র ব্রাউজ</Link></li>
          </ul>
        </div>

        {/* সাপোর্ট ও আইনি */}
        <div>
          <h3 className="text-white font-bold mb-4">সাপোর্ট</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <span className="text-slate-500 text-xs block mb-1">সাহায্যের জন্য:</span>
              <a href="tutorconnectbd@gmail.com" className="text-blue-400 hover:text-blue-300 transition font-medium">support@tutorconnectbd.com</a>
            </li>
            <li className="pt-2"><Link href="/terms" className="hover:text-white transition">শর্তাবলী (Terms & Conditions)</Link></li>
          </ul>
        </div>

      </div>
    </footer>
  );
}