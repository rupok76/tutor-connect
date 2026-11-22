'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const EDUCATION_DATA: { [key: string]: string[] } = {
  "ক্লাস ৬ - ৮ (জুনিয়র সেকেন্ডারি)": ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান", "বাংলাদেশ ও বিশ্বপরিচয়", "ধর্ম", "আইসিটি", "কৃষি শিক্ষা", "গার্হস্থ্য বিজ্ঞান"],
  "ক্লাস ৯ - ১০ (বিজ্ঞান)": ["পদার্থবিজ্ঞান", "রসায়ন", "জীববিজ্ঞান", "উচ্চতর গণিত", "সাধারণ গণিত", "বাংলা", "ইংরেজি", "আইসিটি", "বাংলাদেশ ও বিশ্বপরিচয়"],
  "ক্লাস ৯ - ১০ (মানবিক)": ["ভূগোল ও পরিবেশ", "ইতিহাস", "পৌরনীতি ও নাগরিকতা", "অর্থনীতি", "বাংলা", "ইংরেজি", "আইসিটি", "গার্হস্থ্য বিজ্ঞান", "কৃষি শিক্ষা"],
  "ক্লাস ৯ - ১০ (ব্যবসায় শিক্ষা)": ["হিসাববিজ্ঞান", "ফিন্যান্স ও ব্যাংকিং", "ব্যবসায় উদ্যোগ", "বাংলা", "ইংরেজি", "আইসিটি", "অর্থনীতি"],
  "এইচএসসি (বিজ্ঞান)": ["পদার্থবিজ্ঞান ১ম ও ২য় পত্র", "রসায়ন ১ম ও ২য় পত্র", "জীববিজ্ঞান ১ম ও ২য় পত্র", "উচ্চতর গণিত ১ম ও ২য় পত্র", "বাংলা", "ইংরেজি", "আইসিটি"],
  "এইচএসসি (মানবিক)": ["যুক্তিবিদ্যা", "ইসলামের ইতিহাস", "সমাজবিজ্ঞান", "সমাজকর্ম", "ভূগোল", "ইতিহাস", "পৌরনীতি", "অর্থনীতি", "মনোবিজ্ঞান", "বাংলা", "ইংরেজি", "আইসিটি"],
  "এইচএসসি (ব্যবসায় শিক্ষা)": ["হিসাববিজ্ঞান ১ম ও ২য় পত্র", "ব্যবসায় সংগঠন ও ব্যবস্থাপনা ১ম ও ২য় পত্র", "ফিন্যান্স, ব্যাংকিং ও বিমা ১ম ও ২য় পত্র", "উৎপাদন ব্যবস্থাপনা ও বিপণন ১ম ও ২য় পত্র", "বাংলা", "ইংরেজি", "আইসিটি"],
  "মেডিকেল ও হেলথ সায়েন্স": ["মেডিকেল ভর্তি প্রস্তুতি (MBBS)", "ডেন্টাল (BDS)", "নার্সিং", "ফার্মেসি", "ফিজিওথেরাপি", "মেডিকেল ল্যাব টেকনোলজি", "রেডিওলজি ও ইমেজিং", "পাবলিক হেলথ"],
  "ইঞ্জিনিয়ারিং (Engineering)": ["সিভিল ইঞ্জিনিয়ারিং (CE)", "কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং (CSE)", "ইলেকট্রিক্যাল অ্যান্ড ইলেকট্রনিক ইঞ্জিনিয়ারিং (EEE)", "মেকানিক্যাল ইঞ্জিনিয়ারিং (ME)", "কেমিক্যাল ইঞ্জিনিয়ারিং", "টেক্সটাইল ইঞ্জিনিয়ারিং", "বায়োমেডিক্যাল ইঞ্জিনিয়ারিং", "সফটওয়্যার ইঞ্জিনিয়ারিং", "বুয়েট/সুয়েট/কুয়েট অ্যাডমিশন", "আর্কিটেকচার"],
  "বিশুদ্ধ ও প্রায়োগিক বিজ্ঞান (Pure Science)": ["পদার্থবিজ্ঞান", "রসায়ন", "গণিত", "পরিসংখ্যান", "প্রাণিবিদ্যা (Zoology)", "উদ্ভিদবিদ্যা (Botany)", "মাইক্রোবায়োলজি", "বায়োকেমিস্ট্রি", "জেনেটিক ইঞ্জিনিয়ারিং", "পরিবেশ বিজ্ঞান", "ভূতত্ত্ব"],
  "কম্পিউটার ও আইটি (CSE/IT)": ["প্রোগ্রামিং (C/C++/Java/Python)", "ডাটা স্ট্রাকচার ও অ্যালগরিদম", "ডাটাবেস ম্যানেজমেন্ট", "কৃত্রিম বুদ্ধিমত্তা (AI)", "মেশিন লার্নিং", "সাইবার সিকিউরিটি", "ওয়েব ডেভেলপমেন্ট", "কম্পিউটার নেটওয়ার্কিং"],
  "ব্যবসায় প্রশাসন (BBA/Commerce)": ["হিসাববিজ্ঞান", "ফিন্যান্স", "মার্কেটিং", "ম্যানেজমেন্ট", "ব্যবসায়িক পরিসংখ্যান", "মাইক্রো ও ম্যাক্রো ইকোনমিক্স", "এইচআরএম", "সাপ্লাই চেইন ম্যানেজমেন্ট"],
  "মানবিক ও সমাজবিজ্ঞান (Arts & Social Science)": ["বাংলা সাহিত্য", "ইংরেজি সাহিত্য", "ইতিহাস", "দর্শন", "সমাজবিজ্ঞান", "রাষ্ট্রবিজ্ঞান", "অর্থনীতি", "নৃবিজ্ঞান", "আন্তর্জাতিক সম্পর্ক", "সাংবাদিকতা ও গণমাধ্যম"],
  "কৃষি ও প্রাণিসম্পদ": ["কৃষি শিক্ষা", "ভেটেরিনারি মেডিসিন", "মৎস্যবিদ্যা", "প্রাণিসম্পদ", "বনায়ন", "উদ্যানতত্ত্ব"],
  "আইন (Law)": ["এলএলবি (LLB)", "এলএলএম (LLM)", "সাংবিধানিক আইন", "ফৌজদারি আইন", "আন্তর্জাতিক আইন"]
};

export default function TeacherSignup() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', gender: '', education: '', per_class_charge: '', bio: ''
  });
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  
  const [isFreeAvailable, setIsFreeAvailable] = useState(false);
  const [signupType, setSignupType] = useState('paid');

  useEffect(() => {
    fetch('/api/user-count')
      .then(res => res.json())
      .then(data => {
        if (data.teachers < 200) {
          setIsFreeAvailable(true);
        }
      });
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleSubject = (subjectName: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectName) ? prev.filter(s => s !== subjectName) : [...prev, subjectName]
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/signup/teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, subjects: selectedSubjects, isFree: signupType === 'free' })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        setLoading(false);
      } else {
        if (signupType === 'free') {
          alert('ফ্রি সাইনআপ সফল হয়েছে! এখন লগইন করুন।');
          window.location.href = '/login';
        } else {
          alert('অ্যাকাউন্ট তৈরি হয়েছে! এখন ১০০৳ পেমেন্ট সম্পন্ন করুন।');
          window.location.href = `/payment?userId=${data.user_id}&amount=100&role=teacher`;
        }
      }
    } catch (error) {
      alert('নেটওয়ার্ক সমস্যা হয়েছে, আবার চেষ্টা করুন');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#03050a] flex items-center justify-center p-4 py-12 relative overflow-hidden text-white">
      
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>

      <div className="z-10 bg-white/[0.02] backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl w-full max-w-2xl border border-white/10">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Teacher Sign Up</h2>
          <p className="text-slate-400 text-sm mt-2 font-medium">ছাত্র খুঁজতে আপনার প্রোফাইল তৈরি করুন</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">পুরো নাম *</label>
              <input type="text" name="name" required onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-slate-500" placeholder="আপনার নাম" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">শিক্ষাগত যোগ্যতা *</label>
              <input type="text" name="education" required onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-slate-500" placeholder="যেমন: BSc in CSE" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">ইমেইল *</label>
              <input type="email" name="email" required onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-slate-500" placeholder="example@mail.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">পাসওয়ার্ড *</label>
              <input type="password" name="password" required onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-slate-500" placeholder="********" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">প্রতি ক্লাসের চার্জ (৳) *</label>
              <input type="number" name="per_class_charge" required onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-slate-500" placeholder="যেমন: 500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">লিঙ্গ (Gender) *</label>
              <div className="flex gap-6 bg-white/5 p-3 rounded-xl border border-white/10">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" value="male" required onChange={handleChange} className="w-4 h-4 text-blue-500 bg-white/10 border-white/20" />
                  <span className="font-semibold text-slate-300">পুরুষ</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" value="female" required onChange={handleChange} className="w-4 h-4 text-blue-500 bg-white/10 border-white/20" />
                  <span className="font-semibold text-slate-300">মহিলা</span>
                </label>
              </div>
            </div>
          </div>

          {/* ফ্রি সাইনআপ অপশন */}
          {isFreeAvailable && (
            <div>
              <label className="block text-sm font-bold text-blue-300 mb-2">সাইনআপ পদ্ধতি সিলেক্ট করুন *</label>
              <div className="flex flex-col md:flex-row gap-4 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="signupType" value="free" required onChange={() => setSignupType('free')} className="w-4 h-4 text-blue-500 bg-white/10 border-white/20" />
                  <span className="font-bold text-blue-400">ফ্রি সাইনআপ (প্রথম ২০০ জনের জন্য)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="signupType" value="paid" required onChange={() => setSignupType('paid')} className="w-4 h-4 text-blue-500 bg-white/10 border-white/20" />
                  <span className="font-bold text-slate-300">পেইড সাইনআপ (১০০৳)</span>
                </label>
              </div>
            </div>
          )}

          {/* অ্যাকর্ডিয়ন সাবজেক্ট সিলেকশন */}
          <div className="bg-black/20 p-4 rounded-xl border border-white/5">
            <label className="block text-sm font-bold text-blue-300 mb-3">আপনি কোন কোন বিষয় পড়াতে পারেন? (ঐচ্ছিক)</label>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {Object.keys(EDUCATION_DATA).map((category) => (
                <div key={category} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <button 
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between p-3 hover:bg-white/10 transition text-left"
                  >
                    <span className="font-medium text-slate-200 text-sm flex items-center gap-2">
                      {openCategories.includes(category) ? '📂' : '📁'} {category}
                    </span>
                    <span className="text-slate-400 text-xs">{openCategories.includes(category) ? '▲' : '▼'}</span>
                  </button>

                  {openCategories.includes(category) && (
                    <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2 bg-black/30 border-t border-white/5">
                      {EDUCATION_DATA[category].map((subjectName) => (
                        <label key={subjectName} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition ${selectedSubjects.includes(subjectName) ? 'bg-blue-600/20 text-blue-300' : 'hover:bg-white/5 text-slate-400'}`}>
                          <input type="checkbox" checked={selectedSubjects.includes(subjectName)} onChange={() => toggleSubject(subjectName)} className="hidden" />
                          <div className={`w-4 h-4 flex items-center justify-center rounded border ${selectedSubjects.includes(subjectName) ? 'bg-blue-500 border-blue-500' : 'border-white/20'}`}>
                            {selectedSubjects.includes(subjectName) && <span className="text-white text-[10px]">✓</span>}
                          </div>
                          <span className="text-xs">{subjectName}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">আপনার সম্পর্কে (Short Bio)</label>
            <textarea name="bio" rows={2} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-slate-500" placeholder="আপনি কীভাবে পড়ান, আপনার অভিজ্ঞতা ইত্যাদি..."></textarea>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-500 transition-all duration-300 mt-4 shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:bg-slate-600">
            {loading ? 'অপেক্ষা করুন...' : 'পরবর্তী ধাপে যান'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6 font-medium">
          আগে থেকেই অ্যাকাউন্ট আছে? <Link href="/login" className="text-blue-400 font-bold hover:underline">লগইন করুন</Link>
        </p>
      </div>
    </div>
  );
}