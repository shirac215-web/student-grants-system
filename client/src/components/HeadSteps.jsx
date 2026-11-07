import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// ייבוא קומפוננטות השלבים
import Step1Personal from './Step1Personal';
import FromStepTwo from './FromStepTwo';
import Step3Studies from './Step3Studies';
import FromStepFour from './FromStepFour'; // שלב 4 של פרטי הבנק
import { FormStep5 } from './formStep5';
import SubmitRequestStep from './step6-confirm';

// ממיר את הנתונים השטוחים של הטופס למבנה שהשרת (requestModel) מצפה לו
const buildRequestPayload = (data) => ({
  personal: {
    birthDate: data.birthDate,
    city: data.city,
    address: data.address,
    phone: data.phone,
    mobile: data.mobile,
  },
  family: {
    father: { id: data.fatherId, firstName: data.fatherFirstName, lastName: data.fatherLastName },
    mother: { id: data.motherId, firstName: data.motherFirstName, lastName: data.motherLastName },
    siblings: (data.siblings || []).map((s) => ({
      id: s.idNumber,
      firstName: s.firstName,
      lastName: s.lastName,
      birthDate: s.birthDate || null,
    })),
  },
  education: {
    institution: data.institution,
    field: data.field,
    years: Number(data.years),
    tuition: Number(data.tuition),
  },
  bank: {
    bankName: data.bankName,
    branch: data.branchNumber,
    accountNumber: data.accountNumber,
    ownerId: data.accountHolderId,
  },
  // כרגע נשמרים שמות הקבצים בלבד (ראו README)
  files: {
    studentId: data.fileNames?.studentId,
    fatherId: data.fileNames?.fatherId,
    motherId: data.fileNames?.motherId,
    studyApproval: data.fileNames?.studyProof,
    bankApproval: data.fileNames?.bankProof,
  },
});

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem('scholarshipAppUser')) || {};
  } catch {
    return {};
  }
};

export default function HeaderSteps() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentStep = Number(searchParams.get('step')) || 1;

  // המשתמש המחובר, וטיוטה נפרדת לכל משתמש
  const user = readUser();
  const draftKey = `draft_${user.id || 'guest'}`;

  // ה-State המרכזי שומר את כל נתוני הטופס מכל השלבים ביחד.
  // בטעינה הראשונה הוא מתחיל מהטיוטה השמורה של המשתמש, אם יש כזו
  const [formData, setFormData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(draftKey)) || {};
    } catch {
      return {};
    }
  });

  // שמירת טיוטה (ממזגת את הנתונים של השלב הנוכחי עם כל השאר)
  const handleSaveDraft = (childData = {}) => {
    const dataToSave = { ...formData, ...childData };
    setFormData(dataToSave);
    localStorage.setItem(draftKey, JSON.stringify(dataToSave));
    Swal.fire({ icon: 'success', title: 'הטיוטה נשמרה', timer: 1500, showConfirmButton: false });
  };

  // שליחת הבקשה המלאה לשרת (שלב 6)
  const handleFinalSubmit = async () => {
    const token = localStorage.getItem('scholarshipAppToken');

    try {
      const response = await fetch('/api/requests/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(buildRequestPayload(formData)),
      });

      const result = await response.json().catch(() => ({}));

      if (response.status === 401) {
        await Swal.fire({ icon: 'warning', title: 'יש להתחבר מחדש', text: result.message, confirmButtonColor: '#071325' });
        navigate('/login');
        return;
      }

      if (!response.ok) {
        Swal.fire({ icon: 'error', title: 'שליחת הבקשה נכשלה', text: result.message || 'נסו שוב מאוחר יותר', confirmButtonColor: '#071325' });
        return;
      }

      localStorage.removeItem(draftKey);
      await Swal.fire({ icon: 'success', title: 'הבקשה נשלחה בהצלחה!', text: 'אפשר לעקוב אחרי הסטטוס שלה בכל זמן', confirmButtonColor: '#071325' });
      navigate('/request-status');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'אין חיבור לשרת', text: 'בדקו את החיבור לאינטרנט ונסו שוב', confirmButtonColor: '#071325' });
    }
  };

  const handleCancel = () => {
    localStorage.removeItem(draftKey);
    navigate('/dashboard');
  };

  // פונקציות ניווט
  const goToNextStep = () => {
    if (currentStep < 6) setSearchParams({ step: currentStep + 1 });
  };
  const goToPrevStep = () => {
    if (currentStep > 1) setSearchParams({ step: currentStep - 1 });
  };

  const steps = ['פרטים אישיים', 'פרטי משפחה', 'פרטי לימודים', 'פרטי בנק', 'העלאת קבצים', 'אישור ושליחה'];

  const stepProps = {
    nextStep: goToNextStep,
    prevStep: goToPrevStep,
    currentStep,
    formData,
    setFormData,
    saveDraft: handleSaveDraft,
  };

  // key={currentStep} גורם לכל שלב להיטען מחדש עם הנתונים העדכניים
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Personal key={1} {...stepProps} />;
      case 2:
        return <FromStepTwo key={2} {...stepProps} />;
      case 3:
        return <Step3Studies key={3} {...stepProps} />;
      case 4:
        return <FromStepFour key={4} {...stepProps} />;
      case 5:
        return <FormStep5 key={5} {...stepProps} />;
      case 6:
        return (
          <SubmitRequestStep
            formData={formData}
            user={user}
            prevStep={goToPrevStep}
            onSubmit={handleFinalSubmit}
            onCancel={handleCancel}
          />
        );
      default:
        return <div>שגיאה בטעינת השלב</div>;
    }
  };

  const progressWidth = `${((currentStep - 1) / (steps.length - 1)) * 100}%`;

  return (
    <div className="min-h-screen bg-[#f4f2ec] py-12" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 pb-12">
        
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-[#071325] mb-2">הגשת בקשה למענק</h1>
          <p className="text-[#071325] text-sm">מלא את כל השלבים להגשת הבקשה</p>
        </div>

        <div className="flex justify-between items-center mb-12 relative px-4">
          <div className="absolute top-4 left-8 right-8 h-[2px] bg-[#d5c9b5] -z-10"></div>
          <div 
            className="absolute top-4 h-[2px] bg-[#071325] -z-10 transition-all duration-300"
            style={{ width: progressWidth, right: '32px' }}
          ></div>

          {steps.map((step, index) => {
            const stepNum = index + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;

            return (
              <div key={stepNum} className="flex flex-col items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors ${
                    isCompleted
                      ? 'bg-[#071325] border-[#071325] text-white'
                      : isActive
                      ? 'bg-white border-[#071325] text-[#071325] font-bold'
                      : 'bg-white border-[#d5c9b5] text-[#071325]'
                  }`}
                >
                  {isCompleted ? '✓' : stepNum}
                </div>
                <span className={`text-xs ${isActive || isCompleted ? 'font-bold text-[#071325]' : 'text-[#071325] opacity-60'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        <div className="transition-all duration-300">
          {renderCurrentStep()}
        </div>

      </div>
    </div>
  );
}