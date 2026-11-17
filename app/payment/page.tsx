'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const userId = searchParams.get('userId');
  const amount = searchParams.get('amount');
  const role = searchParams.get('role');

  const [method, setMethod] = useState('bkash');
  const [trxId, setTrxId] = useState('');
  const [loading, setLoading] = useState(false);

  const paymentNumbers = {
    bkash: '01315242333',   
    nagad: '01315242333',   
    rocket: '013152423336'   
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (trxId.length < 5) return alert('সঠিক ট্রানজেকশন আইডি দিন');
    
    setLoading(true);

    try {
      const res = await fetch('/api/payment/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, role, method, trxId })
      });
      const data = await res.json();

      if (res.ok) {
        alert('পেমেন্ট সাবমিট হয়েছে! অ্যাডমিন চেক করে আপনার অ্যাকাউন্ট অ্যাক্টিভ করবে।');
        router.push('/login');
      } else {
        alert(data.error || 'সমস্যা হয়েছে');
        setLoading(false);
      }
    } catch (error) {
      alert('নেটওয়ার্ক এরর!');
      setLoading(false);
    }
  };

  if (!userId) return <div className="p-10 text-center text-black">ভুল লিংক! ইউজার আইডি পাওয়া যায়নি।</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-black py-12">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-200">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-slate-800 mb-1">সাইনআপ ফি পেমেন্ট</h1>
          <p className="text-slate-600 text-sm font-medium">পরিশোধ করতে হবে: <span className="text-xl font-bold text-green-600">৳ {amount}</span></p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">পেমেন্ট মেথড সিলেক্ট করুন</label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setMethod('bkash')} className={`flex-1 py-2 rounded-lg font-bold border-2 transition ${method === 'bkash' ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-gray-200 text-gray-500'}`}>বিকাশ</button>
              <button type="button" onClick={() => setMethod('nagad')} className={`flex-1 py-2 rounded-lg font-bold border-2 transition ${method === 'nagad' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-500'}`}>নগদ</button>
              <button type="button" onClick={() => setMethod('rocket')} className={`flex-1 py-2 rounded-lg font-bold border-2 transition ${method === 'rocket' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-500'}`}>রকেট</button>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-200 text-center">
            <p className="text-sm text-gray-600 mb-1">নিচের নম্বরে <strong>Send Money</strong> করুন:</p>
            <p className="text-2xl font-bold text-blue-700 tracking-wider">
              {paymentNumbers[method as keyof typeof paymentNumbers]}
            </p>
            <p className="text-xs text-red-500 mt-2 font-medium">* পেমেন্ট করার পর ট্রানজেকশন আইডি (TrxID) নিচে দিন</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-1">ট্রানজেকশন আইডি (TrxID)</label>
            <input 
              type="text" 
              required
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black font-bold"
              placeholder="যেমন: 9G7A2B3C4D" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition disabled:bg-gray-400"
          >
            {loading ? 'সাবমিট হচ্ছে...' : 'পেমেন্ট সাবমিট করুন'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6 font-medium">
          অ্যাডমিন চেক করার পর আপনার অ্যাকাউন্ট এক্টিভ হবে।
        </p>
      </div>
    </div>
  );
}

// Suspense বাউন্ডারি এখানে ব্যবহার করা হলো
export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xl font-bold">লোড হচ্ছে...</div>}>
      <PaymentContent />
    </Suspense>
  );
}