const mongoose = require("mongoose");

// ─── FIX: field is 'idNumber' (was 'nationalId' in the old schema) ────────────
// authController queries User.findOne({ idNumber }) so the schema must match.
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  idNumber:  { type: String, required: true, unique: true, trim: true },
  email:     { type: String, required: true, unique: true, trim: true, lowercase: true },
  password:  { type: String, required: true },
  // תפקיד במערכת: סטודנט רגיל או מנהל. לא ניתן לבחור תפקיד בהרשמה,
  // מנהל מוגדר ידנית במסד הנתונים
  role:      { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);