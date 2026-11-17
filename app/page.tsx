'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

export default function Home() {
  const { data: session, status } = useSession();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0, filter: "blur(10px)" },
    visible: { y: 0, opacity: 1, filter: "blur(0px)", transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <div className="min-h-screen bg-[#03050a] flex flex-col items-center justify-center p-6 relative overflow-hidden text-white perspective-1000 pt-24 pb-12">
      
      {/* ব্যাকগ্রাউন্ড গ্লো */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600 rounded-full mix-blend-screen filter blur-[180px]"
      ></motion.div>
      
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1], y: [0, -50, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600 rounded-full mix-blend-screen filter blur-[180px]"
      ></motion.div>

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none"></div>

      <motion.div 
        className="z-10 w-full max-w-6xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ট্রাস্ট ব্যাজ */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.15)]">
          <span className="text-blue-400 text-lg">✨</span>
          <span className="text-sm font-bold text-blue-300">বাংলাদেশের সেরা টিউশন প্ল্যাটফর্ম</span>
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/60 mb-6 tracking-tighter drop-shadow-[0_0_40px_rgba(255,255,255,0.1)]"
        >
          TutorConnect <br className="hidden md:block"/>
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">BD</span>
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto font-medium leading-relaxed"
        >
          টেকনাফ থেকে তেঁতুলিয়া—সারাদেশের সেরা শিক্ষকদের সাথে যুক্ত হোন সরাসরি।
          <span className="text-slate-400 text-base md:text-lg mt-2 block">
            কোনো এজেন্সি নেই, ০% কমিশন কাটা হয় না। আপনার পড়াশোনা, আপনার নিয়মে।
          </span>
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 text-sm text-slate-400 mb-12">
          <span className="flex items-center gap-1"><span className="text-green-400">✓</span> ছেলে-মেয়ে আলাদা প্রোফাইল</span>
          <span className="flex items-center gap-1"><span className="text-green-400">✓</span> ১ মিনিটে সাইনআপ</span>
          <span className="flex items-center gap-1"><span className="text-green-400">✓</span> সরাসরি কথা বলার সুযোগ</span>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-center mb-16">
          
          {/* Student Card */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02, rotateY: 5, rotateX: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-full md:w-96 p-10 bg-gradient-to-b from-white/[0.08] to-transparent backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group flex flex-col relative overflow-hidden preserve-3d"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="text-7xl mb-6 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 text-center transform-gpu drop-shadow-2xl">👨‍🎓</div>
            <h2 className="text-3xl font-bold text-white mb-3 text-center">আমি ছাত্র/ছাত্রী</h2>
            <p className="text-slate-400 text-center mb-8 flex-1 leading-relaxed">আমার প্রয়োজনীয় বিষয়ের সেরা শিক্ষক খুঁজে নিন, যিনি আমাকে সহজভাবে বুঝিয়ে দিতে পারবেন।</p>
            
            <Link href="/signup/student" className="relative z-20 block w-full py-4 bg-green-500 text-[#03050a] rounded-2xl font-bold text-lg text-center shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] hover:scale-[1.02] transition-all duration-300">
              ফ্রি সাইনআপ করুন
            </Link>
          </motion.div>

          {/* Teacher Card */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02, rotateY: -5, rotateX: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-full md:w-96 p-10 bg-gradient-to-b from-white/[0.08] to-transparent backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group flex flex-col relative overflow-hidden preserve-3d"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="text-7xl mb-6 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 text-center transform-gpu drop-shadow-2xl">👨‍🏫</div>
            <h2 className="text-3xl font-bold text-white mb-3 text-center">আমি শিক্ষক</h2>
            <p className="text-slate-400 text-center mb-8 flex-1 leading-relaxed">আমি কোনো এজেন্সিকে কমিশন দিতে চাই না। আমি সরাসরি ছাত্র খুঁজতে চাই।</p>
            
            <Link href="/signup/teacher" className="relative z-20 block w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg text-center shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:scale-[1.02] transition-all duration-300">
              টিচার সাইনআপ করুন
            </Link>
          </motion.div>

        </div>

        {/* তোমার লেখা বড় সেকশন */}
        <motion.div variants={itemVariants} className="max-w-5xl mx-auto bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 rounded-[2.5rem] p-8 md:p-12 text-left relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8 border-b border-white/10 pb-4 text-center md:text-left">
            কেন TutorConnect BD আপনার জন্য সেরা?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-300 text-base md:text-lg leading-relaxed relative z-10">
            
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                <span>🎓</span> ছাত্র/ছাত্রীদের জন্য
              </h3>
              <p className="mb-3">
                আমরা বিশ্বাস করি, <strong className="text-white">প্রতিটি ছাত্রের শেখার ধরন আলাদা।</strong> এখানে আপনি আপনার পছন্দমতো শিক্ষক বাছাই করতে পারবেন। লগইন করার পর শিক্ষকের সাথে সরাসরি কথা বলে আপনি নিশ্চিত হতে পারবেন—সে কি আপনার সব প্রশ্নের উত্তর দিতে পারবে?
              </p>
              <p className="mb-3">
                বড় কোনো কোর্সে টাকা নষ্ট করার দরকার নেই। আপনি ঠিক যে টপিকটি বুঝতে পারছেন না, শুধু সেই নির্দিষ্ট টপিকের জন্য একজন দক্ষ শিক্ষক খুঁজে নিন। এতে বাঁচবে আপনার <strong className="text-green-400">মূল্যবান সময় এবং অর্থ</strong>।
              </p>
              <p className="text-sm italic text-slate-400 border-l-2 border-green-500 pl-3">
                "ইউটিউবে একসাথে হাজারো ছাত্রের মাঝে ক্লাস করলে অনেক কিছুই মিস হয়ে যায়, প্রশ্ন করার সুযোগ থাকে না। এখানে আপনি শিক্ষকের ডেমো ক্লাস দেখে নিজেই বেছে নিতে পারবেন—কে আপনার জন্য পারফেক্ট।"
              </p>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                <span>👨‍🏫</span> শিক্ষকদের জন্য
              </h3>
              <p className="mb-3">
                "ভালো বিশ্ববিদ্যালয়ের স্টুডেন্ট মানেই সে সেরা শিক্ষক"—এই ভুল ধারণাটি আমরা ভাঙতে চাই। একজন শিক্ষক কতটা ভালো, তা নির্ভর করে সে ছাত্রকে <strong className="text-white">কত নিখুঁতভাবে বুঝিয়ে দিতে পারেন</strong>, তার ওপর।
              </p>
              <p className="mb-3">
                এখানে আপনি আপনার স্বাধীনতা পাবেন। প্রতি টপিকের জন্য আপনার নিজের মতো চার্জ নির্ধারণ করে রাখতে পারবেন। আর চাইলে স্টুডেন্টের সাথে <strong className="text-green-400">নেগোসিয়েট করে</strong> নিজের পারিশ্রমিক ঠিক করে নিতে পারবেন।
              </p>
              <p className="text-sm italic text-slate-400 border-l-2 border-blue-500 pl-3">
                "কোনো এজেন্সির দালালি নয়, সবটুকু আপনার। আপনি যেভাবে পড়াতে স্বাচ্ছন্দ্য বোধ করেন, সেভাবেই পড়ান।"
              </p>
            </div>

          </div>

          {/* নতুন যোগ করা How it works বাটন */}
          <div className="mt-10 text-center relative z-10 border-t border-white/10 pt-8">
            <p className="text-slate-400 mb-4">কীভাবে এই প্ল্যাটফর্মটি ব্যবহার করবেন তা জানতে চান?</p>
            <Link 
              href="/how-it-works"
              className="inline-block bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              কীভাবে কাজ করে? (How it works) →
            </Link>
          </div>
        </motion.div>

        {/* মোটিভেশনাল বার্তা */}
        <motion.div variants={itemVariants} className="mt-16 text-center">
          <p className="text-lg md:text-xl text-blue-300 italic font-medium max-w-3xl mx-auto">
            "শিক্ষকরা জাতির মেরুদণ্ড। একজন ভালো শিক্ষক কখনোই একজন সাধারণ ছাত্রকে অসাধারণ উচ্চতায় পৌঁছে দিতে পারেন।"
          </p>
          <p className="text-sm text-slate-500 mt-3">- ড. এ. পি. জে. আব্দুল কালাম</p>
        </motion.div>

      </motion.div>
    </div>
  );
}