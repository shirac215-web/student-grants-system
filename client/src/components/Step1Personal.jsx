import React from 'react';
import { useForm } from 'react-hook-form';

// שלב 1: פרטים אישיים של הסטודנט
export default function Step1Personal({ nextStep, formData = {}, setFormData, saveDraft }) {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      birthDate: formData.birthDate || '',
      city: formData.city || '',
      address: formData.address || '',
      mobile: formData.mobile || '',
      phone: formData.phone || '',
    },
  });

  const onValidSubmit = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    nextStep();
  };

  const handleLocalSaveDraft = () => {
    saveDraft(getValues());
  };

  const inputClass = (hasError) =>
    `w-full bg-white border rounded-lg px-4 py-3 focus:outline-none transition text-sm text-[#071325] placeholder-[#071325]/40 ${
      hasError ? 'border-red-500 focus:border-red-500' : 'border-[#d5c9b5] focus:border-[#071325]'
    }`;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white border border-[#e2dfd8] rounded-2xl relative overflow-hidden shadow-sm" dir="rtl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#071325]/5 blur-3xl rounded-full pointer-events-none"></div>

      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-[#071325]/15 p-3 rounded-xl border border-[#d5c9b5]">
            <svg className="w-6 h-6 text-[#071325]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#071325]">פרטים אישיים</h2>
            <p className="text-[#071325] text-sm">שלב 1 מתוך 6 - פרטי הסטודנט</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-[#071325] text-sm font-medium mb-4 pb-2 border-b border-[#d5c9b5]">פרטים כלליים</h3>
            <div className="grid md:grid-cols-2 gap-6">

              {/* תאריך לידה */}
              <div>
                <label className="block text-sm text-[#071325] mb-2 font-medium">תאריך לידה <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  max={today}
                  className={inputClass(errors.birthDate)}
                  {...register('birthDate', { required: 'יש להזין תאריך לידה' })}
                />
                {errors.birthDate && <p className="text-red-500 text-xs mt-1 mr-1">{errors.birthDate.message}</p>}
              </div>

              {/* עיר מגורים */}
              <div>
                <label className="block text-sm text-[#071325] mb-2 font-medium">עיר מגורים <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="לדוגמה: ירושלים"
                  className={inputClass(errors.city)}
                  {...register('city', { required: 'יש להזין עיר מגורים' })}
                />
                {errors.city && <p className="text-red-500 text-xs mt-1 mr-1">{errors.city.message}</p>}
              </div>

              {/* כתובת */}
              <div className="md:col-span-2">
                <label className="block text-sm text-[#071325] mb-2 font-medium">כתובת מלאה <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="רחוב ומספר בית"
                  className={inputClass(errors.address)}
                  {...register('address', { required: 'יש להזין כתובת' })}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1 mr-1">{errors.address.message}</p>}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[#071325] text-sm font-medium mb-4 pb-2 border-b border-[#d5c9b5]">פרטי התקשרות</h3>
            <div className="grid md:grid-cols-2 gap-6">

              {/* טלפון נייד */}
              <div>
                <label className="block text-sm text-[#071325] mb-2 font-medium">טלפון נייד <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  placeholder="05XXXXXXXX"
                  maxLength={10}
                  className={inputClass(errors.mobile)}
                  {...register('mobile', {
                    required: 'יש להזין טלפון נייד',
                    pattern: { value: /^05\d{8}$/, message: 'מספר נייד חייב להתחיל ב-05 ולהכיל 10 ספרות' },
                  })}
                />
                {errors.mobile && <p className="text-red-500 text-xs mt-1 mr-1">{errors.mobile.message}</p>}
              </div>

              {/* טלפון נוסף */}
              <div>
                <label className="block text-sm text-[#071325] mb-2 font-medium">טלפון נוסף</label>
                <input
                  type="tel"
                  placeholder="לא חובה"
                  className={inputClass(errors.phone)}
                  {...register('phone', {
                    pattern: { value: /^0\d{8,9}$/, message: 'מספר טלפון לא תקין' },
                  })}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1 mr-1">{errors.phone.message}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border-t border-[#e2dfd8] px-8 py-6 flex items-center justify-between mt-4 rounded-b-2xl">
        <button
          type="button"
          onClick={handleLocalSaveDraft}
          className="px-6 py-2.5 text-[#071325] font-medium border border-[#d5c9b5] rounded-xl hover:bg-[#071325]/5 transition-all duration-200"
        >
          שמור טיוטה
        </button>

        <button
          onClick={handleSubmit(onValidSubmit)}
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
