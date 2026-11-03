const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ── הרשמה ──────────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { firstName, lastName, idNumber, email, password } = req.body;

    // 1. בדיקה אם המשתמש כבר קיים
    const existingUser = await User.findOne({ $or: [{ idNumber }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "משתמש עם פרטים אלו כבר קיים במערכת" });
    }

    // 2. הצפנת הסיסמה
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. יצירת המשתמש
    const newUser = new User({
      firstName,
      lastName,
      idNumber,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "המשתמש נרשם בהצלחה" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "שגיאת שרת בתהליך ההרשמה" });
  }
};

// ── התחברות ────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { idNumber, password } = req.body;

    // 1. חיפוש לפי מספר זהות
    // ─── FIX: field name is 'idNumber' — matches the User schema ─────────────
    const user = await User.findOne({ idNumber });
    if (!user) {
      return res.status(400).json({ error: "תעודת זהות או סיסמה שגויים" });
    }

    // 2. בדיקת סיסמה
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "תעודת זהות או סיסמה שגויים" });
    }

    // 3. יצירת JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    // ─── FIX: return firstName + lastName so Navbar and Login can display them ─
    res.status(200).json({
      message: "התחברת בהצלחה",
      token,
      user: {
        id:        user._id,
        firstName: user.firstName,
        lastName:  user.lastName,
        email:     user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "שגיאת שרת בתהליך ההתחברות" });
  }
};

module.exports = { register, login };
