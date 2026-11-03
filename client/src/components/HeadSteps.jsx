import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// ייבוא הקומפוננטות המוכנות בלבד
import FromStepTwo from './FromStepTwo'; 
import FromStepFour from './FromStepFour'; // שלב 4 של פרטי הבנק
import Step3Studies from './Step3Studies';
import { FormStep5 } from './formStep5';
import SubmitRequestStep from './step6-confirm';

export default function HeaderSteps() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStep = Number(searchParams.get('step')) || 1;
  const [requestId, setRequestId] = useState(null);

  // הגדרת מפתח ייחודי לטיוטה עבור כל משתמש
  const userName = localStorage.getItem('userFirstName') || 'guest';
  const draftKey = `draft_${userName}`;

  // ה-State המרכזי שומר את כל נתוני הטופס ביחד
  const [formData, setFormData] = useState({
    // שדות שלב 4 (פרטי בנק)
    accountHolderId: '',
    bankName: '',
    branchNumber: '',
    accountNumber: '',
    // ניתן להוסיף כאן עוד שדות לשאר השלבים...
  });

  // טעינת הטיוטה האישית כשהאפליקציה עולה
  useEffect(() => {
    const savedPersonalDraft = localStorage.getItem(draftKey);
    if (savedPersonalDraft) {
      setFormData(JSON.parse(savedPersonalDraft));
    }
  }, [draftKey]); // ירוץ שוב רק אם המשתמש התחלף

  // פונקציה גלובלית לשמירת הטיוטה (שומרת תחת השם האישי)
  const handleSaveDraft = (childData = {}) => {
    const dataToSave = { ...formData, ...childData }; // ממזג את המידע מהאבא עם המידע מהילד
    setFormData(dataToSave);
    
    // שומרים ב-localStorage תחת המפתח האישי של המשתמש
    localStorage.setItem(draftKey, JSON.stringify(dataToSave)); 
    
    alert('כל הנתונים נשמרו כטיוטה בהצלחה!');
  };

  // פונקציית עדכון השדות הגלובלית
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // פונקציות ניווט
  const goToNextStep = () => {
    if (currentStep < 6) setSearchParams({ step: currentStep + 1 });
  };
  const goToPrevStep = () => {
    if (currentStep > 1) setSearchParams({ step: currentStep - 1 });
  };

  const steps = ['פרטים אישיים', 'פרטי משפחה', 'פרטי לימודים', 'פרטי בנק', 'העלאת קבצים', 'אישור ושליחה'];

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-white border border-[#e2dfd8] rounded-2xl p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-[#071325] mb-2">שלב 1: פרטים אישיים</h2>
            <p className="text-gray-500 mb-6">הקומפוננטה הזו עדיין בבנייה...</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => handleSaveDraft()} className="px-6 py-2 border border-[#d5c9b5] text-[#071325] rounded-lg">שמור טיוטה</button>
              <button onClick={goToNextStep} className="px-6 py-2 bg-[#071325] text-white rounded-lg font-bold">דילוג לשלב הבא</button>
            </div>
          </div>
        );

      case 2:
        return <FromStepTwo nextStep={goToNextStep} prevStep={goToPrevStep} formData={formData} setFormData={setFormData} currentStep={currentStep} saveDraft={handleSaveDraft} />;

      case 3:
        return (
          <Step3Studies
            nextStep={goToNextStep}
            prevStep={goToPrevStep}
            currentStep={currentStep}
            requestId={requestId}
          />
        );

      case 4:
        return <FromStepFour formData={formData} handleChange={handleChange} nextStep={goToNextStep} prevStep={goToPrevStep} saveDraft={handleSaveDraft} />;

      case 5:
        return (
          <FormStep5
            nextStep={goToNextStep}
            prevStep={goToPrevStep}
            currentStep={currentStep}
            formData={formData}
            setFormData={setFormData}
            saveDraft={handleSaveDraft}
          />
        );

      case 6:
        return (
      <SubmitRequestStep
      prevStep={goToPrevStep}
      currentStep={currentStep}
      saveDraft={handleSaveDraft}
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