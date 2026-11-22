'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#03050a] pt-24 pb-16 px-6 md:px-10 text-white relative overflow-hidden">
      
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-extrabold text-white mb-2">Terms & Conditions</h1>
          <p className="text-slate-400 mb-8 border-b border-white/10 pb-4">সর্বশেষ আপডেট: নভেম্বর ২০২৬</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-8 text-slate-300 leading-relaxed text-sm md:text-base">
          
          <p>
            TutorConnect BD-তে আপনাকে স্বাগতম। আমাদের ওয়েবসাইট এবং সার্ভিস ব্যবহার করার আগে অনুগ্রহ করে এই শর্তাবলী (Terms & Conditions) মনোযোগ সহকারে পড়ুন। সাইটটি ব্যবহার করার অর্থ হলো আপনি এই শর্তাবলীতে সম্মত হয়েছেন।
          </p>

          <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold text-blue-400 mb-3">১. প্ল্যাটফর্মের প্রকৃতি (Nature of Platform)</h2>
            <p className="mb-2">TutorConnect BD শুধুমাত্র শিক্ষক এবং শিক্ষার্থীদের (বা অভিভাবকদের) মধ্যে যোগাযোগ স্থাপনের একটি ডিজিটাল মাধ্যম (Directory)।</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>আমরা কোনো টিউশন এজেন্সি নই। আমরা কোনো শিক্ষককে নিয়োগ দিই না বা কোনো শিক্ষার্থীর পড়াশোনার দায়ভার নিই না।</li>
              <li>শিক্ষক এবং শিক্ষার্থীর মধ্যে ক্লাসের মান, সময়, পারিশ্রমিক (পেমেন্ট) এবং অন্যান্য চুক্তি সম্পূর্ণ তাদের নিজেদের মধ্যে।</li>
              <li>কোনো আর্থিক লেনদেন, প্রতারণা বা ক্লাসের মান খারাপ হলে তার দায়ভার TutorConnect BD বহন করবে না।</li>
            </ul>
          </section>

          <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold text-blue-400 mb-3">২. অ্যাকাউন্ট তৈরি এবং ফি</h2>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>শিক্ষার্থীদের জন্য এককালীন সাইনআপ ফি ৬০৳ এবং শিক্ষকদের জন্য ১০০৳। এই ফি অ-ফেরতযোগ্য (Non-refundable)।</li>
              <li>পেমেন্টের ট্রানজেকশন আইডি (TrxID) অ্যাডমিন কর্তৃক যাচাই হওয়ার পর অ্যাকাউন্ট সচল হবে।</li>
              <li>ভুয়া তথ্য (Fake Info) বা ফেক TrxID দিলে অ্যাকাউন্ট কোনো নোটিশ ছাড়াই স্থায়ীভাবে ব্লক করা হবে।</li>
            </ul>
          </section>

          <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold text-blue-400 mb-3">৩. আচরণবিধি ও নিরাপত্তা</h2>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>আমাদের প্ল্যাটফর্মে ছেলে এবং মেয়েদের জন্য আলাদা (Same Gender) প্রোফাইল নীতি কঠোরভাবে মানা হয়।</li>
              <li>কোনো প্রকার অশ্লীল মেসেজ, হয়রানি বা হুমকিমূলক আচরণ করলে তাৎক্ষণিকভাবে অ্যাকাউন্ট ব্লক করা হবে।</li>
              <li>প্ল্যাটফর্মের বাইরে গিয়ে যোগাযোগের সময় নিজের নিরাপত্তার দায়ভার আপনাকেই নিতে হবে।</li>
            </ul>
          </section>

          <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold text-blue-400 mb-3">৪. দায়মুক্তি (Limitation of Liability)</h2>
            <p>
              TutorConnect BD ব্যবহারের ফলে সরাসরি বা পরোক্ষভাবে কোনো ক্ষতি, আর্থিক লোকসান, বা মানসিক কষ্টের জন্য আমরা দায়ী থাকব না। শিক্ষকদের প্রোফাইলে দেওয়া তথ্য (ডিগ্রি, ছবি, ভিডিও) তাদের নিজেদের দেওয়া; আমরা শুধুমাত্র মৌলিক যাচাই করি। চূড়ান্ত সিদ্ধান্ত নেওয়ার আগে নিজ দায়িত্বে যাচাই করে নিন।
            </p>
          </section>

          <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold text-blue-400 mb-3">৫. শর্তাবলীতে পরিবর্তন</h2>
            <p>
              TutorConnect BD যেকোনো সময় কোনো পূর্ব নোটিশ ছাড়াই এই শর্তাবলী পরিবর্তন, সংশোধন বা বাতিল করার সম্পূর্ণ অধিকার সংরক্ষণ করে। পরিবর্তনের পর আপনি যদি প্ল্যাটফর্ম ব্যবহার চালিয়ে যান, তবে তা নতুন শর্তাবলীর প্রতি আপনার সম্মতি হিসেবে গণ্য হবে।
            </p>
          </section>

          <p className="text-center pt-8 border-t border-white/10 text-slate-500">
            এই শর্তাবলী সম্পর্কে কোনো প্রশ্ন থাকলে যোগাযোগ করুন: <a href="mailto:tutorconnectbd@gmail.com" className="text-blue-400 hover:underline">tutorconnectbd@gmail.com</a>
          </p>

        </motion.div>
      </div>
    </div>
  );
}