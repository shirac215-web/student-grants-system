import { useRef, useState } from "react";

export const FormStep5 = ({
  nextStep,
  prevStep,
  formData,
  setFormData,
  saveDraft,
}) => {
  // אם המשתמש חזר לשלב הזה, מציגים את שמות הקבצים שכבר בחר
  const saved = formData.fileNames || {};
  const initial = (key) => (saved[key] ? { name: saved[key] } : null);

  const [files, setFiles] = useState({
    studentId: initial("studentId"),
    fatherId: initial("fatherId"),
    motherId: initial("motherId"),
    studyProof: initial("studyProof"),
    bankProof: initial("bankProof"),
  });

  const labels = {
    studentId: "צילום ת.ז סטודנט",
    fatherId: "צילום ת.ז אב",
    motherId: "צילום ת.ז אם",
    studyProof: "אישור לימודים",
    bankProof: "אישור ניהול חשבון",
  };

  // מעבר לשלב הבא: כל 5 המסמכים הם חובה
  const handleNext = () => {
    const missing = Object.keys(files).filter((key) => !files[key]);
    if (missing.length > 0) {
      alert("יש להעלות את כל המסמכים:\n" + missing.map((key) => labels[key]).join("\n"));
      return;
    }
    const fileNames = Object.fromEntries(
      Object.entries(files).map(([key, file]) => [key, file.name])
    );
    setFormData((prev) => ({ ...prev, fileNames }));
    nextStep();
  };

  const refs = {
    studentId: useRef(null),
    fatherId: useRef(null),
    motherId: useRef(null),
    studyProof: useRef(null),
    bankProof: useRef(null),
  };

  const handleFileChange = (event, key) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFiles((prev) => ({
        ...prev,
        [key]: selectedFile,
      }));
    }
  };

  const removeFile = (key) => {
    setFiles((prev) => ({
      ...prev,
      [key]: null,
    }));

    if (refs[key].current) {
      refs[key].current.value = "";
    }
  };

  const UploadBox = ({
    label,
    fileKey,
    required = false,
  }) => {
    const file = files[fileKey];

    return (
      <div className="flex flex-col gap-[10px]">

        {/* Label */}
        <div className="text-[14px] font-medium text-[#071325]/80">
          {label}

          {required && (
            <span className="text-red-500 mr-1">*</span>
          )}
        </div>

        {/* Upload Zone */}
        <div
          onClick={() => {
            if (!file) {
              refs[fileKey].current.click();
            }
          }}
          className={`
            relative
            border rounded-[22px]
            px-4 py-5
            text-center
            cursor-pointer
            transition-all duration-300
            backdrop-blur-[20px]
            shadow-[0_10px_25px_rgba(0,0,0,0.05)]
            min-h-[150px]
            flex flex-col items-center justify-center

            ${
              file
                ? "border-green-500 bg-green-50"
                : "border-[#d5c9b5] bg-white/85 hover:border-[#071325] hover:bg-[#f8f6f1]"
            }
          `}
        >

          {/* Hidden Input */}
          <input
            type="file"
            ref={refs[fileKey]}
            className="hidden"
            onChange={(event) =>
              handleFileChange(event, fileKey)
            }
          />

          {/* Uploaded State */}
          {file ? (
            <>
              {/* Remove Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(fileKey);
                }}
                className="
                  absolute top-3 left-3
                  w-7 h-7
                  rounded-full
                  bg-white
                  border border-red-200
                  flex items-center justify-center
                  text-red-500
                  text-[14px]
                  font-bold
                  shadow-sm
                  transition-all duration-200
                  hover:bg-red-50 hover:scale-105
                "
              >
                ×
              </button>

              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7 mx-auto mb-[10px] fill-green-500"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>

              <p className="text-[13px] text-green-600 font-medium">
                הקובץ הועלה בהצלחה
              </p>

              <span className="block mt-1 text-[12px] text-gray-500 break-all px-2">
                {file.name}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  refs[fileKey].current.click();
                }}
                className="
                  mt-3
                  text-[12px]
                  font-medium
                  text-[#071325]/70
                  hover:text-[#071325]
                  underline underline-offset-2
                "
              >
                החלף קובץ
              </button>
            </>
          ) : (
            <>
              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7 mx-auto mb-[10px] fill-[#9ca3af]"
              >
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
              </svg>

              <p className="text-[13px] text-[#071325]/70">
                לחץ להעלאת קובץ
              </p>

              <span className="block mt-1 text-[12px] text-[#071325]/40">
                PDF, JPG עד 5MB
              </span>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[760px] mx-auto">

      {/* Main Card */}
      <div
        className="
          overflow-hidden
          rounded-[28px]
          border border-[#d5c9b5]/60
          bg-[#fdfcf9]
          shadow-[0_24px_64px_rgba(0,0,0,0.08)]
        "
      >

        {/* Content */}
        <div className="p-7 md:p-8">

          {/* Header */}
          <div
            className="
              flex items-center gap-4
              mb-8 pb-6
              border-b border-[#d5c9b5]/50
            "
          >

            {/* Icon */}
            <div
              className="
                w-12 h-12 rounded-[14px]
                bg-[#071325]
                flex items-center justify-center
                shadow-[0_8px_24px_rgba(7,19,37,0.18)]
              "
            >
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 fill-white"
              >
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8zm0-4h8v2H8z"/>
              </svg>
            </div>

            {/* Text */}
            <div>
              <h3 className="text-[22px] font-bold text-[#071325]">
                העלאת מסמכים
              </h3>

              <p className="text-[13px] text-[#071325]/50 mt-1">
                שלב 5 מתוך 6 – העלאת קבצים נדרשים
              </p>
            </div>
          </div>

          {/* Upload Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <UploadBox
              label="צילום ת.ז סטודנט + ספח"
              fileKey="studentId"
              required
            />

            <UploadBox
              label="צילום ת.ז אב + ספח"
              fileKey="fatherId"
              required
            />

            <UploadBox
              label="צילום ת.ז אם + ספח"
              fileKey="motherId"
              required
            />

            <UploadBox
              label="אישור לימודים"
              fileKey="studyProof"
              required
            />

            <UploadBox
              label="אישור ניהול חשבון"
              fileKey="bankProof"
              required
            />
          </div>
        </div>

        {/* אזור הכפתורים הוחזר פנימה לתוך מסגרת הטופס הלבנה */}
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
            onClick={handleNext}
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
    </div>
  );
};