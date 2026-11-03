import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const gradCap = (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#F5F1E9" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18V17l7 4 7-4v-3.82L12 17l-7-3.82z"/>
  </svg>
);

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const tempErrors = {};
    const nameRegex = /^[a-zA-Zא-ת\s]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!form.firstName.trim()) tempErrors.firstName = "שם פרטי הוא שדה חובה";
    else if (!nameRegex.test(form.firstName.trim())) tempErrors.firstName = "שם פרטי חייב להכיל אותיות בלבד";
    else if (form.firstName.trim().length < 2) tempErrors.firstName = "שם פרטי חייב להכיל לפחות 2 אותיות";

    if (!form.lastName.trim()) tempErrors.lastName = "שם משפחה הוא שדה חובה";
    else if (!nameRegex.test(form.lastName.trim())) tempErrors.lastName = "שם משפחה חייב להכיל אותיות בלבד";
    else if (form.lastName.trim().length < 2) tempErrors.lastName = "שם משפחה חייב להכיל לפחות 2 אותיות";

    if (!form.idNumber.trim()) tempErrors.idNumber = "מספר זהות הוא שדה חובה";
    else if (!/^\d{9}$/.test(form.idNumber.trim())) tempErrors.idNumber = "מספר זהות חייב להכיל בדיוק 9 ספרות";

    if (!form.email.trim()) tempErrors.email = "כתובת אימייל היא שדה חובה";
    else if (!emailRegex.test(form.email.trim())) tempErrors.email = "כתובת האימייל אינה תקינה";

    if (!form.password) tempErrors.password = "סיסמה היא שדה חובה";
    else if (form.password.length < 6) tempErrors.password = "הסיסמה חייבת להכיל לפחות 6 תווים";
    else if (!/[a-zA-Zא-ת]/.test(form.password)) tempErrors.password = "הסיסמה חייבת להכיל לפחות אות אחת";
    else if (!/[0-9]/.test(form.password)) tempErrors.password = "הסיסמה חייבת להכיל לפחות מספר אחד";
    else if (!/[@$!%*?&_#^()-]/.test(form.password)) tempErrors.password = "הסיסמה חייבת להכיל סימן מיוחד";

    if (form.password !== form.confirmPassword) tempErrors.confirmPassword = "הסיסמאות אינן תואמות";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Swal.fire({
        icon: 'warning',
        title: 'טופס לא תקין',
        text: 'נא לוודא שכל השדות מלאים לפי הדרישות',
        confirmButtonColor: '#0A192F'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          idNumber: form.idNumber.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'נרשמת בהצלחה!',
          text: 'החשבון נוצר, מעביר אותך לדף ההתחברות',
          timer: 2000,
          showConfirmButton: false
        });
        setForm({ firstName: "", lastName: "", idNumber: "", email: "", password: "", confirmPassword: "" });
        navigate("/login");
      } else {
        Swal.fire({
          icon: 'error',
          title: 'שגיאה ברישום',
          text: data.error || "אירעה שגיאה בשרת",
          confirmButtonColor: '#d33'
        });
      }
    } catch (err) {
      console.error("שגיאה ברישום:", err);
      Swal.fire({
        icon: 'error',
        title: 'שגיאת תקשורת',
        text: 'לא ניתן להתחבר לשרת כרגע',
        confirmButtonColor: '#d33'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { key: "firstName", label: "שם פרטי", placeholder: "הזן שם פרטי", type: "text" },
    { key: "lastName", label: "שם משפחה", placeholder: "הזן שם משפחה", type: "text" },
    { key: "idNumber", label: "מספר זהות", placeholder: "הזן מספר זהות", type: "text" },
    { key: "email", label: "אימייל", placeholder: "הזן אימייל (באנגלית)", type: "email" },
    { key: "password", label: "סיסמה", placeholder: "בחר סיסמה חזקה", type: "password" },
    { key: "confirmPassword", label: "אימות סיסמה", placeholder: "הזן סיסמה שוב", type: "password" },
  ];

  return (
    <div className="min-h-screen bg-[#F2EDE4] flex justify-center relative overflow-y-auto px-4 pt-10 pb-12 select-none font-['Heebo']" style={{ direction: "rtl" }}>
      <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      <div className="fixed w-[580px] h-[580px] rounded-full -top-[120px] -left-[100px] blur-[80px] pointer-events-none bg-gradient-to-br from-[#0a192f]/18 to-transparent" />
      <div className="fixed w-[450px] h-[450px] rounded-full -bottom-[80px] -right-[60px] blur-[70px] pointer-events-none bg-gradient-to-tl from-[#0a192f]/14 to-transparent" />

      <div className="flex flex-col items-center gap-4 z-10 w-full max-w-[480px] mt-6 animate-[fadeUp_0.7s_ease_both]">
        <div className="mb-1">
          <div className="w-[68px] h-[68px] rounded-[18px] bg-[#0A192F] flex items-center justify-center shadow-[0_8px_32px_rgba(10,25,47,0.25)]">
            {gradCap}
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-[#0A192F] text-[26px] font-[800] tracking-[-0.3px]">מערכת מענקים לסטודנטים</h1>
          <p className="text-[#5C6370] text-sm font-[300] mt-1">ניהול בקשות מענק אקדמי</p>
        </div>

        <div className="w-full flex flex-col bg-white/70 backdrop-blur-[18px] border border-[#0A192F]/10 rounded-[20px] p-7 gap-[18px] shadow-[0_24px_60px_rgba(0,0,0,0.08)]">

          <div className="flex rounded-xl bg-[#E5E0D5] p-1 gap-1">
            <button type="button" style={{ flex: 1 }} className="py-2.5 rounded-[9px] text-[15px] font-[600] bg-[#0A192F] text-[#F5F1E9] shadow-[0_4px_14px_rgba(10,25,47,0.2)]">
              הרשמה
            </button>
            <button type="button" onClick={() => navigate("/login")} className="flex-1 py-2.5 rounded-[9px] text-[15px] font-[600] transition-all duration-200 outline-none cursor-pointer bg-transparent text-[#5C6370] hover:opacity-80">
              כניסה למערכת
            </button>
          </div>

          {fields.map(({ key, label, placeholder, type }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-[#0A192F] text-sm font-[600] text-right">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={handleChange(key)}
                placeholder={placeholder}
                dir="rtl"
                className={`w-full bg-white border rounded-xl py-3 px-[18px] text-[#0A192F] text-[15px] text-right placeholder-[#A0AEC0] transition-all duration-200 outline-none focus:border-[#0A192F] focus:ring-[3px] focus:ring-[#0A192F]/15 ${
                  errors[key] ? "border-[#E53E3E] focus:border-[#E53E3E] focus:ring-[#E53E3E]/15" : "border-[#D1D5DB]"
                }`}
              />
              {errors[key] && <span className="text-[#E53E3E] text-xs text-right font-medium mt-0.5">{errors[key]}</span>}
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full py-3.5 rounded-xl text-base font-[700] tracking-[0.3px] shadow-[0_6px_24px_rgba(10,25,47,0.2)] mt-1 transition-all duration-200 outline-none active:scale-[0.98] ${
              isLoading ? "bg-[#0A192F]/70 text-[#F5F1E9]/80 cursor-not-allowed" : "bg-[#0A192F] text-[#F5F1E9] cursor-pointer hover:opacity-92"
            }`}
          >
            {isLoading ? "יוצר חשבון..." : "יצירת חשבון"}
          </button>

          <p className="text-[#5C6370] text-[13px] text-center -mt-1">
            כבר יש לך חשבון?{" "}
            <span onClick={() => navigate("/login")} className="text-[#0A192F] cursor-pointer font-[600] underline underline-offset-2 hover:opacity-80">
              כניסה למערכת
            </span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}