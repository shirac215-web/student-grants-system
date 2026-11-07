const express = require('express');
const router = express.Router();
const { create, read, readOne, update, updateStatus, updateEducation, remove, getRequestStatus, submitRequest } = require('../controllers/requestController');
const auth = require('../middleware/auth');

// Student: submit the full form (identity comes from the JWT)
router.post('/submit', auth, submitRequest);

// Student: status of their latest request (used by the status page)
router.get('/user/:userId', getRequestStatus);

// Management routes: require a logged-in user, so request data
// (ID numbers, bank details) is never publicly readable
router.post('/', auth, create);
router.get('/', auth, read);
router.get('/:id', auth, readOne);
router.put('/:id', auth, update);
router.patch('/:id/status', auth, updateStatus);
router.patch('/:id/education', auth, updateEducation);
router.delete('/:id', auth, remove);

module.exports = router;
