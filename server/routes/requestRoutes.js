const express = require('express');
const router = express.Router();
const { create, read, readOne, update, updateStatus, updateEducation, remove, getRequestStatus, submitRequest } = require('../controllers/requestController');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

// ─── Student ─────────────────────────────────────────────────────────────────
// Submit the full form (identity comes from the JWT)
router.post('/submit', auth, submitRequest);
// Status of the student's latest request (used by the status page)
router.get('/user/:userId', getRequestStatus);

// ─── Admin only ──────────────────────────────────────────────────────────────
// Request data includes ID numbers and bank details, so only a logged-in
// admin can list, view, approve/reject, edit or delete requests
router.get('/', auth, requireAdmin, read);
router.get('/:id', auth, requireAdmin, readOne);
router.patch('/:id/status', auth, requireAdmin, updateStatus);
router.post('/', auth, requireAdmin, create);
router.put('/:id', auth, requireAdmin, update);
router.patch('/:id/education', auth, requireAdmin, updateEducation);
router.delete('/:id', auth, requireAdmin, remove);

module.exports = router;
