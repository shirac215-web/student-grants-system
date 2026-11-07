import React from 'react';
import { useForm } from'react-hook-form'; // 1. מייבאים את הספרייה החדשה

export default function BankDetailsStep({ nextStep, prevStep, formData = {}, setFormData }) {
  
  
  // פונקציית בדיקת תקינות תעודת זהות ישראלית
  const isValidTZ = (id) => {
    if (!/^\d{9}$/.test(id)) return false;
    return Array.from(id, Number).reduce((acc, val, i) => {
      const step = val * ((i % 2) + 1);
      return acc + (step > 9 ? step - 9 : step);
    }, 0) % 10 === 0;
  };

  // 2. הפעלת ה-Hook של Form
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      accountHolderId: formData.accountHolderId || '',
      bankName: formData.bankName || '',
      branchNumber: formData.branchNumber || '',
      accountNumber: formData.accountNumber || '',
    },
  });

  // הפונקציה שתרוץ רק אם כל השדות בפרטי הבנק תקינים לחלוטין
  const onValidSubmit = (data) => {
    setFormData((prev) => ({ ...prev, ...data })); // שומרים בטופס המשותף
    nextStep(); // עוברים בהצלחה לשלב 5!
  };

  return (
    <div className="bg-white border border-[#e2dfd8] rounded-2xl relative overflow-hidden shadow-sm" dir="rtl">
      {/* אפקט הבלור בפינה */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#071325]/5 blur-3xl rounded-full pointer-events-none"></div>

      <div className="p-8">
        {/* כותרת השלב עם האייקון */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-[#071325]/15 p-3 rounded-xl border border-[#d5c9b5]">
            <svg className="w-6 h-6 text-[#071325]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#071325]">פרטי בנק</h2>
            <p className="text-[#071325] text-sm">שלב 4 מתוך 6 - פרטי חשבון להעברת המענק</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-[#071325] text-sm font-medium mb-4 pb-2 border-b border-[#d5c9b5]">חשבון בנק לזיכוי</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* ת.ז בעל החשבון */}
              <div className="md:col-span-2">
                <label className="block text-sm text-[#071325] mb-2 font-medium">ת.ז בעל החשבון <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="הזן מספר תעודת זהות (9 ספרות)"
                  maxLength={9}
                  className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none transition text-sm text-[#071325] placeholder-[#071325]/40 ${
                    errors.accountHolderId ? 'border-red-500 focus:border-red-500' : 'border-[#d5c9b5] focus:border-[#071325]'
                  }`}
                  {...register("accountHolderId", {
                    required: "שדה חובה",
                    validate: (value) => isValidTZ(value) || "מספר תעודת הזהות אינו תקין לחלוטין"
                  })}
                />
                {errors.accountHolderId && <p className="text-red-500 text-xs mt-1 mr-1">{errors.accountHolderId.message}</p>}
              </div>

              {/* שם הבנק - רשימה נפתחת */}
              <div>
                <label className="block text-sm text-[#071325] mb-2 font-medium">שם הבנק <span className="text-red-500">*</span></label>
                <select
                  className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none transition text-sm text-[#071325] appearance-none ${
                    errors.bankName ? 'border-red-500 focus:border-red-500' : 'border-[#d5c9b5] focus:border-[#071325]'
                  }`}
                  {...register("bankName", { required: "אנא בחר בנק מהרשימה" })}
                >
                  <option value="" disabled hidden>בחר בנק מהרשימה</option>
                  <option value="לאומי">בנק לאומי (10)</option>
                  <option value="הפועלים">בנק הפועלים (12)</option>
                  <option value="דיסקונט">בנק דיסקונט (11)</option>
                  <option value="מזרחי טפחות">בנק מזרחי טפחות (20)</option>
                  <option value="בינלאומי">הבנק הבינלאומי (31)</option>
                  <option value="יהב">בנק יהב (4) </option>
                  <option value="מרכנתיל">בנק מרכנתיל דיסקונט (17)</option>
                  <option value="מסד">בנק מסד (46)</option>
                  <option value="פאגא">בנק פועלי אגודת ישראל (52)</option>
                  <option value="ירושלים">בנק ירושלים (54)</option>
                  <option value="וואן זירו">וואן זירו בנק דיגיטלי (18)</option>
                </select>
                {errors.bankName && <p className="text-red-500 text-xs mt-1 mr-1">{errors.bankName.message}</p>}
              </div>

              {/* מספר סניף */}
              <div>
                <label className="block text-sm text-[#071325] mb-2 font-medium">מספר סניף <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="הזן מספר סניף"
                  className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none transition text-sm text-[#071325] placeholder-[#071325]/40 ${
                    errors.branchNumber ? 'border-red-500 focus:border-red-500' : 'border-[#d5c9b5] focus:border-[#071325]'
                  }`}
                  {...register("branchNumber", { 
                    required: "שדה חובה",
                    pattern: { value: /^[0-9]+$/, message: "מספר סניף חייב להכיל ספרות בלבד" }
                  })}
                />
                {errors.branchNumber && <p className="text-red-500 text-xs mt-1 mr-1">{errors.branchNumber.message}</p>}
              </div>

              {/* מספר חשבון */}
              <div className="md:col-span-2">
                <label className="block text-sm text-[#071325] mb-2 font-medium">מספר חשבון בנק <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="הזן את מספר החשבון"
                  className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none transition text-sm text-[#071325] placeholder-[#071325]/40 ${
                    errors.accountNumber ? 'border-red-500 focus:border-red-500' : 'border-[#d5c9b5] focus:border-[#071325]'
                  }`}
                  {...register("accountNumber", { 
                    required: "שדה חובה",
                    pattern: { value: /^[0-9]+$/, message: "מספר חשבון חייב להכיל ספרות בלבד" }
                  })}
                />
                {errors.accountNumber && <p className="text-red-500 text-xs mt-1 mr-1">{errors.accountNumber.message}</p>}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* כפתורי ניווט מחוברים לולידציה */}
      <div className="bg-gray-50 border-t border-[#e2dfd8] px-8 py-6 flex items-center justify-between mt-4 rounded-b-2xl">
        <button
          onClick={prevStep}
          type="button"
          className="flex items-center gap-2 px-6 py-2.5 text-[#071325] font-medium border-2 border-[#071325] rounded-xl hover:bg-[#071325] hover:text-white transition-all duration-200 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span>חזור לשלב הקודם</span>
        </button>

        <button
          onClick={handleSubmit(onValidSubmit)} // מפעיל את הולידציה לפני המעבר לשלב הבא!
          type="button"
          className="flex items-center gap-2 px-8 py-2.5 bg-[#071325] text-white font-medium rounded-xl hover:bg-[#071325]/80 shadow-lg shadow-[#071325]/20 transition-all duration-200 cursor-pointer"
        >
          <span>המשך לשלב הבא</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </div>
    
  );
}
