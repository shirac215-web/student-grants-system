import React, { useState } from 'react';

// ─── Props from HeaderSteps ───────────────────────────────────────────────────
// formData  – the full accumulated form state from all previous steps
// prevStep  – navigates back to step 5
// onSubmit  – async function in HeaderSteps that POST-s to the server
// onCancel  – clears the draft and returns to the dashboard
// user      – the logged-in student (name comes from the account)
const FIELD_LABELS = {
  'Computer Science': 'מדעי המחשב',
  Engineering: 'הנדסת תוכנה',
  Math: 'מתמטיקה',
  Other: 'אחר',
};

export default function SubmitRequestStep({ formData = {}, prevStep, onSubmit, onCancel, user = {} }) {
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!confirmed) {
      alert('יש לאשר את הצהרת הנכונות לפני השליחה');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit();        // calls handleFinalSubmit in HeaderSteps
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('האם אתה בטוח שברצונך לבטל את הבקשה?')) {
      onCancel();
    }
  };

  return (
    <div className="text-[#0d1b2a] font-['Heebo']">
      <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Main Content Card */}
      <div className="card bg-white border border-[#0c1e36]/10 rounded-[24px] shadow-sm" style={{ padding: '40px' }}>
        <div className="card-header flex items-center gap-4 mb-8 pb-6 border-b border-[#0c1e36]/10">
          <div className="bg-gradient-to-br from-[#0c1e36] to-[#1d3557] rounded-[14px] flex items-center justify-center shadow-md shadow-[#0c1e36]/10" style={{ width: '48px', height: '48px' }}>
            <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-[20px] font-bold text-[#0c1e36]">אישור ושליחה</h3>
            <p className="text-[13px] text-[#0c1e36]/50 mt-0.5">שלב 6 מתוך 6 – בדוק את הפרטים ושלח</p>
          </div>
        </div>

        {/* Section 1: Personal Details — rendered from real formData */}
        <div className="summary-section mb-7">
          <div className="text-[14px] font-semibold text-[#0c1e36]/50 uppercase tracking-[0.5px] mb-3.5">פרטים אישיים</div>
          <div className="grid grid-cols-2 gap-3">
            <SummaryItem label="שם מלא" value={`${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || '—'} />
            <SummaryItem label="תאריך לידה" value={formData.birthDate ? new Date(formData.birthDate).toLocaleDateString('he-IL') : '—'} />
            <SummaryItem label="כתובת" value={[formData.address, formData.city].filter(Boolean).join(', ') || '—'} />
            <SummaryItem label="טלפון נייד" value={formData.mobile || '—'} />
          </div>
        </div>

        <div className="h-[1px] bg-[#0c1e36]/10 my-6" />

        {/* Section 2: Academic Details — rendered from real formData */}
        <div className="summary-section mb-7">
          <div className="text-[14px] font-semibold text-[#0c1e36]/50 uppercase tracking-[0.5px] mb-3.5">פרטי לימודים</div>
          <div className="grid grid-cols-2 gap-3">
            <SummaryItem label="מגמה" value={FIELD_LABELS[formData.field] || '—'} />
            <SummaryItem label="מוסד לימודים" value={formData.institution || '—'} />
            <SummaryItem label="שנות לימוד" value={formData.years || '—'} />
            <SummaryItem label="שכר לימוד שנתי" value={formData.tuition ? `₪${Number(formData.tuition).toLocaleString('he-IL')}` : '—'} />
          </div>
        </div>

        <div className="h-[1px] bg-[#0c1e36]/10 my-6" />

        {/* Section 3: Bank Details — rendered from real formData */}
        <div className="summary-section mb-7">
          <div className="text-[14px] font-semibold text-[#0c1e36]/50 uppercase tracking-[0.5px] mb-3.5">פרטי בנק</div>
          <div className="grid grid-cols-2 gap-3">
            <SummaryItem label="שם הבנק" value={formData.bankName || '—'} />
            <SummaryItem label="מספר סניף" value={formData.branchNumber || '—'} />
            <SummaryItem label="מספר חשבון" value={formData.accountNumber || '—'} />
            <SummaryItem label="ת.ז. בעל החשבון" value={formData.accountHolderId || '—'} />
          </div>
        </div>

        <div className="h-[1px] bg-[#0c1e36]/10 my-6" />

        {/* Confirmation checkbox */}
        <div
          className="flex items-start gap-3.5 bg-[#e9e2d5] border border-[#0c1e36]/20 rounded-[14px] mb-7 cursor-pointer"
          style={{ padding: '18px 20px' }}
          onClick={() => setConfirmed((v) => !v)}
        >
          <input
            type="checkbox"
            id="confirm"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="w-5 h-5 accent-[#0c1e36] mt-0.5 shrink-0 cursor-pointer"
          />
          <label htmlFor="confirm" className="text-[14px] text-[#0c1e36] leading-[1.6] font-medium cursor-pointer">
            אני מאשר/ת כי כל הפרטים שמסרתי בטופס זה נכונים ומדויקים, וכי המסמכים שהועלו הם מקוריים ותקפים.
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-2">
          <div className="flex gap-3">
            <button
              onClick={prevStep}
              className="bg-white border border-[#0c1e36]/20 rounded-[12px] text-[#0c1e36] text-[15px] font-medium cursor-pointer transition-all duration-200 hover:bg-[#0c1e36]/5"
              style={{ padding: '12px 24px' }}
            >
              ← הקודם
            </button>
            <button
              onClick={handleCancel}
              className="bg-transparent border border-red-200 rounded-[12px] text-red-600 text-[15px] font-medium cursor-pointer transition-all duration-200 hover:bg-red-50"
              style={{ padding: '12px 24px' }}
            >
              ביטול
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`border border-transparent rounded-[12px] text-white text-[16px] font-bold cursor-pointer transition-all duration-300 shadow-lg shadow-[#0c1e36]/10 ${
              isSubmitting ? 'bg-[#0c1e36]/50 cursor-not-allowed' : 'bg-[#0c1e36] hover:bg-[#1d3557]'
            }`}
            style={{ padding: '13px 36px' }}
          >
            {isSubmitting ? 'שולח...' : 'שליחת הבקשה ✓'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Small helper to keep the summary grid DRY ───────────────────────────────
function SummaryItem({ label, value }) {
  return (
    <div className="bg-[#e9e2d5]/40 border border-[#0c1e36]/5 rounded-[12px]" style={{ padding: '14px 16px' }}>
      <div className="text-[12px] text-[#0c1e36]/60 mb-1">{label}</div>
      <div className="text-[15px] font-medium text-[#0c1e36]">{value}</div>
    </div>
  );
}