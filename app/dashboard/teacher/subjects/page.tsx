'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

// বাংলাদেশের শিক্ষাব্যবস্থার সম্পূর্ণ ক্যাটাগরি ও সাবজেক্ট লিস্ট
const EDUCATION_DATA: { [key: string]: string[] } = {
  "ক্লাস ৬ - ৮ (জুনিয়র সেকেন্ডারি)": [
    "বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান", "বাংলাদেশ ও বিশ্বপরিচয়", "ধর্ম", "আইসিটি", "কৃষি শিক্ষা", "গার্হস্থ্য বিজ্ঞান"
  ],
  "ক্লাস ৯ - ১০ (বিজ্ঞান)": [
    "পদার্থবিজ্ঞান", "রসায়ন", "জীববিজ্ঞান", "উচ্চতর গণিত", "সাধারণ গণিত", "বাংলা", "ইংরেজি", "আইসিটি", "বাংলাদেশ ও বিশ্বপরিচয়"
  ],
  "ক্লাস ৯ - ১০ (মানবিক)": [
    "ভূগোল ও পরিবেশ", "ইতিহাস", "পৌরনীতি ও নাগরিকতা", "অর্থনীতি", "বাংলা", "ইংরেজি", "আইসিটি", "গার্হস্থ্য বিজ্ঞান", "কৃষি শিক্ষা"
  ],
  "ক্লাস ৯ - ১০ (ব্যবসায় শিক্ষা)": [
    "হিসাববিজ্ঞান", "ফিন্যান্স ও ব্যাংকিং", "ব্যবসায় উদ্যোগ", "বাংলা", "ইংরেজি", "আইসিটি", "অর্থনীতি"
  ],
  "এইচএসসি (বিজ্ঞান)": [
    "পদার্থবিজ্ঞান ১ম ও ২য় পত্র", "রসায়ন ১ম ও ২য় পত্র", "জীববিজ্ঞান ১ম ও ২য় পত্র", "উচ্চতর গণিত ১ম ও ২য় পত্র", "বাংলা", "ইংরেজি", "আইসিটি"
  ],
  "এইচএসসি (মানবিক)": [
    "যুক্তিবিদ্যা", "ইসলামের ইতিহাস", "সমাজবিজ্ঞান", "সমাজকর্ম", "ভূগোল", "ইতিহাস", "পৌরনীতি", "অর্থনীতি", "মনোবিজ্ঞান", "বাংলা", "ইংরেজি", "আইসিটি"
  ],
  "এইচএসসি (ব্যবসায় শিক্ষা)": [
    "হিসাববিজ্ঞান ১ম ও ২য় পত্র", "ব্যবসায় সংগঠন ও ব্যবস্থাপনা ১ম ও ২য় পত্র", "ফিন্যান্স, ব্যাংকিং ও বিমা ১ম ও ২য় পত্র", "উৎপাদন ব্যবস্থাপনা ও বিপণন ১ম ও ২য় পত্র", "বাংলা", "ইংরেজি", "আইসিটি"
  ],
  "মেডিকেল ও হেলথ সায়েন্স": [
    "মেডিকেল ভর্তি প্রস্তুতি (MBBS)", "ডেন্টাল (BDS)", "নার্সিং", "ফার্মেসি", "ফিজিওথেরাপি", "মেডিকেল ল্যাব টেকনোলজি", "রেডিওলজি ও ইমেজিং", "পাবলিক হেলথ"
  ],
  "ইঞ্জিনিয়ারিং (Engineering)": [
    "সিভিল ইঞ্জিনিয়ারিং (CE)", "কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং (CSE)", "ইলেকট্রিক্যাল অ্যান্ড ইলেকট্রনিক ইঞ্জিনিয়ারিং (EEE)", "মেকানিক্যাল ইঞ্জিনিয়ারিং (ME)", "কেমিক্যাল ইঞ্জিনিয়ারিং", "টেক্সটাইল ইঞ্জিনিয়ারিং", "বায়োমেডিক্যাল ইঞ্জিনিয়ারিং", "সফটওয়্যার ইঞ্জিনিয়ারিং", "বুয়েট/সুয়েট/কুয়েট অ্যাডমিশন", "আর্কিটেকচার"
  ],
  "বিশুদ্ধ ও প্রায়োগিক বিজ্ঞান (Pure Science)": [
    "পদার্থবিজ্ঞান", "রসায়ন", "গণিত", "পরিসংখ্যান", "প্রাণিবিদ্যা (Zoology)", "উদ্ভিদবিদ্যা (Botany)", "মাইক্রোবায়োলজি", "বায়োকেমিস্ট্রি", "জেনেটিক ইঞ্জিনিয়ারিং", "পরিবেশ বিজ্ঞান", "ভূতত্ত্ব"
  ],
  "কম্পিউটার ও আইটি (CSE/IT)": [
    "প্রোগ্রামিং (C/C++/Java/Python)", "ডাটা স্ট্রাকচার ও অ্যালগরিদম", "ডাটাবেস ম্যানেজমেন্ট", "কৃত্রিম বুদ্ধিমত্তা (AI)", "মেশিন লার্নিং", "সাইবার সিকিউরিটি", "ওয়েব ডেভেলপমেন্ট", "কম্পিউটার নেটওয়ার্কিং"
  ],
  "ব্যবসায় প্রশাসন (BBA/Commerce)": [
    "হিসাববিজ্ঞান", "ফিন্যান্স", "মার্কেটিং", "ম্যানেজমেন্ট", "ব্যবসায়িক পরিসংখ্যান", "মাইক্রো ও ম্যাক্রো ইকোনমিক্স", "এইচআরএম", "সাপ্লাই চেইন ম্যানেজমেন্ট"
  ],
  "মানবিক ও সমাজবিজ্ঞান (Arts & Social Science)": [
    "বাংলা সাহিত্য", "ইংরেজি সাহিত্য", "ইতিহাস", "দর্শন", "সমাজবিজ্ঞান", "রাষ্ট্রবিজ্ঞান", "অর্থনীতি", "নৃবিজ্ঞান", "আন্তর্জাতিক সম্পর্ক", "সাংবাদিকতা ও গণমাধ্যম"
  ],
  "কৃষি ও প্রাণিসম্পদ": [
    "কৃষি শিক্ষা", "ভেটেরিনারি মেডিসিন", "মৎস্যবিদ্যা", "প্রাণিসম্পদ", "বনায়ন", "উদ্যানতত্ত্ব"
  ],
  "আইন (Law)": [
    "এলএলবি (LLB)", "এলএলএম (LLM)", "সাংবিধানিক আইন", "ফৌজদারি আইন", "আন্তর্জাতিক আইন"
  ]
};

export default function SelectSubjects() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // কোন ক্যাটাগরি ওপেন আছে
  const [openCategories, setOpenCategories] = useState<string[]>(["ক্লাস ৯ - ১০ (বিজ্ঞান)"]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    // আগে সেভ করা থাকলে সেটা লোড করা (যদি API থেকে পাওয়া যায়)
    if (status === 'authenticated') {
      const teacherId = (session?.user as any)?.id;
      fetch(`/api/teacher/subjects?teacherId=${teacherId}`)
        .then(res => res.json())
        .then(data => {
           // এখানে ভবিষ্যতে আগের সেভ করা সাবজেক্ট লোড করার লজিক বসানো যাবে
           setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status, router, session]);

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

  const handleSave = async () => {
    if (selectedSubjects.length === 0) return alert('অন্তত একটি সাবজেক্ট সিলেক্ট করুন');
    
    setSaving(true);
    try {
      const res = await fetch('/api/teacher/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: (session?.user as any)?.id,
          subjects: selectedSubjects // এখানে আমরা সাবজেক্টের নামগুলোর অ্যারে পাঠাচ্ছি
        })
      });

      if (res.ok) {
        alert('সফলভাবে সেভ হয়েছে!');
        router.push('/dashboard/teacher');
      } else {
        alert('সেভ করতে সমস্যা হয়েছে');
      }
    } catch (err) {
      alert('নেটওয়ার্ক এরর!');
    }
    setSaving(false);
  };

  if (loading) return <div className="p-10 text-center text-white min-h-screen bg-[#03050a]">লোড হচ্ছে...</div>;

  return (
    <DashboardLayout>
      <div className="bg-[#0a0f1c]/60 backdrop-blur-xl rounded-[2rem] border border-white/5 p-6 md:p-10 max-w-4xl mx-auto shadow-2xl relative">
        
        <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-8">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">বিষয় সিলেক্ট করুন</h1>
          <Link href="/dashboard/teacher" className="text-slate-400 hover:text-white transition">← ফিরে যান</Link>
        </div>

        <div className="space-y-4">
          {Object.keys(EDUCATION_DATA).map((category) => (
            <div key={category} className="bg-black/20 border border-white/5 rounded-2xl overflow-hidden transition-all duration-300">
              
              {/* ক্যাটাগরি হেডার */}
              <button 
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition text-left"
              >
                <span className="font-bold text-white text-lg flex items-center gap-2">
                  {openCategories.includes(category) ? '📂' : '📁'} {category}
                </span>
                <span className="text-slate-400 text-xl">
                  {openCategories.includes(category) ? '▲' : '▼'}
                </span>
              </button>

              {/* ভেতরের সাবজেক্টগুলো */}
              {openCategories.includes(category) && (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 bg-black/40">
                  {EDUCATION_DATA[category].map((subjectName) => (
                    <label key={subjectName} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${selectedSubjects.includes(subjectName) ? 'bg-blue-600/20 border-blue-500/50 text-blue-300' : 'bg-white/5 border-transparent text-slate-300 hover:bg-white/10'}`}>
                      <div className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded border ${selectedSubjects.includes(subjectName) ? 'bg-blue-500 border-blue-500' : 'border-white/20 bg-black/50'}`}>
                        {selectedSubjects.includes(subjectName) && <span className="text-white text-xs">✓</span>}
                      </div>
                      <input 
                        type="checkbox" 
                        checked={selectedSubjects.includes(subjectName)}
                        onChange={() => toggleSubject(subjectName)}
                        className="hidden" 
                      />
                      <span className="text-sm font-medium">{subjectName}</span>
                    </label>
                  ))}
                </div>
              )}

            </div>
          ))}
        </div>

        {/* সেভ বাটন */}
        <div className="border-t border-white/10 pt-6 mt-8 flex justify-between items-center">
          <p className="text-slate-400 text-sm">
            সিলেক্ট করা হয়েছে: <span className="text-blue-400 font-bold">{selectedSubjects.length}</span> টি
          </p>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50"
          >
            {saving ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}