
  // פונקציית עזר להצגת עיצוב מתאים לפי הסטטוס מה-DB
import { useState, useEffect } from "react";

// 👑 מחקנו מכאן את ה-getItem הישנים שגרמו ל-undefined!

export default function ScholarshipStatus() {
  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 // עדכני את ה-useEffect שלך ב-ScholarshipStatus.jsx לזה:
useEffect(() => {
  const fetchStatus = async () => {
    try {
      // 1. שליפת המשתמש המחובר מה-localStorage (נשמר בזמן ההתחברות)
      const storedUser = localStorage.getItem("scholarshipAppUser");
      const currentUserId = storedUser ? JSON.parse(storedUser).id : null;

      if (!currentUserId) {
        throw new Error("לא נמצא מזהה משתמש מחובר.");
      }
      
      console.log("Found User ID:", currentUserId);

      // 2. הפנייה לשרת עם ה-ID שמצאנו
      const response = await fetch(`/api/requests/user/${currentUserId}`);

      if (!response.ok) {
        throw new Error("לא נמצאה בקשה עבור משתמש זה.");
      }

      const data = await response.json();
      setRequestData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchStatus();
}, []);

  // ... מכאן והלאה כל שאר הקוד שלך (getStatusConfig וה-return) נשאר בדיוק אותו הדבר!
  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return {
          text: "אושר",
          icon: "✅",
          color: "#1b5e20",
          bg: "rgba(76, 175, 80, 0.15)",
          border: "rgba(76, 175, 80, 0.45)",
          gradient: "linear-gradient(135deg, #2e7d32, #4caf50)",
          shadow: "rgba(76, 175, 80, 0.15)",
          title: "הבקשה שלך אושרה!",
          desc: "שמחים לעדכן שהבקשה למענק אושרה בהצלחה. סכום המענק יועבר לחשבונך בהתאם לתקנון."
        };
      case "rejected":
        return {
          text: "נדחה",
          icon: "❌",
          color: "#b71c1c",
          bg: "rgba(244, 67, 54, 0.15)",
          border: "rgba(244, 67, 54, 0.45)",
          gradient: "linear-gradient(135deg, #c62828, #f44336)",
          shadow: "rgba(244, 67, 54, 0.15)",
          title: "הבקשה נדחתה",
          desc: "לצערנו, לאחר בדיקת הפרטים, הבקשה לא אושרה. לפרטים נוספים ניתן לפנות למזכירות."
        };
      case "pending":
      default:
        return {
          text: "בהמתנה לטיפול",
          icon: "⏳",
          color: "#9a7a00",
          bg: "rgba(161,130,0,0.15)",
          border: "rgba(200,165,0,0.45)",
          gradient: "linear-gradient(135deg, #d4a900, #f0c000)",
          shadow: "rgba(200,160,0,0.15)",
          title: "הבקשה שלך התקבלה",
          desc: "הבקשה נמצאת בתור לטיפול. נעדכן אותך בדוא\"ל כאשר יהיה שינוי בסטטוס."
        };
    }
  };

  // תצוגת טעינה
  if (loading) {
    return (
      <div dir="rtl" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#F2EDE4", fontFamily: "Assistant" }}>
        <h3>טוען נתונים...</h3>
      </div>
    );
  }

  // תצוגת שגיאה (או כשאין בקשה)
  if (error) {
    return (
      <div dir="rtl" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#F2EDE4", fontFamily: "Assistant", padding: 20 }}>
        <div style={{ background: "white", padding: 30, borderRadius: 12, textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <p style={{ color: "#b71c1c", fontWeight: "bold", fontSize: 18 }}>{error}</p>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(requestData?.status);
  
  // פירסור תאריך הגשה מה-DB לפורמט קריא
  const formattedDate = requestData?.createdAt 
    ? new Date(requestData.createdAt).toLocaleDateString("he-IL") 
    : "---";

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#F2EDE4",
        fontFamily: "'Varela Round', 'Assistant', sans-serif",
        color: "#0A192F",
        position: "relative",
      }}
    >
      {/* Blobs */}
      <div style={{ position: "fixed", width: 580, height: 580, borderRadius: "50%", background: "radial-gradient(circle, rgba(10,25,47,0.18) 0%, transparent 70%)", top: "-120px", left: "-100px", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle, rgba(10,25,47,0.14) 0%, transparent 70%)", bottom: "-80px", right: "-60px", filter: "blur(70px)", pointerEvents: "none", zIndex: 0 }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Varela+Round&family=Assistant:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { min-height: 100%; width: 100%; background: #F2EDE4; }
        .display-font { font-family: 'Assistant', sans-serif; letter-spacing: -0.01em; }
        .body-font { font-family: 'Assistant', sans-serif; }
        .label-font { font-family: 'Assistant', sans-serif; font-size: 12px; font-weight: 600; color: #0A192F; opacity: 0.45; }
      `}</style>

      {/* Main content */}
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "56px 20px", position: "relative", zIndex: 1 }}>

        {/* Page title */}
        <div style={{ textAlign: "right", marginBottom: 36 }}>
          <h1 className="display-font" style={{ fontSize: 30, fontWeight: 700, margin: 0, color: "#0A192F" }}>
            סטטוס הבקשה
          </h1>
          <p className="body-font" style={{ color: "#5C6370", marginTop: 6, fontSize: 15, fontWeight: 400 }}>
            מצב הבקשה האחרונה שהגשת עבור {requestData?.userSnapshot?.firstName} {requestData?.userSnapshot?.lastName}
          </p>
        </div>

        {/* Status card */}
        <div
          style={{
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            borderRadius: 18,
            border: "1px solid rgba(10,25,47,0.09)",
            padding: "50px 40px 44px",
            textAlign: "center",
            marginBottom: 20,
            boxShadow: "0 24px 60px rgba(0,0,0,0.06)",
          }}
        >
          {/* Dynamic Badge row */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28, flexDirection: "row" }}>
            <div
              style={{
                background: statusConfig.bg,
                border: `1px solid ${statusConfig.border}`,
                borderRadius: 999,
                padding: "8px 22px",
                color: statusConfig.color,
                fontWeight: 700,
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "'Assistant', sans-serif",
              }}
            >
              {statusConfig.icon} {statusConfig.text}
            </div>

            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: statusConfig.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 0 6px ${statusConfig.shadow}`,
                flexShrink: 0,
              }}
            >
              <span style={{ color: "#fff", fontSize: 24, fontWeight: 900, fontFamily: "sans-serif" }}>
                {statusConfig.icon}
              </span>
            </div>
          </div>

          <h2 className="display-font" style={{ fontSize: 22, fontWeight: 700, margin: "0 0 14px", color: "#0A192F" }}>
            {statusConfig.title}
          </h2>
          <p className="body-font" style={{ color: "#5C6370", fontSize: 15, lineHeight: 1.9, margin: 0, fontWeight: 400 }}>
            {statusConfig.desc}
          </p>
        </div>

        {/* Details card */}
        <div
          style={{
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            borderRadius: 18,
            border: "1px solid rgba(10,25,47,0.09)",
            padding: "28px 36px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, direction: "rtl" }}>
            <span className="label-font" style={{ fontSize: 11, fontWeight: 700, color: "#0A192F", opacity: 0.5, whiteSpace: "nowrap" }}>
              פרטי הבקשה
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(10,25,47,0.12)" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div style={{ textAlign: "right" }}>
              <div className="body-font" style={{ color: "#5C6370", fontSize: 13, marginBottom: 6, fontWeight: 400 }}>
                תאריך הגשה
              </div>
              <div className="display-font" style={{ fontWeight: 700, fontSize: 18, color: "#0A192F" }}>
                {formattedDate}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="body-font" style={{ color: "#5C6370", fontSize: 13, marginBottom: 6, fontWeight: 400 }}>
                מגמה / תחום לימוד
              </div>
              <div className="display-font" style={{ fontWeight: 700, fontSize: 18, color: "#0A192F" }}>
                {requestData?.education?.field || "לא צוין"}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

