import { useForm } from 'react-hook-form';

export default function Step3Studies({
  nextStep,
  prevStep,
  formData = {},
  setFormData,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      field: formData.field || '',
      institution: formData.institution || '',
      years: formData.years || '',
      tuition: formData.tuition || '',
    },
  });

  // שומרים את פרטי הלימודים בטופס המשותף. השליחה לשרת מתבצעת בשלב 6
  const onValidSubmit = (data) => {
    setFormData((prev) => ({
      ...prev,
      field: data.field,
      institution: data.institution,
      years: Number(data.years),
      tuition: Number(data.tuition),
    }));
    nextStep();
  };

  return (
    <div
      className="bg-white border border-[#e2dfd8] rounded-2xl relative overflow-hidden shadow-sm"
      dir="rtl"
    >
      {/* Blur Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#071325]/5 blur-3xl rounded-full pointer-events-none"></div>

      <div className="p-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-[#071325]/15 p-3 rounded-xl border border-[#d5c9b5]">
            <svg
              className="w-6 h-6 text-[#071325]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l6.16-3.422A12.083 12.083 0 0120 17.944M12 14L5.84 10.578A12.083 12.083 0 004 17.944M12 14v7"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#071325]">
              פרטי לימודים
            </h2>

            <p className="text-[#071325] text-sm">
              שלב 3 מתוך 6 - פרטי המוסד האקדמי
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="space-y-6">

          <div>
            <h3 className="text-[#071325] text-sm font-medium mb-4 pb-2 border-b border-[#d5c9b5]">
              פרטי מסלול הלימודים
            </h3>

            <div className="grid md:grid-cols-2 gap-6">

              {/* Field */}
              <div className="md:col-span-2">
                <label className="block text-sm text-[#071325] mb-2 font-medium">
                  מגמה <span className="text-red-500">*</span>
                </label>

                <select
                  className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none transition text-sm text-[#071325] appearance-none ${
                    errors.field
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-[#d5c9b5] focus:border-[#071325]'
                  }`}
                  {...register('field', {
                    required: 'יש לבחור מגמה',
                  })}
                >
                  <option value="" disabled hidden>
                    בחר מגמה
                  </option>

                  <option value="Computer Science">
                    מדעי המחשב
                  </option>

                  <option value="Engineering">
                    הנדסת תוכנה
                  </option>

                  <option value="Math">
                    מתמטיקה
                  </option>

                  <option value="Other">
                    אחר
                  </option>
                </select>

                {errors.field && (
                  <p className="text-red-500 text-xs mt-1 mr-1">
                    {errors.field.message}
                  </p>
                )}
              </div>

              {/* Institution */}
              <div className="md:col-span-2">
                <label className="block text-sm text-[#071325] mb-2 font-medium">
                  שם מוסד לימודים <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  placeholder="הזן שם המוסד האקדמי"
                  className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none transition text-sm text-[#071325] placeholder-[#071325]/40 ${
                    errors.institution
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-[#d5c9b5] focus:border-[#071325]'
                  }`}
                  {...register('institution', {
                    required: 'יש להזין שם מוסד',
                  })}
                />

                {errors.institution && (
                  <p className="text-red-500 text-xs mt-1 mr-1">
                    {errors.institution.message}
                  </p>
                )}
              </div>

              {/* Years */}
              <div>
                <label className="block text-sm text-[#071325] mb-2 font-medium">
                  מספר שנות לימוד <span className="text-red-500">*</span>
                </label>

                <input
                  type="number"
                  placeholder="לדוגמה: 3"
                  min="1"
                  max="10"
                  className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none transition text-sm text-[#071325] placeholder-[#071325]/40 ${
                    errors.years
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-[#d5c9b5] focus:border-[#071325]'
                  }`}
                  {...register('years', {
                    required: 'יש להזין מספר שנים',
                    min: {
                      value: 1,
                      message: 'מינימום שנה אחת',
                    },
                  })}
                />

                {errors.years && (
                  <p className="text-red-500 text-xs mt-1 mr-1">
                    {errors.years.message}
                  </p>
                )}
              </div>

              {/* Tuition */}
              <div>
                <label className="block text-sm text-[#071325] mb-2 font-medium">
                  שכר לימוד שנתי (₪)
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="number"
                  placeholder="לדוגמה: 12000"
                  min="0"
                  className={`w-full bg-white border rounded-lg px-4 py-3 focus:outline-none transition text-sm text-[#071325] placeholder-[#071325]/40 ${
                    errors.tuition
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-[#d5c9b5] focus:border-[#071325]'
                  }`}
                  {...register('tuition', {
                    required: 'יש להזין שכר לימוד',
                    min: {
                      value: 0,
                      message: 'ערך לא תקין',
                    },
                  })}
                />

                {errors.tuition && (
                  <p className="text-red-500 text-xs mt-1 mr-1">
                    {errors.tuition.message}
                  </p>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-gray-50 border-t border-[#e2dfd8] px-8 py-6 flex items-center justify-between mt-4 rounded-b-2xl">

        <button
          onClick={prevStep}
          type="button"
          className="flex items-center gap-2 px-6 py-2.5 text-[#071325] font-medium border-2 border-[#071325] rounded-xl hover:bg-[#071325] hover:text-white transition-all duration-200 cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>

          <span>חזור לשלב הקודם</span>
        </button>

        <button
          onClick={handleSubmit(onValidSubmit)}
          type="button"
          className="flex items-center gap-2 px-8 py-2.5 bg-[#071325] text-white font-medium rounded-xl hover:bg-[#071325]/80 shadow-lg shadow-[#071325]/20 transition-all duration-200 cursor-pointer"
        >
          <span>המשך לשלב הבא</span>

          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

      </div>
    </div>
  );
}