const User = require("../models/user");

// ── Middleware להרשאת מנהל ─────────────────────────────────────
// רץ אחרי auth.js. בודק את התפקיד מול המסד (ולא רק מתוך הטוקן),
// כך שגם אם הרשאה של מנהל בוטלה, היא נחסמת מיד.
module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("role");
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "אין לך הרשאת מנהל" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
