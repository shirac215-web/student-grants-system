const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  userSnapshot: {
    nationalId: String,
    firstName: String,
    lastName: String
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
    index: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  personal: {
    birthDate: { type: Date, required: true },
    city:      { type: String, required: true },
    address:   { type: String, required: true },
    phone:     String,
    mobile:    { type: String, required: true }
  },

  family: {
    father: {
      id:        { type: String, required: true },
      firstName: String,
      lastName:  String
    },
    mother: {
      id:        { type: String, required: true },
      firstName: String,
      lastName:  String
    },
    siblings: [
      {
        id:        String,
        firstName: String,
        lastName:  String,
        birthDate: Date
      }
    ]
  },

  education: {
    institution: { type: String, required: true },
    field: {
      type: String,
      enum: ["Computer Science", "Engineering", "Math", "Other"],
      required: true
    },
    years:   { type: Number, required: true },
    tuition: { type: Number, required: true }
  },

  bank: {
    bankName:      { type: String, required: true },
    branch:        { type: String, required: true },
    accountNumber: { type: String, required: true },
    ownerId:       { type: String, required: true }
  },

  files: {
    studentId:    { type: String, required: true },
    fatherId:     { type: String, required: true },
    motherId:     { type: String, required: true },
    studyApproval:{ type: String, required: true },
    bankApproval: { type: String, required: true }
  }

});

module.exports = mongoose.model("Request", requestSchema);