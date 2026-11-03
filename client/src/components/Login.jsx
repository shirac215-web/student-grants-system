import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const gradCap = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="#F5F1E9" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18V17l7 4 7-4v-3.82L12 17l-7-3.82z"/>
  </svg>
);

// ─── FIX: accept auth as a prop ───────────────────────────────────────────────
export default function Login({ auth }) {
  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!idNumber.trim() || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'חסרים פרטים',
        text: 'נא למלא את כל השדות',
        confirmButtonColor: '#0A192F'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idNumber: idNumber.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        auth.login(data.user, data.token);

        Swal.fire({
          icon: 'success',
          title: `ברוך הבא, ${data.user.firstName}!`,
          text: 'התחברת בהצלחה',
          timer: 2000,
          showConfirmButton: false
        });
        navigate("/dashboard");
      } else {
        Swal.fire({
          icon: 'error',
          title: 'שגיאה בהתחברות',
          text: data.error || "אירעה שגיאה",
          confirmButtonColor: '#d33'
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'תקלה בשרת',
        text: 'שגיאה בתקשורת עם השרת, נסה שוב מאוחר יותר',
        confirmButtonColor: '#d33'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;800;900&display=swap');
        .login-page-container { font-family: 'Heebo', sans-serif !important; }
        .login-page-container input, .login-page-container button, .login-page-container label { font-family: 'Heebo', sans-serif !important; }
        .login-page-container input::placeholder { color: #A0AEC0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="login-page-container min-h-screen bg-[#F2EDE4] flex flex-col items-center justify-start relative overflow-x-hidden pt-12 pb-12 px-4" style={{ direction: "rtl" }}>
        <div className="flex flex-col items-center z-10 w-full max-w-[420px]" style={{ animation: "fadeUp 0.6s ease-out" }}>
          <div className="w-[64px] h-[64px] rounded-[20px] bg-[#0A192F] flex items-center justify-center mb-4 shadow-xl">{gradCap}</div>
          <h1 style={{ color: "#0A192F", fontSize: "26px", fontWeight: 800, marginBottom: "4px" }}>מערכת מענקים לסטודנטים</h1>
          <p style={{ color: "#5C6370", fontSize: "14px", marginBottom: "24px" }}>ניהול בקשות מענק אקדמי</p>

          <form onSubmit={handleLogin} className="w-full flex flex-col" style={{ background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(12px)", borderRadius: "24px", padding: "28px", gap: "20px", boxShadow: "0 20px 40px rgba(0,0,0,0.05)", border: "1px solid rgba(255, 255, 255, 0.5)" }}>

            <div className="flex bg-[#E5E0D5] p-1 rounded-xl mb-2">
              <button type="button" style={{ flex: 1, padding: "10px", borderRadius: "9px", border: "none", fontWeight: 800, background: "#0A192F", color: "#F5F1E9" }}>כניסה למערכת</button>
              <button type="button" onClick={() => navigate("/register")} style={{ flex: 1, padding: "10px", borderRadius: "9px", border: "none", cursor: "pointer", fontWeight: 800, background: "transparent", color: "#5C6370" }}>הרשמה</button>
            </div>

            <div className="flex flex-col" style={{ gap: "6px" }}>
              <label style={{ color: "#0A192F", fontSize: "13px", fontWeight: 700 }}>מספר זהות</label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="הכנס מספר זהות"
                style={{ background: "#FFFFFF", border: "1px solid #D1D5DB", borderRadius: "12px", padding: "12px 14px" }}
              />
            </div>

            <div className="flex flex-col" style={{ gap: "6px" }}>
              <label style={{ color: "#0A192F", fontSize: "13px", fontWeight: 700 }}>סיסמה</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="הכנס סיסמה"
                style={{ background: "#FFFFFF", border: "1px solid #D1D5DB", borderRadius: "12px", padding: "12px 14px" }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "#0A192F", color: "#F5F1E9", fontSize: "16px", fontWeight: 800, marginTop: "4px", cursor: isLoading ? "not-allowed" : "pointer" }}
            >
              {isLoading ? "מתחבר..." : "כניסה למערכת"}
            </button>

            <p style={{ color: "#5C6370", fontSize: "13px", textAlign: "center", marginTop: "4px" }}>
              אין לך חשבון?{" "}
              <span onClick={() => navigate("/register")} style={{ color: "#0A192F", cursor: "pointer", fontWeight: 700, textDecoration: "underline" }}>
                צור אותו עכשיו...
              </span>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}