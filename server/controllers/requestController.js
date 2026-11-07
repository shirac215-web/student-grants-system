const requestModel = require('../models/requestModel');
const User = require('../models/user');
const mongoose = require('mongoose');

// ─── CREATE ───────────────────────────────────────────────────────────────────
const create = (req, res) => {
  const new_request = new requestModel(req.body);
  new_request.save()
    .then(request => res.status(201).send(request))
    .catch(error => res.status(500).send({ error: error.message }));
};

// ─── READ ALL ─────────────────────────────────────────────────────────────────
const read = (req, res) => {
  requestModel.find().sort({ createdAt: -1 }) // newest first
    .then(requests => res.status(200).send(requests))
    .catch(error => res.status(500).send({ error: error.message }));
};

// ─── READ ONE ─────────────────────────────────────────────────────────────────
const readOne = (req, res) => {
  requestModel.findById(req.params.id)
    .then(request => {
      if (!request) return res.status(404).send({ error: 'Request not found' });
      return res.status(200).send(request);
    })
    .catch(error => res.status(500).send({ error: error.message }));
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
const update = (req, res) => {
  requestModel.findOneAndUpdate(
    { 'userSnapshot.nationalId': String(req.params.id).trim() },
    { $set: req.body },
    { new: true, runValidators: true }
  )
    .then(request => {
      if (!request) return res.status(404).send({ error: 'Request not found' });
      return res.status(200).send(request);
    })
    .catch(error => res.status(500).send({ error: error.message }));
};

// ─── UPDATE STATUS ────────────────────────────────────────────────────────────
const updateStatus = (req, res) => {
  const { status } = req.body;
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).send({ error: 'Invalid status value' });
  }
  requestModel.findByIdAndUpdate(
    req.params.id,
    { $set: { status } },
    { new: true }
  )
    .then(request => {
      if (!request) return res.status(404).send({ error: 'Request not found' });
      return res.status(200).send(request);
    })
    .catch(error => res.status(500).send({ error: error.message }));
};

// ─── UPDATE EDUCATION ─────────────────────────────────────────────────────────
const updateEducation = async (req, res) => {
  try {
    const { education } = req.body;
    const request = await requestModel.findByIdAndUpdate(
      req.params.id,
      { education },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
const remove = (req, res) => {
  requestModel.findOneAndDelete({ 'userSnapshot.nationalId': String(req.params.id).trim() })
    .then(request => {
      if (!request) return res.status(404).send({ error: 'Request not found' });
      return res.status(200).send({ message: 'Request deleted successfully' });
    })
    .catch(error => res.status(500).send({ error: error.message }));
};

// ─── GET BY USER ID (for status page) ────────────────────────────────────────
const getRequestStatus = async (req, res) => {
  try {
    const objectId = new mongoose.Types.ObjectId(req.params.userId);
    const request = await requestModel.findOne({ userId: objectId }).sort({ createdAt: -1 });
    if (!request) return res.status(404).json({ message: 'No request found for this user' });
    res.json({ status: request.status, createdAt: request.createdAt, education: request.education, userSnapshot: request.userSnapshot });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── SUBMIT (logged-in student submits the full 6-step form) ────────────────
// userId comes from the JWT (auth middleware), never from the request body,
// so a student can only submit a request for themselves.
const submitRequest = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { personal, family, education, bank, files } = req.body;

    const request = await requestModel.create({
      userId: user._id,
      userSnapshot: {
        nationalId: user.idNumber,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      status: 'pending',
      personal,
      family,
      education,
      bank,
      files,
    });

    res.status(201).json({ message: 'Request submitted successfully', requestId: request._id });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'חסרים פרטים בטופס', details: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = { create, read, readOne, update, updateStatus, updateEducation, remove, getRequestStatus, submitRequest };
