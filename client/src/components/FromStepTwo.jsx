import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

export default function FromStepTwo({ nextStep, prevStep, formData, setFormData, saveDraft }) {
  
  // בדיקת תקינות תעודת זהות
  const isValidTZ = (id) => {
    if (!/^\d{9}$/.test(id)) return false;
    return Array.from(id, Number).reduce((acc, val, i) => {
      const step = val * ((i % 2) + 1);
      return acc + (step > 9 ? step - 9 : step);
    }, 0) % 10 === 0;
  };

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm({
    // טוען את הנתונים מתוך המחברת הגלובלית (formData) במידה ויש
    defaultValues: {
      fatherId: formData.fatherId || "",
      fatherLastName: formData.fatherLastName || "",
      fatherFirstName: formData.fatherFirstName || "",
      motherId: formData.motherId || "",
      motherLastName: formData.motherLastName || "",
      motherFirstName: formData.motherFirstName || "",
      siblingsUnder18: formData.siblingsUnder18 || "",
      siblingsOver21: formData.siblingsOver21 || "",
      // אחים הם לא חובה: מתחילים מרשימה ריקה ומוסיפים לפי הצורך
      siblings: formData.siblings || []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "siblings"
  });

  // כשהמשתמש לוחץ על שמירת טיוטה מדף זה
  const handleLocalSaveDraft = () => {
    const currentData = getValues(); // שולף הכל מהמחברת המקומית
    saveDraft(currentData); // שולח לאבא שישמור יחד עם שאר הדברים
  };

  // כשהמשתמש לוחץ 'הבא' ועובר את כל הבדיקות
  const onValidSubmit = (data) => {
    // קודם כל מעדכנים את המחברת של האבא
    setFormData(prev => ({ ...prev, ...data }));
    nextStep(); // ואז עוברים שלב
  };

  return (
    <div className="bg-white border border-[#e2dfd8] rounded-2xl relative overflow-hidden shadow-sm" dir="rtl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#071325]/5 blur-3xl rounded-full pointer-events-none"></div>

      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-[#071325]/15 p-3 rounded-xl border border-[#d5c9b5]">
            <svg className="w-6 h-6 text-[#071325]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#071325]">פרטי משפחה</h2>
            <p className="text-[#071325] text-sm">שלב 2 מתוך 6 - פרטי הורים ואחים</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* חלק 1: פרטי האב */}
          <div>
            <h3 className="text-[#071325] text-sm font-medium mb-4 pb-2 border-b border-[#d5c9b5]">פרטי האב</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-[#071325] mb-2">מספר זהות <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="הזן מספר זהות" 
                  className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none transition text-sm text-[#071325] placeholder-[#071325]/50 ${errors.fatherId ? 'border-red-500 focus:border-red-500' : 'border-[#d5c9b5] focus:border-[#071325]'}`}
                  {...register("fatherId", { 
                    required: "שדה חובה",
                    pattern: { value: /^[0-9]{9}$/, message: "מספר זהות חייב להכיל בדיוק 9 ספרות" }
                  })}
                />
                {errors.fatherId && <p className="text-red-500 text-xs mt-1">{errors.fatherId.message}</p>}
              </div>

              <div>
                <label className="block text-sm text-[#071325] mb-2">שם משפחה <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="הזן שם משפחה" 
                  className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none transition text-sm text-[#071325] placeholder-[#071325]/50 ${errors.fatherLastName ? 'border-red-500 focus:border-red-500' : 'border-[#d5c9b5] focus:border-[#071325]'}`}
                  {...register("fatherLastName", { required: "יש להזין שם משפחה" })}
                />
                {errors.fatherLastName && <p className="text-red-500 text-xs mt-1">{errors.fatherLastName.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-[#071325] mb-2">שם פרטי <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="הזן שם פרטי" 
                  className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none transition text-sm text-[#071325] placeholder-[#071325]/50 ${errors.fatherFirstName ? 'border-red-500 focus:border-red-500' : 'border-[#d5c9b5] focus:border-[#071325]'}`}
                  {...register("fatherFirstName", { required: "יש להזין שם פרטי" })}
                />
                {errors.fatherFirstName && <p className="text-red-500 text-xs mt-1">{errors.fatherFirstName.message}</p>}
              </div>
            </div>
          </div>

          {/* חלק 1ב: פרטי האם */}
          <div>
            <h3 className="text-[#071325] text-sm font-medium mb-4 pb-2 border-b border-[#d5c9b5]">פרטי האם</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-[#071325] mb-2">מספר זהות <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="הזן מספר זהות" 
                  className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none transition text-sm text-[#071325] placeholder-[#071325]/50 ${errors.motherId ? 'border-red-500 focus:border-red-500' : 'border-[#d5c9b5] focus:border-[#071325]'}`}
                  {...register("motherId", { 
                    required: "שדה חובה",
                    pattern: { value: /^[0-9]{9}$/, message: "מספר זהות חייב להכיל בדיוק 9 ספרות" }
                  })}
                />
                {errors.motherId && <p className="text-red-500 text-xs mt-1">{errors.motherId.message}</p>}
              </div>

              <div>
                <label className="block text-sm text-[#071325] mb-2">שם משפחה <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="הזן שם משפחה" 
                  className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none transition text-sm text-[#071325] placeholder-[#071325]/50 ${errors.motherLastName ? 'border-red-500 focus:border-red-500' : 'border-[#d5c9b5] focus:border-[#071325]'}`}
                  {...register("motherLastName", { required: "יש להזין שם משפחה" })}
                />
                {errors.motherLastName && <p className="text-red-500 text-xs mt-1">{errors.motherLastName.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-[#071325] mb-2">שם פרטי <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="הזן שם פרטי" 
                  className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none transition text-sm text-[#071325] placeholder-[#071325]/50 ${errors.motherFirstName ? 'border-red-500 focus:border-red-500' : 'border-[#d5c9b5] focus:border-[#071325]'}`}
                  {...register("motherFirstName", { required: "יש להזין שם פרטי" })}
                />
                {errors.motherFirstName && <p className="text-red-500 text-xs mt-1">{errors.motherFirstName.message}</p>}
              </div>
            </div>
          </div>

          {/* חלק 2: פרטי אחים ואחיות */}
          <div>
            <h3 className="text-[#071325] text-sm font-medium mb-4 pb-2 border-b border-[#d5c9b5]">פרטי אחים</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm text-[#071325] mb-2">מספר אחים מתחת לגיל 18 <span className="text-red-500">*</span></label>
                <input 
                  type="number"
                  placeholder="0"
                  className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none transition text-sm text-[#071325] placeholder-[#071325]/50 ${errors.siblingsUnder18 ? 'border-red-500 focus:border-red-500' : 'border-[#d5c9b5] focus:border-[#071325]'}`}
                  {...register("siblingsUnder18", { required: "שדה חובה", min: { value: 0, message: "לא יכול להיות שלילי" } })}
                  
                />
                {errors.siblingsUnder18 && <p className="text-red-500 text-xs mt-1">{errors.siblingsUnder18.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm text-[#071325] mb-2">מספר אחים מעל גיל 21 <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  placeholder="0"
                  className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none transition text-sm text-[#071325] placeholder-[#071325]/50 ${errors.siblingsOver21 ? 'border-red-500 focus:border-red-500' : 'border-[#d5c9b5] focus:border-[#071325]'}`}
                  {...register("siblingsOver21", { required: "שדה חובה", min: { value: 0, message: "לא יכול להיות שלילי" } })}
                />
                {errors.siblingsOver21 && <p className="text-red-500 text-xs mt-1">{errors.siblingsOver21.message}</p>}
              </div>
            </div>

            <div className="space-y-6">
              {fields.map((item, index) => (
                <div key={item.id} className="p-6 border border-[#d5c9b5] rounded-xl bg-gray-50/30">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[#071325] font-bold text-sm">אח / אחות #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 text-xs font-medium hover:underline"
                    >
                      הסר
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-[#071325] mb-2">מספר זהות <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        placeholder="הזן מספר זהות" 
                        className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none transition text-sm text-[#071325] placeholder-[#071325]/50 ${errors.siblings?.[index]?.idNumber ? 'border-red-500 focus:border-red-500' : 'border-[#d5c9b5] focus:border-[#071325]'}`}
                        {...register(`siblings.${index}.idNumber`, {
                          validate: value => !value || isValidTZ(value) || "תעודת זהות אינה תקינה",
                          required: "יש להזין מספר זהות"
                        })}
                      />
                      {errors.siblings?.[index]?.idNumber && <p className="text-red-500 text-xs mt-1">{errors.siblings[index].idNumber.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-[#071325] mb-2">תאריך לידה <span className="text-red-500">*</span></label>
                      <input 
                        type="date" 
                        className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none transition text-sm text-[#071325] ${errors.siblings?.[index]?.birthDate ? 'border-red-500 focus:border-red-500' : 'border-[#d5c9b5] focus:border-[#071325]'}`}
                        {...register(`siblings.${index}.birthDate`, { required: "יש להזין תאריך לידה" })}
                      />
                      {errors.siblings?.[index]?.birthDate && <p className="text-red-500 text-xs mt-1">{errors.siblings[index].birthDate.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-[#071325] mb-2">שם משפחה <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        placeholder="הזן שם משפחה" 
                        className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none transition text-sm text-[#071325] placeholder-[#071325]/50 ${errors.siblings?.[index]?.lastName ? 'border-red-500 focus:border-red-500' : 'border-[#d5c9b5] focus:border-[#071325]'}`}
                        {...register(`siblings.${index}.lastName`, { required: "יש להזין שם משפחה" })}
                      />
                      {errors.siblings?.[index]?.lastName && <p className="text-red-500 text-xs mt-1">{errors.siblings[index].lastName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-[#071325] mb-2">שם פרטי <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        placeholder="הזן שם פרטי" 
                        className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none transition text-sm text-[#071325] placeholder-[#071325]/50 ${errors.siblings?.[index]?.firstName ? 'border-red-500 focus:border-red-500' : 'border-[#d5c9b5] focus:border-[#071325]'}`}
                        {...register(`siblings.${index}.firstName`, { required: "יש להזין שם פרטי" })}
                      />
                      {errors.siblings?.[index]?.firstName && <p className="text-red-500 text-xs mt-1">{errors.siblings[index].firstName.message}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => append({ idNumber: "", birthDate: "", lastName: "", firstName: "" })}
              className="mt-6 w-full py-3.5 border-2 border-dashed border-[#d5c9b5] rounded-xl text-[#071325] font-medium hover:bg-[#071325]/5 transition-colors flex items-center justify-center gap-2"
            >
              <span>+ הוסף אח / אחות</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border-t border-[#e2dfd8] px-8 py-6 flex items-center justify-between mt-4 rounded-b-2xl">
        <button
          onClick={prevStep}
          type="button"
          className="flex items-center gap-2 px-6 py-2.5 text-[#071325] font-medium border-2 border-[#071325] rounded-xl hover:bg-[#071325] hover:text-white transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span>הקודם</span>
        </button>

        <button
          type="button"
          onClick={handleLocalSaveDraft}
          className="px-6 py-2.5 text-[#071325] font-medium border border-[#d5c9b5] rounded-xl hover:bg-[#071325]/5 transition-all duration-200 hidden md:block"
        >
          שמור טיוטה
        </button>

        <button
          onClick={handleSubmit(onValidSubmit)}
          type="button"
          className="flex items-center gap-2 px-8 py-2.5 bg-[#071325] text-white font-medium rounded-xl hover:bg-[#071325]/80 shadow-lg shadow-[#071325]/20 transition-all duration-200"
        >
          <span>הבא</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}