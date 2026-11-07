const jwt = require("jsonwebtoken");

// ── Middleware לאימות משתמש מחובר ─────────────────────────────
// מצפה לכותרת: Authorization: Bearer <token>
// אם הטוקן תקין, שומר את מזהה המשתמש ב-req.userId וממשיך הלאה
module.exports = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "נדרשת התחברות למערכת" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.userId = payload.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "תוקף ההתחברות פג, יש להתחבר מחדש" });
  }
};
